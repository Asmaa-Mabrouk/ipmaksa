import Image from "next/image";
import Link from "next/link";
import { Icon } from "./Icon";
import { Carousel } from "./Carousel";
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

const statusDot: Record<string, string> = {
  open: "bg-green-600",
  soon: "bg-gold-500",
  tba: "bg-ink/40",
  closed: "bg-ink/30",
};

export function ExamCards({ exams, locale, email, whatsapp = "", limit }: { exams: Doc<ExamDoc>[]; locale: Locale; email: string; whatsapp?: string; limit?: number }) {
  const d = getDict(locale);
  const wa = whatsapp.replace(/\D/g, "");
  const list = (limit ? exams.filter((e) => e.data.status !== "closed").slice(0, limit) : exams);
  if (!list.length) return <p className="border border-green-900/15 bg-white p-8 text-center text-ink/70">{d.exams.none}</p>;
  const link = "font-bold text-green-800 underline decoration-gold-500 decoration-2 underline-offset-4 hover:text-green-950";
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {list.map(({ id, data: e }) => {
        const dated = !!e.date;
        const [day, month, year] = dated
          ? [fmtDate(e.date, locale, { day: "numeric" }), fmtDate(e.date, locale, { month: "short" }), fmtDate(e.date, locale, { year: "numeric" })]
          : ["", "", ""];
        return (
          <li key={id} className={"grid grid-cols-[6rem_1fr] overflow-hidden rounded-sm border border-green-900/20 bg-white " + (e.status === "closed" ? "opacity-70" : "")}>
            {/* ticket stub: the date is the thing people scan for */}
            <div className="flex flex-col items-center justify-center border-e-2 border-dashed border-gold-500 bg-green-900 px-2 py-5 text-center text-white">
              {dated ? (
                <>
                  <span className="text-5xl font-extrabold leading-none text-gold-300">{day}</span>
                  <span className="mt-1.5 text-base font-bold">{month}</span>
                  <span className="text-xs text-white/65">{year}</span>
                </>
              ) : (
                <>
                  <Icon name="calendar" className="h-7 w-7 text-gold-300" />
                  <span className="mt-2 text-sm font-bold leading-tight">{t(e.dateText, locale)}</span>
                </>
              )}
            </div>
            <div className="min-w-0 p-5">
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold">
                <span className="text-green-700" dir="ltr">{e.programme}</span>
                <span className="inline-flex items-center gap-2 text-ink/75">
                  <span className={"h-2.5 w-2.5 rotate-45 " + statusDot[e.status]} aria-hidden="true" />{d.status[e.status]}
                </span>
              </p>
              <h3 className="mt-2 text-lg font-extrabold leading-snug text-green-900">{t(e.title, locale)}</h3>
              {t(e.location, locale) && <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink/70"><Icon name="pin" className="h-4 w-4 text-gold-600" />{t(e.location, locale)}</p>}
              {t(e.note, locale) && <p className="mt-1 text-sm text-ink/70">{t(e.note, locale)}</p>}
              {e.status !== "closed" && (
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                  {e.link && (
                    <a href={e.link} target="_blank" rel="noopener noreferrer" className="btn btn-green !rounded-sm !px-4 !py-2 text-sm">{d.exams.registerNow}</a>
                  )}
                  {wa && (
                    <a href={`https://wa.me/${wa}?text=${encodeURIComponent(d.exams.waMessage + t(e.title, locale))}`} target="_blank" rel="noopener noreferrer" className={"inline-flex items-center gap-1.5 text-sm " + link}>
                      <Icon name="whatsapp" className="h-5 w-5 text-[#1f8f4e]" />{d.exams.askWhatsapp}
                    </a>
                  )}
                  <a href={`mailto:${email}?subject=${encodeURIComponent(t(e.title, locale))}`} className={"inline-flex items-center gap-1.5 text-sm " + link}>
                    <Icon name="mail" className="h-5 w-5" />{d.exams.askEmail}
                  </a>
                </div>
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
    <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {benefits.map(({ id, data: b }) => (
        <li key={id} className="border-t-2 border-green-900 pt-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-green-900 text-gold-300"><Icon name={b.icon} className="h-7 w-7" /></span>
          <h3 className="mt-6 text-lg font-extrabold text-green-900">{t(b.title, locale)}</h3>
          <p className="mt-2 leading-7 text-ink/75">{t(b.text, locale)}</p>
        </li>
      ))}
    </ul>
  );
}

export function TeamCard({ person, locale, as: Tag = "li" }: { person: Doc<TeamDoc>; locale: Locale; as?: "li" | "div" }) {
  const d = getDict(locale);
  const p = person.data;
  return (
    <Tag className="flex flex-col">
      {/* arch frame: the mashrabiya / doorway shape, not a rounded rectangle */}
      <div className="rounded-t-[999px] border border-gold-500 p-1.5">
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] bg-green-50">
          {p.photo ? (
            <Image src={p.photo} alt={t(p.name, locale)} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 45vw, 90vw" className="object-cover object-top" />
          ) : (
            <div className="flex h-full items-center justify-center bg-green-900 text-6xl font-extrabold text-gold-300">{t(p.name, locale).trim().charAt(0)}</div>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="text-lg font-extrabold leading-snug text-green-900">{t(p.name, locale)}</h3>
        <p className="mt-0.5 font-semibold text-gold-600">{t(p.role, locale)}</p>
        {t(p.bio, locale) && <p className="mt-2 text-sm leading-6 text-ink/75">{t(p.bio, locale)}</p>}
        {p.linkedin && (
          <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-2 pt-3 text-sm font-bold text-green-700 hover:text-green-950" aria-label={`${t(p.name, locale)} – ${d.team.linkedin}`}>
            <Icon name="linkedin" className="h-5 w-5" /> LinkedIn
          </a>
        )}
      </div>
    </Tag>
  );
}

export function NewsCard({ id, n, locale, as: Tag = "li" }: { id: string; n: NewsDoc; locale: Locale; as?: "li" | "div" }) {
  const d = getDict(locale);
  return (
    <Tag className="group h-full">
      <Link href={`/${locale}/news/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-green-900">
          {n.image && <Image src={n.image} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />}
          {n.date && <time className="absolute bottom-0 start-0 bg-gold-500 px-3 py-1 text-sm font-extrabold text-green-950" dateTime={n.date}>{fmtDate(n.date, locale)}</time>}
        </div>
        <h3 className="mt-4 text-xl font-extrabold leading-snug text-green-900 decoration-gold-500 decoration-2 underline-offset-4 group-hover:underline">{t(n.title, locale)}</h3>
        <p className="mt-2 line-clamp-3 leading-7 text-ink/75">{t(n.excerpt, locale)}</p>
        <span className="mt-3 inline-block border-b-2 border-gold-500 pb-0.5 text-sm font-bold text-green-800">{d.readMore}</span>
      </Link>
    </Tag>
  );
}

export function NewsCards({ items, locale }: { items: Doc<NewsDoc>[]; locale: Locale }) {
  return (
    <ul className="grid gap-x-8 gap-y-10 md:grid-cols-3">
      {items.map(({ id, data: n }) => <NewsCard key={id} id={id} n={n} locale={locale} />)}
    </ul>
  );
}

export function NewsSlider({ items, locale }: { items: Doc<NewsDoc>[]; locale: Locale }) {
  const d = getDict(locale);
  return <Carousel label={d.sections.news} prev={d.slider.prev} next={d.slider.next} slides={items.map(({ id, data: n }) => <NewsCard key={id} id={id} n={n} locale={locale} as="div" />)} />;
}

export function TeamSlider({ people, locale }: { people: Doc<TeamDoc>[]; locale: Locale }) {
  const d = getDict(locale);
  return <Carousel label={d.sections.team} prev={d.slider.prev} next={d.slider.next} slideClass="w-[64%] sm:w-64" slides={people.map((p) => <TeamCard key={p.id} person={p} locale={locale} as="div" />)} />;
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
  const card = "flex items-center gap-4 rounded-sm border border-green-900/20 border-s-4 border-s-gold-500 bg-white p-5";
  const ic = "flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-green-900 text-gold-300";
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
    <ul className="grid gap-6">
      {events.map(({ id, data: e }) => (
        <li key={id} className={"flex flex-col overflow-hidden rounded-sm border border-green-900/20 border-s-[6px] border-s-gold-500 bg-white md:flex-row " + (past ? "opacity-85" : "")}>
          {e.image && <div className="relative aspect-[4/5] w-full shrink-0 bg-green-900 md:w-72"><Image src={e.image} alt={t(e.title, locale)} fill sizes="(min-width:768px) 288px, 100vw" className="object-cover" /></div>}
          <div className="flex flex-1 flex-col p-6">
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold">
              <span className="inline-flex items-center gap-2 text-green-800"><span className="h-2.5 w-2.5 rotate-45 bg-gold-500" aria-hidden="true" />{d.events[e.kind]}</span>
              {e.date && <time dateTime={e.date} className="text-gold-600">{fmtDate(e.date, locale)}{e.time && <>, <span dir="ltr">{e.time}</span></>}</time>}
            </p>
            <h3 className="mt-2 text-xl font-extrabold leading-snug text-green-900">{t(e.title, locale)}</h3>
            {t(e.description, locale) && <p className="mt-2 leading-7 text-ink/75">{t(e.description, locale)}</p>}
            {t(e.speaker, locale) && <p className="mt-2 text-sm"><span className="font-bold text-green-800">{d.events.speaker}:</span> {t(e.speaker, locale)}</p>}
            {t(e.format, locale) && <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink/70"><Icon name="pin" className="h-4 w-4 text-gold-600" />{t(e.format, locale)}</p>}
            <div className="mt-auto flex flex-wrap gap-3 pt-4">
              {!past && e.status !== "closed" && e.link && <a href={e.link} target="_blank" rel="noopener noreferrer" className="btn btn-gold !rounded-sm !py-2">{d.events.register}</a>}
              {!past && e.status === "closed" && <span className="text-sm font-bold text-ink/60">{d.events.full}</span>}
              {past && e.recording && <a href={e.recording} target="_blank" rel="noopener noreferrer" className="btn btn-green !rounded-sm !py-2">{d.events.recording}</a>}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
