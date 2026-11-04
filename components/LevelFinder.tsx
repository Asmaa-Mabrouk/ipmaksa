"use client";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { COMPLEXITIES, EMPTY_STATE, type Entry, type FinderState, type LevelForm, ROLES, cleanState, evaluate, newEntry, suggest } from "@/lib/levels";
import type { Dict } from "@/lib/i18n";
import { MonthPicker } from "@/components/MonthPicker";

type LevelInfo = { title: string; href: string; forms: LevelForm[] };
const KEY = "ipma-level-finder-v2";
const field = "mt-1 w-full rounded-lg border border-green-900/20 bg-white px-3 py-2.5 text-green-950 focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/30";

export function LevelFinder({ d, levels, email, initial, onSave, person, locale }: {
  locale: string;
  d: Dict["finder"];
  levels: Record<"A" | "B" | "C" | "D", LevelInfo>;
  email: string;
  /** Signed-in member: what is already saved on their profile, and the action that saves changes. */
  initial?: FinderState;
  onSave?: (s: FinderState) => Promise<void>;
  person?: { name: string; email: string; country: string };
}) {
  const id = useId();
  const [state, setState] = useState<FinderState>(initial ? cleanState(initial) : EMPTY_STATE);
  const [pick, setPick] = useState("");
  const [copied, setCopied] = useState(false);
  const [now] = useState(() => new Date());

  // Visitors who are not signed in: remember the entries in this browser so the result is still there when they come back.
  useEffect(() => {
    if (onSave || initial) return;
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || "null");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- browser storage is only readable after hydration
      if (v) setState(cleanState(v));
    } catch {}
  }, [onSave, initial]);

  const update = (next: FinderState) => {
    setState(next);
    if (onSave) onSave(next).catch(() => {});
    else {
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    }
  };
  const setEntry = (i: number, patch: Partial<Entry>) => update({ noExperience: false, entries: state.entries.map((e, k) => (k === i ? { ...e, ...patch } : e)) });
  const dated = state.entries.filter((e) => e.from);

  const options = evaluate(dated, now);
  const { level: top, eligible } = suggest(options);
  const hasInput = dated.length > 0 || state.noExperience;
  const choices = eligible.length ? eligible.map((o) => ({ key: `${o.domain}-${o.level}`, level: o.level, domain: o.domain as string })) : [{ key: "D", level: "D" as const, domain: "project" }];
  const chosen = choices.find((c) => c.key === pick) ?? choices[0];
  const lv = levels[chosen.level];
  const domainName = d.domains[chosen.domain as keyof typeof d.domains];

  const subject = d.mailSubject.replace("{level}", chosen.level);
  const body = d.mailGreeting + "\n\n" + d.mailBody
    .replace("{level}", chosen.level)
    .replace("{domain}", domainName)
    .replaceAll("{name}", person?.name || "________")
    .replace("{email}", person?.email || "________")
    .replace("{country}", person?.country || "________")
    .replace("{forms}", lv.forms.map((f) => "- " + f.label).join("\n"));
  const mail = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <section aria-labelledby={id} className="rounded-3xl border border-gold-500/50 bg-white p-6 shadow-sm sm:p-10">
      <h2 id={id} className="text-2xl font-extrabold text-green-900 sm:text-3xl">{d.title}</h2>
      <p className="mt-2 max-w-3xl leading-8 text-ink/75">{d.intro}</p>
      <p className="mt-2 max-w-3xl border-s-4 border-gold-500 ps-4 text-sm leading-7 text-ink/70">{d.windowsHint}</p>

      <ol className="mt-7 grid gap-4">
        {state.entries.map((e, i) => (
          <li key={i} className="rounded-2xl border border-green-900/15 bg-green-50/40 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-extrabold text-green-900">{d.entry.replace("{n}", String(i + 1))}</h3>
              <button type="button" onClick={() => update({ ...state, entries: state.entries.filter((_, k) => k !== i) })} className="text-sm font-bold text-ipma-red underline underline-offset-4">{d.remove}</button>
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-bold text-green-900">{d.roleLabel}
                <select className={field} value={e.role} onChange={(ev) => setEntry(i, { role: ev.target.value as Entry["role"] })}>
                  {ROLES.map((r) => <option key={r} value={r}>{d.roles[r]}</option>)}
                </select>
              </label>
              {e.role !== "assisting" && (
                <label className="block text-sm font-bold text-green-900">{d.complexityLabel}
                  <select className={field} value={e.complexity} onChange={(ev) => setEntry(i, { complexity: ev.target.value as Entry["complexity"], strategic: ev.target.value === "veryComplex" ? e.strategic : false })}>
                    {COMPLEXITIES.map((c) => <option key={c} value={c}>{d.complexities[c]}</option>)}
                  </select>
                </label>
              )}
              <label className="block text-sm font-bold text-green-900">{d.from}
                <MonthPicker className={field} locale={locale} placeholder={d.pickMonth} value={e.from} onChange={(v) => setEntry(i, { from: v })} />
              </label>
              <div>
                <label className="block text-sm font-bold text-green-900">{d.to}
                  <MonthPicker className={field + (e.to ? "" : " opacity-50")} locale={locale} placeholder={d.pickMonth} value={e.to} disabled={!e.to} onChange={(v) => setEntry(i, { to: v })} />
                </label>
                <label className="mt-2 flex items-center gap-2 text-sm text-green-900">
                  <input type="checkbox" className="h-4 w-4 accent-green-800" checked={!e.to} onChange={(ev) => setEntry(i, { to: ev.target.checked ? "" : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}` })} />
                  {d.present}
                </label>
              </div>
              {e.role !== "assisting" && e.complexity === "veryComplex" && (
                <label className="flex items-start gap-2 text-sm font-semibold text-green-900 sm:col-span-2">
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-green-800" checked={e.strategic} onChange={(ev) => setEntry(i, { strategic: ev.target.checked })} />
                  {d.strategic}
                </label>
              )}
              <label className="block text-sm font-bold text-green-900 sm:col-span-2">{d.nameLabel}
                <input type="text" maxLength={80} className={field} value={e.label} onChange={(ev) => setEntry(i, { label: ev.target.value })} />
              </label>
            </div>
          </li>
        ))}
      </ol>
      {state.entries.length === 0 && !state.noExperience && <p className="mt-6 rounded-xl border border-dashed border-green-900/25 p-5 text-center text-ink/70">{d.empty}</p>}

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button type="button" onClick={() => update({ noExperience: false, entries: [...state.entries, newEntry()] })} className="btn btn-gold">{d.add}</button>
        {state.entries.length === 0 && (
          <label className="flex items-center gap-2 text-sm font-semibold text-green-900">
            <input type="checkbox" className="h-4 w-4 accent-green-800" checked={state.noExperience} onChange={(ev) => update({ entries: [], noExperience: ev.target.checked })} />
            {d.noExperience}
          </label>
        )}
      </div>

      <div aria-live="polite">
        {hasInput && (
          <div className="mt-9 rounded-2xl bg-green-900 p-6 text-white sm:p-8">
            <p className="font-bold text-gold-300">{d.resultTitle}</p>
            <p className="mt-1 text-3xl font-extrabold">{d.level} {top}</p>
            <p className="mt-3 max-w-3xl leading-8 text-white/90">{d.why[top]}</p>

            {eligible.length > 0 && (
              <div className="mt-5">
                <p className="font-bold text-gold-300">{d.eligibleTitle}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {choices.map((c) => (
                    <li key={c.key}>
                      <button type="button" aria-pressed={c.key === chosen.key} onClick={() => setPick(c.key)} className={"rounded-full border px-4 py-1.5 text-sm font-bold transition " + (c.key === chosen.key ? "border-gold-500 bg-gold-500 text-green-950" : "border-white/40 text-white hover:border-gold-300")}>
                        {d.level} {c.level} · {d.domains[c.domain as keyof typeof d.domains]}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {dated.length > 0 && (
              <details className="mt-5 rounded-xl bg-white/10 p-4">
                <summary className="cursor-pointer font-bold">{d.checksTitle}</summary>
                <div className="mt-3 grid gap-4 lg:grid-cols-2">
                  {options.map((o) => (
                    <div key={`${o.domain}-${o.level}`} className="rounded-lg bg-white/10 p-3">
                      <p className="flex items-center justify-between gap-2 font-extrabold">
                        <span>{d.level} {o.level} · {d.domains[o.domain]}</span>
                        <span className={"rounded-full px-2.5 py-0.5 text-xs " + (o.ok ? "bg-gold-500 text-green-950" : "bg-white/20")}>{o.ok ? d.ok : d.notYet}</span>
                      </p>
                      {o.alternatives.map((alt, ai) => (
                        <div key={ai}>
                          {ai > 0 && <p className="mt-2 text-xs font-bold uppercase text-gold-300">{d.or}</p>}
                          <ul className="mt-2 grid gap-1 text-sm text-white/90">
                            {alt.map((k) => (
                              <li key={k.id} className="flex justify-between gap-3">
                                <span>{d.checks[k.id]} <span className="text-white/60">({d.lastYears.replace("{n}", String(k.window))})</span></span>
                                <span className={"shrink-0 font-bold " + (k.have >= k.need ? "text-gold-300" : "text-white/70")} dir="ltr">{k.have} / {k.need} {d.yearsUnit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </details>
            )}

            <p className="mt-5 max-w-3xl border-s-4 border-gold-500 ps-4 text-sm leading-7 text-white/80">{d.indicative}</p>
            <Link href={lv.href} className="mt-4 inline-block font-bold text-gold-300 underline decoration-2 underline-offset-4">{d.learnMore}</Link>

            <div className="mt-7 rounded-xl bg-white p-5 text-green-950">
              <h3 className="text-lg font-extrabold">{d.formsTitle} <span className="text-green-800">({d.level} {chosen.level})</span></h3>
              <p className="mt-1 text-sm font-semibold text-green-800">{d.step1}</p>
              {lv.forms.length > 0 && (
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {lv.forms.map((f) => (
                    <li key={f.url}><a href={f.url} download target="_blank" rel="noopener noreferrer" className="block rounded-lg border border-green-900/15 px-4 py-2.5 text-sm font-bold text-green-900 transition hover:border-gold-500 hover:bg-green-50">{f.label}</a></li>
                  ))}
                </ul>
              )}
              <p className="mt-5 text-sm font-semibold text-green-800">{d.step2.replace("{email}", email)}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a href={mail} className="btn btn-gold">{d.openMail}</a>
                <a href={gmail} target="_blank" rel="noopener noreferrer" className="btn btn-outline !border-green-900/30 !text-green-900">{d.openGmail}</a>
                <button type="button" onClick={copy} className="btn btn-outline !border-green-900/30 !text-green-900">{copied ? d.copied : d.copyAddress}</button>
              </div>
              <p className="mt-3 text-sm text-ink/70">{d.sendHelp}</p>
            </div>
            <button type="button" onClick={() => update(EMPTY_STATE)} className="mt-6 text-sm font-bold text-white/80 underline underline-offset-4 hover:text-white">{d.restart}</button>
          </div>
        )}
      </div>
    </section>
  );
}
