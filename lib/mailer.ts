import "server-only";
import { getSettings } from "@/lib/content/api";

type Mail = { to: string; subject: string; html: string; text: string; replyTo?: string };

/** Sends through SMTP (Microsoft 365, Gmail, Resend...). Returns false when it could not be delivered. */
export async function sendMail(m: Mail): Promise<boolean> {
  if (!process.env.SMTP_HOST) {
    if (process.env.NODE_ENV === "production") {
      console.error("mail: SMTP_HOST is not set, email not sent");
      return false;
    }
    console.log(`[mail:dev] to=${m.to} subject=${m.subject}\n${m.text}`);
    return true;
  }
  try {
    const nodemailer = (await import("nodemailer")).default;
    const settings = await getSettings();
    const port = Number(process.env.SMTP_PORT || 587);
    const tx = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      requireTLS: port === 587,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    await tx.sendMail({ from: `"IPMA KSA" <${process.env.CONTACT_FROM || settings.email}>`, ...m });
    return true;
  } catch (e) {
    console.error("mail failed", e);
    return false;
  }
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Branded, table-based layout that renders in Outlook and Gmail. */
export function emailHtml(o: { lang: "ar" | "en"; title: string; lines: string[]; button?: { label: string; url: string }; footer: string }) {
  const rtl = o.lang === "ar";
  const font = rtl ? "Tahoma,Arial,sans-serif" : "Segoe UI,Arial,sans-serif";
  const body = o.lines.map((l) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.8;color:#1f2a26">${esc(l)}</p>`).join("");
  const btn = o.button
    ? `<p style="margin:22px 0"><a href="${esc(o.button.url)}" style="display:inline-block;background:#c89b3c;color:#10332a;font-weight:700;font-size:16px;text-decoration:none;padding:13px 28px;border-radius:999px">${esc(o.button.label)}</a></p><p style="margin:0 0 14px;font-size:12px;color:#6b7a74;word-break:break-all" dir="ltr">${esc(o.button.url)}</p>`
    : "";
  return `<!doctype html><html lang="${o.lang}" dir="${rtl ? "rtl" : "ltr"}"><body style="margin:0;background:#f4f1ea;font-family:${font}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden">
<tr><td style="background:#10332a;padding:22px 28px;text-align:${rtl ? "right" : "left"};color:#ffffff;font-size:20px;font-weight:700">IPMA KSA<span style="color:#c89b3c"> | ${rtl ? "IPMA السعودية" : "Kingdom of Saudi Arabia"}</span></td></tr>
<tr><td style="padding:30px 28px;text-align:${rtl ? "right" : "left"}"><h1 style="margin:0 0 18px;font-size:22px;color:#10332a">${esc(o.title)}</h1>${body}${btn}</td></tr>
<tr><td style="background:#faf8f3;padding:16px 28px;font-size:12px;color:#6b7a74;text-align:${rtl ? "right" : "left"}">${esc(o.footer)}</td></tr>
</table></td></tr></table></body></html>`;
}
