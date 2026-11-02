"use client";
import { useActionState } from "react";
import { subscribe, type FormState } from "@/app/(site)/actions";
import type { Dict } from "@/lib/i18n";

export function NewsletterForm({ locale, d, source = "site", tone = "dark" }: { locale: "ar" | "en"; d: Dict["newsletter"]; source?: string; tone?: "dark" | "light" }) {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribe, { status: "idle" });
  const msg =
    state.status === "ok" ? d.ok : state.status === "already" ? d.already : state.status === "invalid" ? d.invalid : state.status === "error" ? d.error : "";
  const good = state.status === "ok" || state.status === "already";
  const field =
    "w-full rounded-xl border px-4 py-3 text-base outline-none transition focus:ring-2 focus:ring-gold-500 " +
    (tone === "dark" ? "border-white/20 bg-white/10 text-white placeholder:text-white/60" : "border-green-100 bg-white text-ink placeholder:text-ink/50");
  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="lang" value={locale} />
      <input type="hidden" name="source" value={source} />
      <div className="absolute -start-[9999px]" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="sr-only" htmlFor={`nm-${source}`}>{d.name}</label>
        <input id={`nm-${source}`} name="name" autoComplete="name" placeholder={d.name} className={field} />
        <label className="sr-only" htmlFor={`em-${source}`}>{d.email}</label>
        <input id={`em-${source}`} name="email" type="email" required autoComplete="email" inputMode="email" placeholder={d.email} className={field} dir="ltr" style={{ textAlign: locale === "ar" ? "right" : "left" }} />
      </div>
      <button disabled={pending} className="btn btn-gold justify-self-start disabled:opacity-60">
        {pending ? d.sending : d.button}
      </button>
      <p role="status" aria-live="polite" className={"min-h-5 text-sm font-semibold " + (good ? (tone === "dark" ? "text-gold-300" : "text-green-700") : tone === "dark" ? "text-red-200" : "text-red-700")}>{msg}</p>
      <p className={"text-xs " + (tone === "dark" ? "text-white/70" : "text-ink/60")}>{d.fine}</p>
    </form>
  );
}
