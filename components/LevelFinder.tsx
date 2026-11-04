"use client";
import Link from "next/link";
import { useId, useState } from "react";
import { type FinderAnswers, type LevelForm, needsComplexity, needsLeadership, needsYears, recommend } from "@/lib/levels";
import type { Dict } from "@/lib/i18n";

type LevelInfo = { title: string; href: string; forms: LevelForm[] };
const EMPTY: FinderAnswers = { role: "", complexity: "", years: "", leadership: "" };

function Question<T extends string>({ name, legend, hint, options, value, onChange }: { name: string; legend: string; hint?: string; options: [T, string][]; value: string; onChange: (v: T) => void }) {
  return (
    <fieldset className="mt-7">
      <legend className="text-lg font-extrabold text-green-900">{legend}</legend>
      {hint && <p className="mt-1 text-sm text-ink/70">{hint}</p>}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map(([v, label]) => (
          <label key={v} className={"flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-green-700 " + (value === v ? "border-green-800 bg-green-50" : "border-green-900/15 bg-white hover:border-gold-500")}>
            <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} className="mt-1 h-4 w-4 accent-green-800" />
            <span className="leading-6 text-green-950">{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function LevelFinder({ d, levels, email }: { d: Dict["finder"]; levels: Record<"A" | "B" | "C" | "D", LevelInfo>; email: string }) {
  const id = useId();
  const [a, setA] = useState<FinderAnswers>(EMPTY);
  const set = (patch: Partial<FinderAnswers>) => setA((p) => ({ ...p, ...patch }));
  const result = recommend(a);
  const lv = result ? levels[result.level] : null;
  const mail = result ? `mailto:${email}?subject=${encodeURIComponent(d.mailSubject.replace("{level}", result.level))}` : "";
  return (
    <section aria-labelledby={id} className="rounded-3xl border border-gold-500/50 bg-white p-6 shadow-sm sm:p-10">
      <h2 id={id} className="text-2xl font-extrabold text-green-900 sm:text-3xl">{d.title}</h2>
      <p className="mt-2 max-w-3xl leading-8 text-ink/75">{d.intro}</p>

      <Question name="role" legend={d.q1} value={a.role} onChange={(v) => setA({ ...EMPTY, role: v })} options={(Object.keys(d.roles) as (keyof typeof d.roles)[]).map((k) => [k, d.roles[k]] as [typeof k, string])} />
      {needsComplexity(a) && <Question name="complexity" legend={d.q2} value={a.complexity} onChange={(v) => set({ complexity: v, years: "", leadership: "" })} options={(Object.keys(d.complexities) as (keyof typeof d.complexities)[]).map((k) => [k, d.complexities[k]] as [typeof k, string])} />}
      {needsYears(a) && <Question name="years" legend={d.q3} hint={d.yearsHint} value={a.years} onChange={(v) => set({ years: v, leadership: "" })} options={(Object.keys(d.years) as (keyof typeof d.years)[]).map((k) => [k, d.years[k]] as [typeof k, string])} />}
      {needsLeadership(a) && <Question name="leadership" legend={d.q4} value={a.leadership} onChange={(v) => set({ leadership: v })} options={[["yes", d.yes], ["no", d.no]]} />}

      <div aria-live="polite">
        {result && lv && (
          <div className="mt-9 rounded-2xl bg-green-900 p-6 text-white sm:p-8">
            <p className="font-bold text-gold-300">{d.resultTitle}</p>
            <p className="mt-1 text-3xl font-extrabold">{d.level} {result.level}</p>
            <p className="mt-3 max-w-3xl leading-8 text-white/90">{d.why[result.level]}</p>
            {result.otherDomainNote && <p className="mt-2 max-w-3xl leading-8 text-white/90">{d.otherDomain}</p>}
            <p className="mt-3 max-w-3xl border-s-4 border-gold-500 ps-4 text-sm leading-7 text-white/80">{d.indicative}</p>
            <Link href={lv.href} className="mt-4 inline-block font-bold text-gold-300 underline decoration-2 underline-offset-4">{d.learnMore}</Link>

            {lv.forms.length > 0 && (
              <div className="mt-7 rounded-xl bg-white p-5 text-green-950">
                <h3 className="text-lg font-extrabold">{d.formsTitle}</h3>
                <p className="mt-1 text-sm text-ink/70">{d.formsText}</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {lv.forms.map((f) => (
                    <li key={f.url}><a href={f.url} download target="_blank" rel="noopener noreferrer" className="block rounded-lg border border-green-900/15 px-4 py-2.5 text-sm font-bold text-green-900 transition hover:border-gold-500 hover:bg-green-50">{f.label}</a></li>
                  ))}
                </ul>
                <a href={mail} className="btn btn-gold mt-5">{d.send}</a>
              </div>
            )}
            <button type="button" onClick={() => setA(EMPTY)} className="mt-6 text-sm font-bold text-white/80 underline underline-offset-4 hover:text-white">{d.restart}</button>
          </div>
        )}
      </div>
    </section>
  );
}
