import Link from "next/link";
import { SectionTitle } from "./Sections";
import { getDict, t } from "@/lib/i18n";
import type { JourneyDoc, Locale } from "@/lib/content/types";

const STAGE = ["#3f8fb5", "#6558b8", "#4a78a8", "#b8975a", "#4aa377", "#c8372d"];
const ROLE = ["#3f8fb5", "#6558b8", "#b8975a"];

/** The 6-stage table: who does what from application to certificate. */
export function JourneyCycle({ j, locale, showLink = false }: { j: JourneyDoc; locale: Locale; showLink?: boolean }) {
  const d = getDict(locale);
  const stages = j.stages.map((s) => t(s.title, locale));
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle title={t(j.cycleTitle, locale)} intro={t(j.cycleIntro, locale)} />
        {showLink && <Link href={`/${locale}/certification-journey`} className="btn btn-green">{d.journeyUi.fullPage}</Link>}
      </div>

      {/* wide screens: the table */}
      <div className="mt-10 hidden lg:block">
        <div className="grid gap-3" style={{ gridTemplateColumns: `minmax(11rem,1.1fr) repeat(${stages.length}, minmax(0,1fr))` }}>
          <div />
          {stages.map((s, i) => (
            <div key={i} className="flex items-center justify-center rounded-xl px-2 py-4 text-center text-sm font-extrabold leading-5 text-white" style={{ background: STAGE[i % STAGE.length] }}>{s}</div>
          ))}
          {j.roles.map((r, ri) => (
            <RoleRow key={ri} r={r} ri={ri} n={stages.length} locale={locale} />
          ))}
        </div>
      </div>

      {/* phones and tablets: one card per stage */}
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:hidden">
        {stages.map((s, i) => (
          <li key={i} className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
            <div className="px-4 py-3 font-extrabold text-white" style={{ background: STAGE[i % STAGE.length] }}>{s}</div>
            <ul className="grid gap-3 p-4">
              {j.roles.map((r, ri) => {
                const txt = t(r.steps[i]?.text ?? { ar: "", en: "" }, locale);
                if (!txt) return null;
                return (
                  <li key={ri} className="border-s-4 ps-3" style={{ borderColor: ROLE[ri % ROLE.length] }}>
                    <p className="text-sm font-extrabold text-green-900">{t(r.name, locale)}</p>
                    <p className="leading-7 text-ink/80">{txt}</p>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>

      <p className="mt-8 rounded-2xl bg-green-50 p-5 text-lg leading-8 text-green-900">
        <strong>{t(j.noteStrong, locale)}</strong> <span className="text-ink/80">{t(j.noteText, locale)}</span>
      </p>
    </section>
  );
}

function RoleRow({ r, ri, n, locale }: { r: JourneyDoc["roles"][number]; ri: number; n: number; locale: Locale }) {
  const c = ROLE[ri % ROLE.length];
  return (
    <>
      <div className="flex flex-col justify-center rounded-xl p-4 text-white" style={{ background: c }}>
        <p className="font-extrabold leading-6">{t(r.name, locale)}</p>
        <p className="mt-1 text-sm leading-5 text-white/90">{t(r.subtitle, locale)}</p>
      </div>
      {Array.from({ length: n }, (_, i) => {
        const txt = t(r.steps[i]?.text ?? { ar: "", en: "" }, locale);
        return txt ? (
          <div key={i} className="flex items-center rounded-xl border-2 bg-white p-3 text-sm leading-6 text-ink" style={{ borderColor: c }}>{txt}</div>
        ) : (
          <div key={i} className="rounded-xl bg-sand/70" aria-hidden="true" />
        );
      })}
    </>
  );
}

/** How to prepare: ICB4 hero, structure chips, one card per level, and two notes. */
export function PrepareBlock({ j, locale }: { j: JourneyDoc; locale: Locale }) {
  const chip = "rounded-full border border-gold-500/60 bg-white px-4 py-1.5 text-sm font-bold text-green-900";
  return (
    <section id="prepare" className="bg-green-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle title={t(j.prepareTitle, locale)} />

        {/* ICB4 hero */}
        <div className="relative mt-10 grid overflow-hidden rounded-3xl bg-green-900 text-white shadow-lg lg:grid-cols-[1.4fr_1fr]">
          <div className="najdi absolute inset-x-0 top-0" aria-hidden="true" />
          <div className="flex flex-col gap-5 p-7 pt-9 sm:flex-row sm:items-center sm:p-10 sm:pt-12">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gold-500 text-3xl font-black tracking-tight text-green-950 shadow-md">ICB4</div>
            <p className="text-lg leading-8 text-white/95 sm:text-xl sm:leading-9">{t(j.prepareIntro, locale)}</p>
          </div>
          <div className="flex flex-col justify-center gap-3 border-t border-white/10 bg-green-950/40 p-7 pt-8 sm:p-10 lg:border-s lg:border-t-0">
            <p className="text-sm font-bold uppercase tracking-wide text-gold-300">{t(j.icbTitle, locale)}</p>
            <p className="leading-7 text-white/85">{t(j.icbText, locale)}</p>
            {j.icbUrl && (
              <a href={j.icbUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-1 justify-self-start" dir="auto">
                {t(j.icbButton, locale)}
                <svg viewBox="0 0 20 20" className="h-4 w-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8" /></svg>
              </a>
            )}
          </div>
        </div>

        {/* structure */}
        <div className="mt-10 rounded-3xl border border-green-100 bg-white p-7 shadow-sm sm:p-10">
          <h3 className="text-2xl font-extrabold text-green-900">{t(j.structureTitle, locale)}</h3>
          <p className="mt-2 max-w-3xl text-lg leading-8 text-ink/80">{t(j.structureText, locale)}</p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-extrabold uppercase tracking-wide text-gold-600">{t(j.domainsLabel, locale)}</p>
              <ul className="flex flex-wrap gap-2">{j.domains.map((x, i) => <li key={i} className={chip}>{t(x.name, locale)}</li>)}</ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-extrabold uppercase tracking-wide text-gold-600">{t(j.areasLabel, locale)}</p>
              <ul className="flex flex-wrap gap-2">{j.areas.map((x, i) => <li key={i} className={chip}>{t(x.name, locale)}</li>)}</ul>
            </div>
          </div>
        </div>

        {/* levels */}
        <h3 className="mt-12 text-2xl font-extrabold text-green-900">{t(j.levelsTitle, locale)}</h3>
        <ul className="mt-5 grid gap-5 md:grid-cols-3">
          {j.levels.map((lv, i) => (
            <li key={i} className="flex flex-col rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="flex h-16 min-w-16 items-center justify-center rounded-2xl bg-green-900 px-3 text-2xl font-black text-gold-300" dir="ltr">{lv.badge}</span>
                <p className="text-xl font-extrabold text-green-900">{t(lv.label, locale)}</p>
              </div>
              <p className="mt-4 leading-8 text-ink/80">{t(lv.text, locale)}</p>
            </li>
          ))}
        </ul>

        {/* notes */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="flex gap-4 rounded-2xl border border-green-100 bg-white p-5">
            <svg viewBox="0 0 24 24" className="mt-1 h-7 w-7 shrink-0 text-green-700" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 11l3 3 8-8" /><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" /></svg>
            <p className="leading-8 text-ink/85">{t(j.guideNote, locale)}</p>
          </div>
          <div className="flex gap-4 rounded-2xl border-2 border-gold-500 bg-gold-100/60 p-5">
            <svg viewBox="0 0 24 24" className="mt-1 h-7 w-7 shrink-0 text-gold-600" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5L16 9.5" /></svg>
            <p className="font-extrabold leading-8 text-green-900">{t(j.freeNote, locale)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Accordion of the most common questions. */
export function FaqList({ j, locale, limit, showLink = false, email }: { j: JourneyDoc; locale: Locale; limit?: number; showLink?: boolean; email?: string }) {
  const d = getDict(locale);
  const items = limit ? j.faqs.slice(0, limit) : j.faqs;
  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle title={t(j.faqTitle, locale)} intro={t(j.faqIntro, locale)} />
        {showLink && <Link href={`/${locale}/certification-journey#faq`} className="btn btn-green">{d.journeyUi.allFaq}</Link>}
      </div>
      <div className="mt-8 grid gap-3">
        {items.map((f, i) => (
          <details key={i} className="group rounded-2xl border border-green-100 bg-white shadow-sm open:border-gold-500">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-lg font-extrabold text-green-900 [&::-webkit-details-marker]:hidden">
              <span>{t(f.q, locale)}</span>
              <span aria-hidden="true" className="text-2xl text-gold-600 transition group-open:rotate-45">+</span>
            </summary>
            <p className="px-5 pb-5 leading-8 text-ink/80">{t(f.a, locale)}</p>
          </details>
        ))}
      </div>
      {email && (
        <p className="mt-6 text-center text-ink/75">{d.journeyUi.stillAsk} <a href={`mailto:${email}`} className="font-bold text-green-700 underline" dir="ltr">{email}</a></p>
      )}
    </section>
  );
}
