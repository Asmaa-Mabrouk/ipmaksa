"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isCountry } from "@/lib/countries";
import { getStore } from "@/lib/content/store";
import { checkPassword, createMember, endMemberSession, findMember, getMember, startMemberSession } from "@/lib/members";
import type { MemberDoc } from "@/lib/content/types";

export type AuthState = { error?: string; saved?: boolean; values?: Record<string, string> };

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const hits = new Map<string, number[]>();
const limited = (k: string, max: number, win: number) => {
  const now = Date.now();
  const a = (hits.get(k) ?? []).filter((t) => now - t < win);
  a.push(now);
  hits.set(k, a);
  return a.length > max;
};
const txt = (v: FormDataEntryValue | null, max: number) =>
  (typeof v === "string" ? v : "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);
const loc = (fd: FormData) => (txt(fd.get("lang"), 2) === "en" ? "en" : "ar");
async function ip() {
  return ((await headers()).get("x-forwarded-for") || "").split(",")[0].trim() || "local";
}

export async function registerMember(_: AuthState, fd: FormData): Promise<AuthState> {
  const lang = loc(fd);
  const values = { firstName: txt(fd.get("firstName"), 60), lastName: txt(fd.get("lastName"), 60), email: txt(fd.get("email"), 320), country: txt(fd.get("country"), 2).toUpperCase(), dob: txt(fd.get("dob"), 10) };
  if (txt(fd.get("website"), 50)) return { error: "generic", values };
  if (limited(`reg:${await ip()}`, 5, 60 * 60_000)) return { error: "throttled", values };
  const firstName = txt(fd.get("firstName"), 60);
  const lastName = txt(fd.get("lastName"), 60);
  const email = txt(fd.get("email"), 320).toLowerCase();
  const country = txt(fd.get("country"), 2).toUpperCase();
  const dobRaw = txt(fd.get("dob"), 10);
  const password = typeof fd.get("password") === "string" ? (fd.get("password") as string) : "";
  const password2 = typeof fd.get("password2") === "string" ? (fd.get("password2") as string) : "";
  if (!firstName || !lastName || !isCountry(country)) return { error: "invalid", values };
  if (!EMAIL.test(email)) return { error: "email", values };
  if (password.length < 8 || password.length > 200) return { error: "short", values };
  if (password !== password2) return { error: "mismatch", values };
  if (fd.get("accept") !== "on") return { error: "accept", values };
  if (await findMember(email)) return { error: "exists", values };
  const id = await createMember({
    email, firstName, lastName, country, password, lang,
    dob: /^\d{4}-\d{2}-\d{2}$/.test(dobRaw) ? dobRaw : "",
    photo: "",
  });
  await startMemberSession(id);
  redirect(`/${lang}/profile`);
}

export async function loginMember(_: AuthState, fd: FormData): Promise<AuthState> {
  const lang = loc(fd);
  const email = txt(fd.get("email"), 320).toLowerCase();
  const key = `login:${await ip()}|${email}`;
  if (limited(key, 6, 15 * 60_000)) return { error: "throttled", values: { email } };
  const m = await findMember(email);
  const ok = checkPassword(typeof fd.get("password") === "string" ? (fd.get("password") as string) : "", m?.data ?? null);
  if (!m || !ok) return { error: "credentials", values: { email } };
  await startMemberSession(m.id);
  redirect(`/${lang}/profile`);
}

export async function logoutMember(lang: string) {
  await endMemberSession();
  redirect(`/${lang === "en" ? "en" : "ar"}`);
}

const PHOTO: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

export async function updateProfile(_: AuthState, fd: FormData): Promise<AuthState> {
  const m = await getMember();
  if (!m) return { error: "generic" };
  const firstName = txt(fd.get("firstName"), 60);
  const lastName = txt(fd.get("lastName"), 60);
  const country = txt(fd.get("country"), 2).toUpperCase();
  if (!firstName || !lastName || !isCountry(country)) return { error: "invalid" };
  let photo = m.data.photo;
  const f = fd.get("photo");
  if (f instanceof File && f.size > 0) {
    const ext = PHOTO[f.type];
    if (!ext || f.size > 2 * 1024 * 1024) return { error: "photo" };
    try {
      photo = await getStore().putFile(`member-${m.id}-${Date.now()}${ext}`, Buffer.from(await f.arrayBuffer()), f.type);
    } catch {
      return { error: "generic" };
    }
  }
  const next: MemberDoc = { ...m.data, firstName, lastName, country, photo };
  await getStore().put("members", m.id, next as unknown as Record<string, unknown>);
  revalidatePath("/", "layout");
  return { saved: true };
}
