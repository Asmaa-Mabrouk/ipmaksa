import "server-only";
import crypto from "node:crypto";
import { getStore } from "./content/store";

const TTL_MS = 30 * 60_000;
const hash = (t: string) => crypto.createHash("sha256").update(t).digest("hex");

/** One-time reset link token. Only its hash is stored, so a database leak cannot be used to reset accounts. */
export async function createResetToken(memberId: string) {
  const token = crypto.randomBytes(32).toString("base64url");
  await getStore().put("resets", hash(token), { memberId, expires: Date.now() + TTL_MS });
  return token;
}
export async function readResetToken(token: string): Promise<string | null> {
  if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) return null;
  const row = await getStore().get("resets", hash(token));
  if (!row) return null;
  const { memberId, expires } = row.data as { memberId: string; expires: number };
  if (typeof expires !== "number" || expires < Date.now()) {
    await getStore().remove("resets", hash(token));
    return null;
  }
  return memberId;
}
export const burnResetToken = (token: string) => getStore().remove("resets", hash(token));
