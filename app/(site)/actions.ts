"use server";
import crypto from "node:crypto";
import { headers } from "next/headers";
import { getStore } from "@/lib/content/store";
import { getSettings } from "@/lib/content/api";
import type { MessageDoc, SubscriberDoc } from "@/lib/content/types";

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

export async function unsubscribe(id: string, token: string): Promise<boolean> {
  if (!/^[a-f0-9]{24}$/.test(id) || !/^[a-f0-9]{32}$/.test(token)) return false;
  const store = getStore();
  const row = await store.get("subscribers", id);
  if (!row || (row.data as unknown as SubscriberDoc).token !== token) return false;
  await store.remove("subscribers", id);
  return true;
}

export async function sendContact(_: FormState, fd: FormData): Promise<FormState> {
  try {
    if (looksLikeBot(fd)) return { status: "ok" };
    if (limited(`msg:${await ip()}`, 3, 10 * 60_000)) return { status: "error" };
    const email = clean(fd.get("email"), 320);
    const name = clean(fd.get("name"), 100);
    const message = clean(fd.get("message"), 4000);
    if (!name || !message || !EMAIL.test(email)) return { status: "invalid" };
    const doc: MessageDoc = {
      name,
      email,
      subject: clean(fd.get("subject"), 150),
      message,
      lang: clean(fd.get("lang"), 2) === "en" ? "en" : "ar",
      createdAt: new Date().toISOString(),
      read: false,
    };
    await getStore().put("messages", `${Date.now()}-${crypto.randomBytes(3).toString("hex")}`, doc as unknown as Record<string, unknown>);

    // Optional email notification when SMTP is configured. The message is already safely stored.
    if (process.env.SMTP_HOST) {
      try {
        const nodemailer = (await import("nodemailer")).default;
        const settings = await getSettings();
        const tx = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
        });
        await tx.sendMail({
          from: process.env.CONTACT_FROM || settings.email,
          to: process.env.CONTACT_TO || settings.email,
          replyTo: `${name.replace(/[<>\r\n"]/g, "")} <${email}>`,
          subject: `[IPMA KSA website] ${doc.subject || "New message"}`.replace(/[\r\n]/g, " "),
          text: `From: ${name} <${email}>\n\n${message}`,
        });
      } catch (e) {
        console.error("contact email failed", e);
      }
    }
    return { status: "ok" };
  } catch (e) {
    console.error("contact failed", e);
    return { status: "error" };
  }
}
