"use client";
import { useActionState } from "react";
import { sendContact, type FormState } from "@/app/(site)/actions";
import type { Dict } from "@/lib/i18n";

export function ContactForm({ locale, d }: { locale: "ar" | "en"; d: Dict["contact"] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(sendContact, { status: "idle" });
  const field = "w-full rounded-xl border border-green-100 bg-white px-4 py-3 text-base outline-none transition focus:ring-2 focus:ring-gold-500";
  const msg = state.status === "ok" ? d.ok : state.status === "invalid" ? d.required : state.status === "error" ? d.error : "";
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="lang" value={locale} />
      <div className="absolute -start-[9999px]" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-semibold">{d.name}<input name="name" required autoComplete="name" className={field} /></label>
        <label className="grid gap-1.5 text-sm font-semibold">{d.emailField}<input name="email" type="email" required autoComplete="email" dir="ltr" className={field} /></label>
      </div>
      <label className="grid gap-1.5 text-sm font-semibold">{d.subject}<input name="subject" className={field} /></label>
      <label className="grid gap-1.5 text-sm font-semibold">{d.message}<textarea name="message" rows={6} required className={field} /></label>
      <button disabled={pending} className="btn btn-green justify-self-start disabled:opacity-60">{pending ? d.sending : d.send}</button>
      <p role="status" aria-live="polite" className={"min-h-6 text-sm font-semibold " + (state.status === "ok" ? "text-green-700" : "text-red-700")}>{msg}</p>
    </form>
  );
}
