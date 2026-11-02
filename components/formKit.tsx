"use client";
import { useState } from "react";

export type Errors = Record<string, string>;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const inputCls = "w-full rounded-xl border bg-white px-4 py-3 text-base outline-none transition focus:ring-2 focus:ring-gold-500";
export const borderOf = (bad: boolean) => (bad ? "border-red-600 focus:ring-red-300" : "border-green-100");

/** Inline validation: red message under each field, in the page language, instead of the browser's tooltip. */
export function useValidation(rules: (fd: FormData) => Errors) {
  const [errors, setErrors] = useState<Errors>({});
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const errs = rules(new FormData(form));
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      e.preventDefault();
      const el = form.querySelector<HTMLElement>(`#field-${first}`) ?? form.querySelector<HTMLElement>(`[name="${first}"]:not([type=hidden])`);
      el?.focus();
    }
  };
  const clear = (e: React.FormEvent<HTMLFormElement>) => {
    const n = (e.target as HTMLInputElement).name;
    if (n && errors[n]) setErrors((p) => { const c = { ...p }; delete c[n]; return c; });
  };
  const clearKey = (n: string) => setErrors((p) => { if (!p[n]) return p; const c = { ...p }; delete c[n]; return c; });
  return { errors, onSubmit, onInput: clear, clearKey };
}

export function FieldError({ name, errors }: { name: string; errors: Errors }) {
  return errors[name] ? <p id={`err-${name}`} role="alert" className="text-sm font-semibold text-red-700">{errors[name]}</p> : null;
}

export function PasswordInput({ name, errors, show, hide, autoComplete, minLength }: { name: string; errors: Errors; show: string; hide: string; autoComplete: string; minLength?: number }) {
  const [visible, setVisible] = useState(false);
  const bad = !!errors[name];
  return (
    <div className="relative">
      <input
        id={`field-${name}`} name={name} type={visible ? "text" : "password"} autoComplete={autoComplete} minLength={minLength} dir="ltr"
        aria-invalid={bad} aria-describedby={bad ? `err-${name}` : undefined}
        className={`${inputCls} ${borderOf(bad)} pr-12`}
      />
      <button
        type="button" onClick={() => setVisible((v) => !v)} aria-label={visible ? hide : show} aria-pressed={visible} title={visible ? hide : show}
        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-green-700 transition hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-gold-500"
      >
        {visible ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3l18 18" /><path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" /><path d="M9.9 5.1A10.9 10.9 0 0 1 12 5c6 0 9.5 7 9.5 7a17 17 0 0 1-3.2 4.1M6.1 6.1A17 17 0 0 0 2.5 12S6 19 12 19c1.6 0 3-.4 4.3-1" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></svg>
        )}
      </button>
    </div>
  );
}
