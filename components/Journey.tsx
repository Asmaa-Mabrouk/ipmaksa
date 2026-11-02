import Link from "next/link";
import { Markdown } from "@/lib/markdown";
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

/** How to prepare (ICB4 etc.). */
export function PrepareBlock({ j, locale }: { j: JourneyDoc; locale: Locale }) {
  return (
    <section id="prepare" className="bg-green-50 py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionTitle title={t(j.prepareTitle, locale)} />
        <div className="mt-8 rounded-2xl border border-green-100 bg-white p-6 shadow-sm sm:p-10">
          <Markdown source={t(j.prepareBody, locale)} />
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
