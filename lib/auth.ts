import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "ipma_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

type AdminUser = { email: string; hash: string };

/** ADMIN_USERS="email:salt:hashHex,email2:salt:hashHex" generated with `npm run admin:hash`. */
function users(): AdminUser[] {
  const raw = process.env.ADMIN_USERS;
  if (raw) {
    return raw.split(",").map((s) => {
      const [email, salt, hash] = s.trim().split(":");
      return { email: email.toLowerCase(), hash: `${salt}:${hash}` };
    });
  }
  if (process.env.NODE_ENV !== "production") {
    // Development only: admin@ipmaksa.local / ipma-dev-password
    return [{ email: "admin@ipmaksa.local", hash: hashPassword("ipma-dev-password", "devsalt") }];
  }
  return [];
}

export function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
}

const secret = () => {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV !== "production") return "dev-only-session-secret-change-me";
  throw new Error("SESSION_SECRET must be set (16+ characters) in production");
};
export const sign = (v: string) => crypto.createHmac("sha256", secret()).update(v).digest("base64url");

/* in-memory login throttling (per server instance) */
const attempts = new Map<string, { n: number; t: number }>();
export function throttled(key: string) {
  const a = attempts.get(key);
  return !!a && Date.now() - a.t < 15 * 60_000 && a.n >= 5;
}
function noteFailure(key: string) {
  const a = attempts.get(key);
  if (a && Date.now() - a.t < 15 * 60_000) a.n++;
  else attempts.set(key, { n: 1, t: Date.now() });
}

export async function login(email: string, password: string, ip: string) {
  const key = `${ip}|${email.toLowerCase()}`;
  if (throttled(key)) return { ok: false as const, reason: "throttled" as const };
  const u = users().find((x) => x.email === email.trim().toLowerCase());
  // Always run a hash to keep timing similar for unknown users.
  const ok = verifyPassword(password, u?.hash ?? hashPassword("x", "dummysalt"));
  if (!u || !ok) {
    noteFailure(key);
    return { ok: false as const, reason: "invalid" as const };
  }
  attempts.delete(key);
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = Buffer.from(JSON.stringify({ e: u.email, x: exp })).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return { ok: true as const };
}

export async function logout() {
  (await cookies()).delete(COOKIE);
}

/** Returns the signed-in admin's email, or null. Call this in EVERY admin page and server action. */
export async function getSession(): Promise<string | null> {
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return null;
  const [payload, sig] = c.split(".");
  if (!payload || !sig) return null;
  const good = sign(payload);
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return null;
  try {
    const { e, x } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof x !== "number" || x < Date.now() / 1000) return null;
    return users().some((u) => u.email === e) ? (e as string) : null;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const s = await getSession();
  if (!s) throw new Error("Unauthorized");
  return s;
}
