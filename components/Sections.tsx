import Image from "next/image";
import Link from "next/link";
import { Icon } from "./Icon";
import { telHref } from "./SiteChrome";
import { getDict, t } from "@/lib/i18n";
import type { BenefitDoc, Doc, ExamDoc, Locale, NewsDoc, ProjectEventDoc, SiteSettings, TeamDoc } from "@/lib/content/types";

export const fmtDate = (iso: string, locale: Locale, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) =>
  new Intl.DateTimeFormat(getDict(locale).date.locale, { ...opts, timeZone: "UTC" }).format(new Date(iso + "T00:00:00Z"));

export function SectionTitle({ title, intro, light = false, center = false }: { title: string; intro?: string; light?: boolean; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <div className={"mb-4 h-1 w-14 rounded bg-gold-500 " + (center ? "mx-auto" : "")} />
      <h2 className={"text-3xl font-extrabold leading-tight sm:text-4xl " + (light ? "text-white" : "text-green-900")}>{title}</h2>
      {intro && <p className={"mt-3 text-lg leading-8 " + (light ? "text-white/80" : "text-ink/75")}>{intro}</p>}
    </div>
  );
}

export function PageHero({ title, intro, image }: { title: string; intro?: string; image?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-green-900 text-white">
      {image && <Image src={image} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-35" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-green-950/90 via-green-900/60 to-green-900/30" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-4 h-1 w-14 rounded bg-gold-500" />
        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-3xl text-lg leading-8 text-white/85">{intro}</p>}
      </div>
    </section>
  );
}

const statusStyle: Record<string, string> = {
  open: "bg-green-100 text-green-800",
  soon: "bg-gold-100 text-gold-600",
  tba: "bg-sand text-ink/70",
  closed: "bg-ink/10 text-ink/60",
};

export function ExamCards({ exams, locale, email, limit }: { exams: Doc<ExamDoc>[]; locale: Locale; email: string; limit?: number }) {
  const d = getDict(locale);
  const list = (limit ? exams.filter((e) => e.data.status !== "closed").slice(0, limit) : exams);
  if (!list.length) return <p className="rounded-2xl bg-white p-8 text-center text-ink/70 shadow-sm">{d.exams.none}</p>;
  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {list.map(({ id, data: e }) => {
        const dated = !!e.date;
        const [day, month, year] = dated
          ? [fmtDate(e.date, locale, { day: "numeric" }), fmtDate(e.date, locale, { month: "short" }), fmtDate(e.date, locale, { year: "numeric" })]
          : ["", "", ""];
        return (
          <li key={id} className={"flex gap-5 rounded-2xl border border-green-100 bg-white p-5 shadow-sm " + (e.status === "closed" ? "opacity-70" : "")}>
            <div className="flex w-24 shrink-0 flex-col items-center justify-center rounded-xl bg-green-800 p-3 text-center text-white">
              {dated ? (
                <>
                  <span className="text-4xl font-extrabold leading-none text-gold-300">{day}</span>
                  <span className="mt-1 text-sm font-bold">{month}</span>
                  <span className="text-xs text-white/70">{year}</span>
                </>
              ) : (
                <>
                  <Icon name="calendar" className="h-7 w-7 text-gold-300" />
                  <span className="mt-2 text-sm font-bold leading-tight">{t(e.dateText, locale)}</span>
                </>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-green-50 px-3 py-0.5 text-xs font-bold text-green-700" dir="ltr">{e.programme}</span>
                <span className={"rounded-full px-3 py-0.5 text-xs font-bold " + statusStyle[e.status]}>{d.status[e.status]}</span>
              </div>
              <h3 className="mt-2 text-lg font-extrabold leading-snug text-green-900">{t(e.title, locale)}</h3>
              {t(e.location, locale) && <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink/70"><Icon name="pin" className="h-4 w-4 text-gold-600" />{t(e.location, locale)}</p>}
              {t(e.note, locale) && <p className="mt-1 text-sm text-ink/70">{t(e.note, locale)}</p>}
              {e.status !== "closed" && (
                <a href={e.link || `mailto:${email}?subject=${encodeURIComponent(t(e.title, locale))}`} {...(e.link ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-green-700 hover:text-gold-600">
                  {d.exams.register} <Icon name="arrow" className="h-4 w-4 rtl:rotate-180" />
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function BenefitsGrid({ benefits, locale }: { benefits: Doc<BenefitDoc>[]; locale: Locale }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {benefits.map(({ id, data: b }) => (
        <li key={id} className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700"><Icon name={b.icon} className="h-7 w-7" /></span>
          <h3 className="mt-4 text-lg font-extrabold text-green-900">{t(b.title, locale)}</h3>
          <p className="mt-2 leading-7 text-ink/75">{t(b.text, locale)}</p>
        </li>
      ))}
    </ul>
  );
}

export function TeamCard({ person, locale }: { person: Doc<TeamDoc>; locale: Locale }) {
  const d = getDict(locale);
  const p = person.data;
  return (
    <li className="flex flex-col overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
      <div className="relative aspect-[4/5] bg-green-50">
        {p.photo ? (
          <Image src={p.photo} alt={t(p.name, locale)} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 45vw, 90vw" className="object-cover object-top" />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl font-extrabold text-green-700/40">{t(p.name, locale).trim().charAt(0)}</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-extrabold leading-snug text-green-900">{t(p.name, locale)}</h3>
        <p className="mt-1 font-semibold text-gold-600">{t(p.role, locale)}</p>
        {t(p.bio, locale) && <p className="mt-2 text-sm leading-6 text-ink/75">{t(p.bio, locale)}</p>}
        {p.linkedin && (
          <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-bold text-green-700 hover:text-gold-600" aria-label={`${t(p.name, locale)} – ${d.team.linkedin}`}>
            <Icon name="linkedin" className="h-5 w-5" /> LinkedIn
          </a>
        )}
      </div>
    </li>
  );
}

export function NewsCards({ items, locale }: { items: Doc<NewsDoc>[]; locale: Locale }) {
  const d = getDict(locale);
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {items.map(({ id, data: n }) => (
        <li key={id} className="group overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
          <Link href={`/${locale}/news/${id}`} className="block">
            <div className="relative aspect-[16/10] bg-green-50">
              {n.image && <Image src={n.image} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />}
            </div>
            <div className="p-5">
              {n.date && <time className="text-sm font-semibold text-gold-600" dateTime={n.date}>{fmtDate(n.date, locale)}</time>}
              <h3 className="mt-1 text-lg font-extrabold leading-snug text-green-900">{t(n.title, locale)}</h3>
              <p className="mt-2 line-clamp-3 text-ink/75">{t(n.excerpt, locale)}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-green-700">{d.readMore} <Icon name="arrow" className="h-4 w-4 rtl:rotate-180" /></span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function JoinBand({ locale, image, title, text }: { locale: Locale; image?: string; title?: string; text?: string; source?: string }) {
  const d = getDict(locale);
  return (
    <section id="join" className="relative isolate overflow-hidden bg-green-900 text-white">
      {image && <Image src={image} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-25" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-950/90 to-green-800/70" />
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <div className="mx-auto mb-4 h-1 w-14 rounded bg-gold-500" />
        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">{title || d.account.registerTitle}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-white/85">{text || d.account.registerText}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/${locale}/register`} className="btn btn-gold">{d.account.register}</Link>
          <Link href={`/${locale}/login`} className="btn btn-outline text-white">{d.account.signIn}</Link>
        </div>
      </div>
    </section>
  );
}

export function ContactCards({ s, locale }: { s: SiteSettings; locale: Locale }) {
  const d = getDict(locale).contact;
  const card = "flex items-center gap-4 rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md";
  const ic = "flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-800 text-gold-300";
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <a href={`mailto:${s.email}`} className={card}>
        <span className={ic}><Icon name="mail" className="h-7 w-7" /></span>
        <span className="min-w-0"><span className="block text-sm font-semibold text-ink/60">{d.email}</span><span className="block break-all text-lg font-extrabold text-green-900" dir="ltr">{s.email}</span></span>
      </a>
      {s.phone && (
        <a href={telHref(s.phone)} className={card}>
          <span className={ic}><Icon name="phone" className="h-7 w-7" /></span>
          <span><span className="block text-sm font-semibold text-ink/60">{d.phone}</span><span className="block text-lg font-extrabold text-green-900" dir="ltr">{s.phone}</span></span>
        </a>
      )}
      {s.whatsapp && (
        <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className={card}>
          <span className={ic}><Icon name="whatsapp" className="h-7 w-7" /></span>
          <span><span className="block text-sm font-semibold text-ink/60">{d.whatsapp}</span><span className="block text-lg font-extrabold text-green-900" dir="ltr">+{s.whatsapp.replace(/\D/g, "")}</span></span>
        </a>
      )}
      {t(s.address, locale) && (
        <div className={card}>
          <span className={ic}><Icon name="pin" className="h-7 w-7" /></span>
          <span><span className="block text-sm font-semibold text-ink/60">{d.address}</span><span className="block text-lg font-extrabold text-green-900">{t(s.address, locale)}</span></span>
        </div>
      )}
    </div>
  );
}

export function EventCards({ events, locale, past = false }: { events: Doc<ProjectEventDoc>[]; locale: Locale; past?: boolean }) {
  const d = getDict(locale);
  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {events.map(({ id, data: e }) => (
        <li key={id} className={"flex flex-col overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm md:col-span-2 md:flex-row " + (past ? "opacity-85" : "")}>
          {e.image && <div className="relative aspect-[4/5] w-full shrink-0 bg-green-50 md:w-72"><Image src={e.image} alt={t(e.title, locale)} fill sizes="(min-width:768px) 288px, 100vw" className="object-cover" /></div>}
          <div className="flex flex-1 flex-col p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-green-800 px-3 py-0.5 text-xs font-bold text-white">{d.events[e.kind]}</span>
              {e.date && <time dateTime={e.date} className="text-sm font-bold text-gold-600">{fmtDate(e.date, locale)}{e.time && <> · <span dir="ltr">{e.time}</span></>}</time>}
            </div>
            <h3 className="mt-2 text-xl font-extrabold leading-snug text-green-900">{t(e.title, locale)}</h3>
            {t(e.description, locale) && <p className="mt-2 leading-7 text-ink/75">{t(e.description, locale)}</p>}
            {t(e.speaker, locale) && <p className="mt-2 text-sm"><span className="font-bold text-green-800">{d.events.speaker}:</span> {t(e.speaker, locale)}</p>}
            {t(e.format, locale) && <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink/70"><Icon name="pin" className="h-4 w-4 text-gold-600" />{t(e.format, locale)}</p>}
            <div className="mt-auto flex flex-wrap gap-3 pt-4">
              {!past && e.status !== "closed" && e.link && <a href={e.link} target="_blank" rel="noopener noreferrer" className="btn btn-gold !py-2">{d.events.register}</a>}
              {!past && e.status === "closed" && <span className="text-sm font-bold text-ink/60">{d.events.full}</span>}
              {past && e.recording && <a href={e.recording} target="_blank" rel="noopener noreferrer" className="btn btn-green !py-2">{d.events.recording}</a>}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
