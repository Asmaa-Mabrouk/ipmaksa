"use client";
import { useActionState } from "react";
import Link from "next/link";
import { loginMember, registerMember, updateProfile, type AuthState } from "@/app/(site)/member-actions";
import type { Dict } from "@/lib/i18n";
import { CountrySelect } from "./CountrySelect";
import { EMAIL_RE, FieldError, PasswordInput, borderOf, inputCls, useValidation, type Errors } from "./formKit";

const lbl = "grid gap-1.5 text-sm font-semibold text-green-900";
type Country = { code: string; name: string };
type A = Dict["account"];
const err = (d: A, s: AuthState) => (s.error ? (d.errors as Record<string, string>)[s.error] ?? d.errors.generic : "");
const Honey = () => <div className="absolute -start-[9999px]" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>;
const blank = (fd: FormData, k: string) => !String(fd.get(k) ?? "").trim();

function Text({ name, label, errors, type = "text", autoComplete, defaultValue, ltr = false, required = true }: {
  name: string; label: string; errors: Errors; type?: string; autoComplete?: string; defaultValue?: string; ltr?: boolean; required?: boolean;
}) {
  const bad = !!errors[name];
  return (
    <div className={lbl}>
      <label htmlFor={`field-${name}`}>{label}{required ? " *" : ""}</label>
      <input id={`field-${name}`} name={name} type={type} autoComplete={autoComplete} defaultValue={defaultValue} dir={ltr ? "ltr" : undefined}
        aria-invalid={bad} aria-describedby={bad ? `err-${name}` : undefined} className={`${inputCls} ${borderOf(bad)}`} />
      <FieldError name={name} errors={errors} />
    </div>
  );
}

function Country({ d, countries, errors, value, onPick }: { d: A; countries: Country[]; errors: Errors; value?: string; onPick: () => void }) {
  return (
    <div className={lbl + " sm:col-span-2"}>
      <span id="label-country">{d.country} *</span>
      <div onClickCapture={onPick}>
        <CountrySelect key={value ?? "none"} id="field-country" name="country" countries={countries} defaultValue={value ?? ""} placeholder={d.selectCountry} searchPlaceholder={d.searchCountry} noMatch={d.noMatch} invalid={!!errors.country} />
      </div>
      <FieldError name="country" errors={errors} />
    </div>
  );
}

export function RegisterForm({ locale, d, countries }: { locale: "ar" | "en"; d: A; countries: Country[] }) {
  const [s, action, pending] = useActionState<AuthState, FormData>(registerMember, {});
  const v = useValidation((fd) => {
    const e: Errors = {};
    if (blank(fd, "firstName")) e.firstName = d.errors.required;
    if (blank(fd, "lastName")) e.lastName = d.errors.required;
    const email = String(fd.get("email") ?? "").trim();
    if (!email) e.email = d.errors.required; else if (!EMAIL_RE.test(email)) e.email = d.errors.email;
    if (!String(fd.get("country") ?? "")) e.country = d.errors.countryRequired;
    const p = String(fd.get("password") ?? ""), p2 = String(fd.get("password2") ?? "");
    if (!p) e.password = d.errors.required; else if (p.length < 8) e.password = d.errors.short;
    if (!p2) e.password2 = d.errors.required; else if (p && p !== p2) e.password2 = d.errors.mismatch;
    if (!fd.get("accept")) e.accept = d.errors.accept;
    return e;
  });
  return (
    <form action={action} noValidate onSubmit={v.onSubmit} onInput={v.onInput} className="grid gap-4">
      <input type="hidden" name="lang" value={locale} /><Honey />
      <div className="grid gap-4 sm:grid-cols-2">
        <Text name="firstName" label={d.firstName} errors={v.errors} autoComplete="given-name" defaultValue={s.values?.firstName} />
        <Text name="lastName" label={d.lastName} errors={v.errors} autoComplete="family-name" defaultValue={s.values?.lastName} />
        <Text name="email" label={d.email} errors={v.errors} type="email" autoComplete="email" defaultValue={s.values?.email} ltr />
        <Text name="dob" label={d.dob} errors={v.errors} type="date" autoComplete="bday" defaultValue={s.values?.dob} required={false} />
        <Country d={d} countries={countries} errors={v.errors} value={s.values?.country} onPick={() => v.clearKey("country")} />
        <div className={lbl}>
          <label htmlFor="field-password">{d.password} *</label>
          <PasswordInput name="password" errors={v.errors} show={d.showPassword} hide={d.hidePassword} autoComplete="new-password" />
          <FieldError name="password" errors={v.errors} />
        </div>
        <div className={lbl}>
          <label htmlFor="field-password2">{d.password2} *</label>
          <PasswordInput name="password2" errors={v.errors} show={d.showPassword} hide={d.hidePassword} autoComplete="new-password" />
          <FieldError name="password2" errors={v.errors} />
        </div>
      </div>
      <div className="grid gap-1.5">
        <label className="flex items-start gap-3 text-sm">
          <input id="field-accept" type="checkbox" name="accept" aria-invalid={!!v.errors.accept} className="mt-1 h-5 w-5 accent-green-700" />
          <span><Link href={`/${locale}/privacy-policy`} className="font-bold text-green-700 underline">{d.accept}</Link></span>
        </label>
        <FieldError name="accept" errors={v.errors} />
      </div>
      <button disabled={pending} className="btn btn-green justify-self-start disabled:opacity-60">{d.submit}</button>
      <p role="alert" className="min-h-5 text-sm font-semibold text-red-700">{err(d, s)}</p>
      <p className="text-sm">{d.haveAccount} <Link href={`/${locale}/login`} className="font-bold text-green-700 underline">{d.signIn}</Link></p>
    </form>
  );
}

