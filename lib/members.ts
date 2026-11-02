import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { hashPassword, sign, verifyPassword } from "./auth";
import { getStore } from "./content/store";
import type { Doc, MemberDoc } from "./content/types";

const COOKIE = "ipma_member";
const MAX_AGE = 60 * 60 * 24 * 14;

export const memberId = (email: string) =>
  crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 24);

export async function findMember(email: string): Promise<Doc<MemberDoc> | null> {
  const row = await getStore().get("members", memberId(email));
  return row ? { id: row.id, data: row.data as unknown as MemberDoc } : null;
}

export async function createMember(input: Omit<MemberDoc, "passwordHash" | "createdAt" | "badges"> & { password: string }) {
  const { password, ...rest } = input;
  const doc: MemberDoc = { ...rest, passwordHash: hashPassword(password), createdAt: new Date().toISOString(), badges: [] };
  const id = memberId(doc.email);
  await getStore().put("members", id, doc as unknown as Record<string, unknown>);
  return id;
}

export const checkPassword = (password: string, m: MemberDoc | null) =>
  verifyPassword(password, m?.passwordHash ?? hashPassword("x", "dummysalt")) && !!m;

export async function startMemberSession(id: string) {
  const payload = Buffer.from(JSON.stringify({ m: id, x: Math.floor(Date.now() / 1000) + MAX_AGE })).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}
export async function endMemberSession() {
  (await cookies()).delete(COOKIE);
}

/** The signed-in member, or null. */
export async function getMember(): Promise<Doc<MemberDoc> | null> {
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return null;
  const [payload, sig] = c.split(".");
  if (!payload || !sig) return null;
  const good = sign(payload);
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return null;
  try {
    const { m, x } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof x !== "number" || x < Date.now() / 1000 || typeof m !== "string") return null;
    const row = await getStore().get("members", m);
    return row ? { id: row.id, data: row.data as unknown as MemberDoc } : null;
  } catch {
    return null;
  }
}
