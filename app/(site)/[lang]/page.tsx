import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { FaqList, JourneyCycle, PrepareBlock } from "@/components/Journey";
import { BenefitsGrid, EventCards, ExamCards, NewsCards, JoinBand, SectionTitle, TeamCard } from "@/components/Sections";
import { telHref } from "@/components/SiteChrome";
import { getBenefits, getEvents, getExams, getHome, getJourney, getNews, getSettings, getTeam } from "@/lib/content/api";
import { getDict, isLocale, t } from "@/lib/i18n";
import { Markdown } from "@/lib/markdown";

const SECTORS = [
  { img: "sector-cities", ar: "المدن", en: "Cities" },
  { img: "sector-tourism", ar: "السياحة", en: "Tourism" },
  { img: "sector-entertainment", ar: "الترفيه", en: "Entertainment" },
  { img: "sector-mobility", ar: "النقل", en: "Mobility" },
  { img: "sector-industry", ar: "الصناعة", en: "Industry" },
];
const LIVE_STYLE: Record<string, { border: string; bar: string; tile: string; pill: string; icon: string }> = {
  live: { border: "border-green-100", bar: "bg-green-600", tile: "bg-green-900 text-gold-300", pill: "bg-green-100 text-green-800", icon: "M5 12.5l4.5 4.5L19 7.5" },
  "setting-up": { border: "border-gold-500/40", bar: "bg-gold-500", tile: "bg-gold-100 text-gold-600", pill: "bg-gold-100 text-gold-600", icon: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" },
  introduced: { border: "border-green-100", bar: "bg-green-300", tile: "bg-green-50 text-green-700", pill: "bg-green-50 text-green-700", icon: "M5 21V4m0 0h11l-2 4 2 4H5" },
  later: { border: "border-ink/10", bar: "bg-ink/20", tile: "bg-sand text-ink/50", pill: "bg-sand text-ink/60", icon: "M8 3v3m8-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" },
};

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const [h, s, exams, benefits, news, team, events, journey] = await Promise.all([getHome(), getSettings(), getExams(), getBenefits(), getNews(), getTeam(), getEvents(), getJourney()]);
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" });
  const nextEvents = events.filter((e) => e.data.status !== "closed" && (!e.data.date || e.data.date >= today)).slice(0, 2);
  const base = `/${lang}`;
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-green-950 text-white">
        <Image src={h.heroImage} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-green-950 via-green-950/60 to-green-900/30 sm:bg-gradient-to-e" />
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-36">
          <p className="reveal inline-block rounded-full bg-gold-500/20 px-4 py-1 text-sm font-bold text-gold-300 ring-1 ring-gold-500/40">{t(h.heroEyebrow, lang)}</p>
          <h1 className="reveal mt-5 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">{t(h.heroTitle, lang)}</h1>
          <p className="reveal mt-5 max-w-2xl text-lg leading-8 text-white/90 sm:text-xl">{t(h.heroText, lang)}</p>
          <div className="reveal mt-8 flex flex-wrap gap-3">
            <Link href={`${base}/register`} className="btn btn-gold">{d.joinCta}</Link>
            <Link href={`${base}/exam-dates`} className="btn btn-outline text-white">{d.nav.examDates}</Link>
          </div>
          <div className="reveal mt-10 flex flex-wrap gap-3 text-sm">
            <a href={`mailto:${s.email}`} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold ring-1 ring-white/20 hover:bg-white/20"><Icon name="mail" className="h-4 w-4 text-gold-300" /><span dir="ltr">{s.email}</span></a>
            {s.phone && <a href={telHref(s.phone)} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold ring-1 ring-white/20 hover:bg-white/20"><Icon name="phone" className="h-4 w-4 text-gold-300" /><span dir="ltr">{s.phone}</span></a>}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section aria-label="IPMA KSA in numbers" className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 sm:px-6">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-green-100 shadow-xl lg:grid-cols-4">
          {h.stats.map((st, i) => (
            <li key={i} className="bg-white p-5 text-center sm:p-7">
              <p className="text-4xl font-extrabold text-green-700 sm:text-5xl"><span dir="ltr">{st.value}{st.suffix}</span></p>
              <p className="mt-1 text-sm font-semibold leading-snug text-ink/70">{t(st.label, lang)}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* WHY CERTIFY */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionTitle title={t(h.pillarsTitle, lang)} center />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {h.pillars.map((p, i) => (
            <li key={i} className="rounded-2xl border border-green-100 bg-white p-7 shadow-sm">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-800 text-gold-300"><Icon name={p.icon} className="h-8 w-8" /></span>
              <h3 className="mt-5 text-xl font-extrabold text-green-900">{t(p.title, lang)}</h3>
              <p className="mt-2 leading-7 text-ink/75">{t(p.text, lang)}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* SAUDI AMBITION */}
      <section className="bg-green-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle title={t(h.ambitionTitle, lang)} intro={t(h.ambitionText, lang)} />
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {SECTORS.map((x) => (
              <li key={x.img} className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                <Image src={`/images/${x.img}.webp`} alt="" fill sizes="(min-width:1024px) 20vw, 45vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4 text-lg font-extrabold">{lang === "ar" ? x.ar : x.en}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ABOUT */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionTitle title={t(h.aboutTitle, lang)} />
          <Markdown source={t(h.aboutText, lang)} className="mt-5" />
          <Link href={`${base}/about-us`} className="btn btn-green mt-6">{d.learnMore}</Link>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
          <Image src={h.aboutImage} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      {/* WHAT'S LIVE */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle title={t(h.liveTitle, lang)} intro={t(h.liveText, lang)} />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {h.live.map((x, i) => {
              const st = LIVE_STYLE[x.status] ?? LIVE_STYLE.later;
              return (
                <li key={i} className={"group relative flex flex-col overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md " + st.border}>
                  <span className={"absolute inset-y-0 start-0 w-1.5 " + st.bar} aria-hidden="true" />
                  <div className="flex items-start justify-between gap-3">
                    <span className={"flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl " + st.tile}>
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={st.icon} /></svg>
                    </span>
                    <span className={"rounded-full px-3 py-1 text-xs font-extrabold " + st.pill}>{d.live[x.status]}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold leading-snug text-green-900" dir="auto">{t(x.title, lang)}</h3>
                  <p className="mt-2 leading-8 text-ink/75">{t(x.text, lang)}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* HOW CERTIFICATION WORKS */}
      <JourneyCycle j={journey} locale={lang} showLink />

      {/* EXAM DATES */}
      <section id="exams" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle title={d.sections.exams} intro={d.sections.examsIntro} />
          <Link href={`${base}/exam-dates`} className="btn btn-green">{d.viewAll}</Link>
        </div>
        <div className="mt-8"><ExamCards exams={exams} locale={lang} email={s.email} whatsapp={s.whatsapp} limit={4} /></div>
      </section>

      {/* HOW TO PREPARE + FAQ */}
      <PrepareBlock j={journey} locale={lang} />
      <FaqList j={journey} locale={lang} limit={4} showLink email={s.email} />

      {/* PROJECT CONNECT */}
      {nextEvents.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle title={`${d.nav.projectConnect} · ${d.events.upcoming}`} />
            <Link href={`${base}/project-connect`} className="btn btn-green">{d.viewAll}</Link>
          </div>
          <div className="mt-8"><EventCards events={nextEvents} locale={lang} /></div>
        </section>
      )}

      {/* GPMF */}
      <section className="relative isolate overflow-hidden bg-green-950 py-20 text-white">
        <Image src={h.gpmfImage} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-30" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="inline-block rounded-full bg-gold-500 px-4 py-1 text-sm font-extrabold text-green-950">{d.gpmf}</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">{t(h.gpmfTitle, lang)}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/85">{t(h.gpmfText, lang)}</p>
        </div>
      </section>

      {/* MEMBERSHIP BENEFITS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle title={d.sections.benefits} intro={d.sections.benefitsIntro} />
          <Link href={`${base}/membership`} className="btn btn-green">{d.nav.membership}</Link>
        </div>
        <div className="mt-8"><BenefitsGrid benefits={benefits} locale={lang} /></div>
      </section>

      {/* TEAM */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle title={d.sections.team} />
            <Link href={`${base}/team`} className="btn btn-green">{d.viewAll}</Link>
          </div>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {team.slice(0, 5).map((p) => <TeamCard key={p.id} person={p} locale={lang} />)}
          </ul>
        </div>
      </section>

      {/* NEWS */}
      {news.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle title={d.sections.news} />
            <Link href={`${base}/news`} className="btn btn-green">{d.viewAll}</Link>
          </div>
          <div className="mt-8"><NewsCards items={news.slice(0, 3)} locale={lang} /></div>
        </section>
      )}

      <JoinBand locale={lang} image={h.joinImage} title={t(h.joinTitle, lang)} text={t(h.joinText, lang)} />
    </>
  );
}
