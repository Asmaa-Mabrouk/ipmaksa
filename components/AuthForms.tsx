"use client";
import { useActionState } from "react";
import Link from "next/link";
import { loginMember, registerMember, updateProfile, type AuthState } from "@/app/(site)/member-actions";
import type { Dict } from "@/lib/i18n";

const field = "w-full rounded-xl border border-green-100 bg-white px-4 py-3 text-base outline-none transition focus:ring-2 focus:ring-gold-500";
const lbl = "grid gap-1.5 text-sm font-semibold text-green-900";
type Country = { code: string; name: string };
const err = (d: Dict["account"], s: AuthState) => (s.error ? (d.errors as Record<string, string>)[s.error] ?? d.errors.generic : "");
const Honey = () => <div className="absolute -start-[9999px]" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>;

export function RegisterForm({ locale, d, countries }: { locale: "ar" | "en"; d: Dict["account"]; countries: Country[] }) {
  const [s, action, pending] = useActionState<AuthState, FormData>(registerMember, {});
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="lang" value={locale} /><Honey />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={lbl}>{d.firstName} *<input name="firstName" required autoComplete="given-name" defaultValue={s.values?.firstName} className={field} /></label>
        <label className={lbl}>{d.lastName} *<input name="lastName" required autoComplete="family-name" defaultValue={s.values?.lastName} className={field} /></label>
        <label className={lbl}>{d.email} *<input name="email" type="email" required autoComplete="email" dir="ltr" defaultValue={s.values?.email} className={field} /></label>
        <label className={lbl}>{d.dob}<input name="dob" type="date" autoComplete="bday" defaultValue={s.values?.dob} className={field} /></label>
        <label className={lbl + " sm:col-span-2"}>{d.country} *
          <select key={s.values?.country ?? "none"} name="country" required defaultValue={s.values?.country ?? ""} className={field}>
            <option value="" disabled>{d.selectCountry}</option>
            {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </label>
        <label className={lbl}>{d.password} *<input name="password" type="password" required minLength={8} autoComplete="new-password" dir="ltr" className={field} /></label>
        <label className={lbl}>{d.password2} *<input name="password2" type="password" required minLength={8} autoComplete="new-password" dir="ltr" className={field} /></label>
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="accept" className="mt-1 h-5 w-5 accent-green-700" />
        <span><Link href={`/${locale}/privacy-policy`} className="font-bold text-green-700 underline">{d.accept}</Link></span>
      </label>
      <button disabled={pending} className="btn btn-green justify-self-start disabled:opacity-60">{d.submit}</button>
      <p role="alert" className="min-h-5 text-sm font-semibold text-red-700">{err(d, s)}</p>
      <p className="text-sm">{d.haveAccount} <Link href={`/${locale}/login`} className="font-bold text-green-700 underline">{d.signIn}</Link></p>
    </form>
  );
}

export function LoginForm({ locale, d }: { locale: "ar" | "en"; d: Dict["account"] }) {
  const [s, action, pending] = useActionState<AuthState, FormData>(loginMember, {});
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="lang" value={locale} />
      <label className={lbl}>{d.email}<input name="email" type="email" required autoComplete="username" dir="ltr" defaultValue={s.values?.email} className={field} /></label>
      <label className={lbl}>{d.password}<input name="password" type="password" required autoComplete="current-password" dir="ltr" className={field} /></label>
      <button disabled={pending} className="btn btn-green justify-self-start disabled:opacity-60">{d.loginBtn}</button>
      <p role="alert" className="min-h-5 text-sm font-semibold text-red-700">{err(d, s)}</p>
      <p className="text-sm">{d.noAccount} <Link href={`/${locale}/register`} className="font-bold text-green-700 underline">{d.register}</Link></p>
    </form>
  );
}

export function ProfileForm({ d, countries, first, last, country }: { d: Dict["account"]; countries: Country[]; first: string; last: string; country: string }) {
  const [s, action, pending] = useActionState<AuthState, FormData>(updateProfile, {});
  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={lbl}>{d.firstName}<input name="firstName" required defaultValue={first} className={field} /></label>
        <label className={lbl}>{d.lastName}<input name="lastName" required defaultValue={last} className={field} /></label>
        <label className={lbl}>{d.country}
          <select name="country" required defaultValue={country} className={field}>{countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}</select>
        </label>
        <label className={lbl}>{d.photo}<input name="photo" type="file" accept="image/jpeg,image/png,image/webp" className={field} /></label>
      </div>
      <button disabled={pending} className="btn btn-green justify-self-start disabled:opacity-60">{d.save}</button>
      <p role="status" className={"min-h-5 text-sm font-semibold " + (s.saved ? "text-green-700" : "text-red-700")}>{s.saved ? d.saved : err(d, s)}</p>
    </form>
  );
}