export function LoginForm({ locale, d }: { locale: "ar" | "en"; d: A }) {
  const [s, action, pending] = useActionState<AuthState, FormData>(loginMember, {});
  const v = useValidation((fd) => {
    const e: Errors = {};
    const email = String(fd.get("email") ?? "").trim();
    if (!email) e.email = d.errors.required; else if (!EMAIL_RE.test(email)) e.email = d.errors.email;
    if (!String(fd.get("password") ?? "")) e.password = d.errors.required;
    return e;
  });
  return (
    <form action={action} noValidate onSubmit={v.onSubmit} onInput={v.onInput} className="grid gap-4">
      <input type="hidden" name="lang" value={locale} />
      <Text name="email" label={d.email} errors={v.errors} type="email" autoComplete="username" defaultValue={s.values?.email} ltr required={false} />
      <div className={lbl}>
        <label htmlFor="field-password">{d.password}</label>
        <PasswordInput name="password" errors={v.errors} show={d.showPassword} hide={d.hidePassword} autoComplete="current-password" />
        <FieldError name="password" errors={v.errors} />
      </div>
      <button disabled={pending} className="btn btn-green justify-self-start disabled:opacity-60">{d.loginBtn}</button>
      <p role="alert" className="min-h-5 text-sm font-semibold text-red-700">{err(d, s)}</p>
      <p className="text-sm">{d.noAccount} <Link href={`/${locale}/register`} className="font-bold text-green-700 underline">{d.register}</Link></p>
    </form>
  );
}

export function ProfileForm({ d, countries, first, last, country }: { d: A; countries: Country[]; first: string; last: string; country: string }) {
  const [s, action, pending] = useActionState<AuthState, FormData>(updateProfile, {});
  const v = useValidation((fd) => {
    const e: Errors = {};
    if (blank(fd, "firstName")) e.firstName = d.errors.required;
    if (blank(fd, "lastName")) e.lastName = d.errors.required;
    if (!String(fd.get("country") ?? "")) e.country = d.errors.countryRequired;
    return e;
  });
  return (
    <form action={action} noValidate onSubmit={v.onSubmit} onInput={v.onInput} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Text name="firstName" label={d.firstName} errors={v.errors} defaultValue={first} required={false} />
        <Text name="lastName" label={d.lastName} errors={v.errors} defaultValue={last} required={false} />
        <Country d={d} countries={countries} errors={v.errors} value={country} onPick={() => v.clearKey("country")} />
        <label className={lbl + " sm:col-span-2"}>{d.photo}<input name="photo" type="file" accept="image/jpeg,image/png,image/webp" className={`${inputCls} ${borderOf(false)}`} /></label>
      </div>
      <button disabled={pending} className="btn btn-green justify-self-start disabled:opacity-60">{d.save}</button>
      <p role="status" className={"min-h-5 text-sm font-semibold " + (s.saved ? "text-green-700" : "text-red-700")}>{s.saved ? d.saved : err(d, s)}</p>
    </form>
  );
}
