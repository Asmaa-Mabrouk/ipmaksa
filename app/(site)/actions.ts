"use server";
import { headers } from "next/headers";
import { getSettings } from "@/lib/content/api";

export type FormState = { status: "idle" | "ok" | "already" | "invalid" | "error" };

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const hits = new Map<string, number[]>();
function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  return arr.length > max;
}
const clean = (v: FormDataEntryValue | null, max: number) =>
  (typeof v === "string" ? v : "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max);
async function ip() {
  const h = await headers();
  return (h.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
}
/** Bots fill the hidden field or submit instantly. Pretend success so they do not retry. */
function looksLikeBot(fd: FormData) {
  if (clean(fd.get("website"), 100)) return true;
  const t = Number(clean(fd.get("t"), 20));
  return Number.isFinite(t) && t > 0 && Date.now() - t < 1500;
}

export async function sendContact(_: FormState, fd: FormData): Promise<FormState> {
  try {
    if (looksLikeBot(fd)) return { status: "ok" };
    if (limited(`msg:${await ip()}`, 3, 10 * 60_000)) return { status: "error" };
    const email = clean(fd.get("email"), 320);
    const name = clean(fd.get("name"), 100);
    const message = clean(fd.get("message"), 4000);
    if (!name || !message || !EMAIL.test(email)) return { status: "invalid" };
    const subject = clean(fd.get("subject"), 150);
    const settings = await getSettings();
    const to = process.env.CONTACT_TO || settings.email;
    if (!process.env.SMTP_HOST) {
      // No mail server configured: never pretend the message was delivered in production.
      if (process.env.NODE_ENV === "production") {
        console.error("contact form: SMTP_HOST is not set, message not delivered");
        return { status: "error" };
      }
      console.log(`[contact:dev] to=${to} from=${name} <${email}> subject=${subject}\n${message}`);
      return { status: "ok" };
    }
    const nodemailer = (await import("nodemailer")).default;
    const tx = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    await tx.sendMail({
      from: process.env.CONTACT_FROM || settings.email,
      to,
      replyTo: `${name.replace(/[<>\r\n"]/g, "")} <${email}>`,
      subject: `[IPMA KSA website] ${subject || "New message"}`.replace(/[\r\n]/g, " "),
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    return { status: "ok" };
  } catch (e) {
    console.error("contact failed", e);
    return { status: "error" };
  }
}
