"use client";
import { useActionState } from "react";
import { sendContact, type FormState } from "@/app/(site)/actions";
import type { Dict } from "@/lib/i18n";
import { EMAIL_RE, FieldError, borderOf, inputCls, useValidation, type Errors } from "./formKit";

export function ContactForm({ locale, d }: { locale: "ar" | "en"; d: Dict["contact"] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(sendContact, { status: "idle" });
  const v = useValidation((fd) => {
    const e: Errors = {};
    if (!String(fd.get("name") ?? "").trim()) e.name = d.fieldRequired;
    const email = String(fd.get("email") ?? "").trim();
    if (!email) e.email = d.fieldRequired; else if (!EMAIL_RE.test(email)) e.email = d.fieldEmail;
    if (!String(fd.get("message") ?? "").trim()) e.message = d.fieldRequired;
    return e;
  });
  const cls = (n: string) => `${inputCls} ${borderOf(!!v.errors[n])}`;
  const aria = (n: string) => ({ id: `field-${n}`, "aria-invalid": !!v.errors[n], "aria-describedby": v.errors[n] ? `err-${n}` : undefined });
  const msg = state.status === "ok" ? d.ok : state.status === "invalid" ? d.required : state.status === "error" ? d.error : "";
  const l = "grid gap-1.5 text-sm font-semibold";
  return (
    <form action={action} noValidate onSubmit={v.onSubmit} onInput={v.onInput} className="grid gap-4">
      <input type="hidden" name="lang" value={locale} />
      <div className="absolute -start-[9999px]" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={l}><label htmlFor="field-name">{d.name} *</label><input name="name" autoComplete="name" className={cls("name")} {...aria("name")} /><FieldError name="name" errors={v.errors} /></div>
        <div className={l}><label htmlFor="field-email">{d.emailField} *</label><input name="email" type="email" autoComplete="email" dir="ltr" className={cls("email")} {...aria("email")} /><FieldError name="email" errors={v.errors} /></div>
      </div>
      <label className={l}>{d.subject}<input name="subject" className={cls("subject")} /></label>
      <div className={l}><label htmlFor="field-message">{d.message} *</label><textarea name="message" rows={6} className={cls("message")} {...aria("message")} /><FieldError name="message" errors={v.errors} /></div>
      <button disabled={pending} className="btn btn-green justify-self-start disabled:opacity-60">{pending ? d.sending : d.send}</button>
      <p role="status" aria-live="polite" className={"min-h-6 text-sm font-semibold " + (state.status === "ok" ? "text-green-700" : "text-red-700")}>{msg}</p>
    </form>
  );
}
