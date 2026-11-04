import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { FaqList } from "@/components/Journey";
import { BenefitsGrid, EventCards, ExamCards, NewsSlider, JoinBand, SectionTitle, TeamCard } from "@/components/Sections";
import { Carousel } from "@/components/Carousel";
import { RowSlider } from "@/components/RowSlider";
import { telHref } from "@/components/SiteChrome";
import { getBenefits, getEvents, getExams, getHome, getJourney, getNews, getSettings, getTeam } from "@/lib/content/api";
import { eventEnded } from "@/lib/events";
import { getDict, isLocale, t } from "@/lib/i18n";
import { Markdown } from "@/lib/markdown";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

const SECTORS = [
  { img: "sector-cities", ar: "المدن", en: "Cities" },
  { img: "sector-tourism", ar: "السياحة", en: "Tourism" },
  { img: "sector-entertainment", ar: "الترفيه", en: "Entertainment" },
  { img: "sector-mobility", ar: "النقل", en: "Mobility" },
  { img: "sector-industry", ar: "الصناعة", en: "Industry" },
];
function LiveHeading({ label, n }: { label: string; n: number }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <h3 className="text-xl font-extrabold text-green-900">{label}</h3>
      <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-gold-100 px-2 text-sm font-extrabold text-gold-600">{n}</span>
      <span className="h-px flex-1 bg-green-900/15" aria-hidden="true" />
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMeta({
    lang,
    path: "/",
    title: lang === "ar" ? "IPMA السعودية | شهادات إدارة المشاريع الدولية في المملكة" : "IPMA KSA | International Project Management Certification in Saudi Arabia",
    description: lang === "ar"
      ? "الممثل الرسمي للجمعية الدولية لإدارة المشاريع (IPMA) في السعودية. اعرف كيف تحصل على شهادة IPMA، تاريخ الاختبارات القادمة، وانضم إلى ملتقى المشاريع."
      : "The official IPMA member in Saudi Arabia. Learn how to get IPMA certified, see upcoming exam dates and join the Project Connect community.",
  });
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const [h, s, exams, benefits, news, team, events, journey] = await Promise.all([getHome(), getSettings(), getExams(), getBenefits(), getNews(), getTeam(), getEvents(), getJourney()]);
  const nextEvents = events.filter((e) => e.data.status !== "closed" && !eventEnded(e.data)).slice(0, 2);
  const base = `/${lang}`;
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-green-950 text-white">
        <Image src={h.heroImage} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-green-950 via-green-950/60 to-green-900/30 sm:bg-gradient-to-e" />
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-36">
          <p className="reveal inline-block rounded-full bg-gold-500/20 px-4 py-1 text-sm font-bold text-gold-300 ring-1 ring-gold-500/40">{t(h.heroEyebrow, lang)}</p>
          <h1 className="reveal mt-5 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
            {t(h.heroTitle, lang).replace(/\s*\S+$/, "")}{" "}
            {/* the logo's double chevron, small, riding the end of the headline; points the way you read.
                Kept in a no-wrap span with the last word so it never drops onto its own line */}
            <span className="whitespace-nowrap">{t(h.heroTitle, lang).match(/\S+$/)?.[0]}<svg viewBox="-6 -6 56 64" className="chevrons ms-3 inline-block h-[0.72em] w-auto overflow-visible align-baseline rtl:-scale-x-100" fill="none" stroke="var(--color-ipma-red)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 4 L24 26 L5 48" />
              <path d="M21 4 L40 26 L21 48" opacity=".55" />
            </svg></span>
          </h1>
          <p className="reveal mt-5 max-w-2xl text-lg leading-8 text-white/90 sm:text-xl">{t(h.heroText, lang)}</p>
          <div className="reveal mt-8 flex flex-wrap gap-3">
            <Link href={`${base}/register`} className="btn btn-gold">{d.joinCta}</Link>
            <Link href={`${base}/certification-journey`} className="btn btn-outline text-white">{d.certCta}</Link>
          </div>
          {benefits[0] && (
            <p className="reveal mt-6 flex max-w-2xl items-start gap-2 text-white/90">
              <Icon name={benefits[0].data.icon} className="mt-1 h-5 w-5 shrink-0 text-gold-300" />
              <span><strong className="font-extrabold text-gold-300">{t(benefits[0].data.title, lang)}.</strong> {t(benefits[0].data.text, lang)}</span>
            </p>
          )}
          <div className="reveal mt-10 flex flex-wrap gap-3 text-sm">
            <a href={`mailto:${s.email}`} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold ring-1 ring-white/20 hover:bg-white/20"><Icon name="mail" className="h-4 w-4 text-gold-300" /><span dir="ltr">{s.email}</span></a>
            {s.phone && <a href={telHref(s.phone)} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold ring-1 ring-white/20 hover:bg-white/20"><Icon name="phone" className="h-4 w-4 text-gold-300" /><span dir="ltr">{s.phone}</span></a>}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section aria-label="IPMA KSA in numbers" className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 sm:px-6">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-green-100 lg:grid-cols-4">
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
            <li key={i} className="rounded-xl border border-green-100 bg-white p-7">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-800 text-gold-300"><Icon name={p.icon} className="h-8 w-8" /></span>
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
              <li key={x.img} className="relative aspect-[3/4] overflow-hidden rounded-xl">
                <Image src={`/images/${x.img}.webp`} alt="" fill sizes="(min-width:1024px) 20vw, 45vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-green-950/85 via-green-950/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-4 text-xl font-extrabold text-white"><span className="h-1 w-8 rounded bg-gold-500" aria-hidden="true" />{lang === "ar" ? x.ar : x.en}</span>
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
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image src={h.aboutImage} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      {/* WHAT'S LIVE */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle title={t(h.liveTitle, lang)} intro={t(h.liveText, lang)} />
          {(() => {
            const by = (...s: string[]) => h.live.filter((x) => s.includes(x.status));
            const live = by("live"), setting = by("setting-up"), rest = by("introduced", "later");
            return (
              <div className="mt-10 space-y-12">
                {live.length > 0 && (
                  <div>
                    <LiveHeading label={d.live.live} n={live.length} />
                    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                      {live.map((x, i) => (
                        <li key={i} className="relative isolate flex flex-col overflow-hidden rounded-xl bg-green-900 p-6 text-white">
                          <span className="absolute end-0 top-0 h-8 w-8 bg-gold-500 [clip-path:polygon(0_0,100%_0,100%_100%)] rtl:-scale-x-100" aria-hidden="true" />
                          <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-gold-500 text-gold-300">
                            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                          </span>
                          <h4 className="mt-5 text-xl font-extrabold leading-snug text-gold-300" dir="auto">{t(x.title, lang)}</h4>
                          <p className="mt-2 leading-7 text-white/85">{t(x.text, lang)}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {setting.length > 0 && (
                  <div>
                    <LiveHeading label={d.live["setting-up"]} n={setting.length} />
                    <ul className="grid gap-5 md:grid-cols-3">
                      {setting.map((x, i) => (
                        <li key={i} className="flex gap-4 rounded-xl border border-green-900/15 border-s-[6px] border-s-gold-500 bg-white p-5">
                          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" /></svg>
                          </span>
                          <div>
                            <h4 className="text-lg font-extrabold leading-snug text-green-900" dir="auto">{t(x.title, lang)}</h4>
                            <p className="mt-1 leading-7 text-ink/75">{t(x.text, lang)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {rest.length > 0 && (
                  <div>
                    <LiveHeading label={lang === "ar" ? "على الطريق" : "On the horizon"} n={rest.length} />
                    <ul className="grid gap-5 md:grid-cols-2">
                      {rest.map((x, i) => (
                        <li key={i} className="flex gap-4 rounded-xl border-2 border-dashed border-green-900/20 bg-green-50/60 p-5">
                          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-green-700 ring-1 ring-green-900/15">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d={x.status === "introduced" ? "M5 21V4m0 0h11l-2 4 2 4H5" : "M8 3v3m8-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"} />
                            </svg>
                          </span>
                          <div>
                            <h4 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-lg font-extrabold leading-snug text-green-900" dir="auto">
                              {t(x.title, lang)}
                              <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-green-800 ring-1 ring-green-900/20">{d.live[x.status]}</span>
                            </h4>
                            <p className="mt-1 leading-7 text-ink/75">{t(x.text, lang)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </section>

      {/* EXAM DATES */}
      <section id="exams" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle title={d.sections.exams} intro={d.sections.examsIntro} />
          <Link href={`${base}/exam-dates`} className="btn btn-green">{d.viewAll}</Link>
        </div>
        <div className="mt-8"><ExamCards exams={exams} locale={lang} email={s.email} certEmail={s.certEmail} whatsapp={s.whatsapp} limit={4} /></div>
      </section>

      {/* QUICK GUIDE: the full journey and preparation live on their own page */}
      <section aria-label={d.guide.title} className="bg-green-50 py-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-10 gap-y-5 px-4 sm:px-6">
          <div>
            <h2 className="text-2xl font-extrabold text-green-900">{d.guide.title}</h2>
            <p className="mt-1 text-ink/75">{d.guide.text}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`${base}/certification-journey#how-it-works`} className="btn btn-outline !border-green-800 !text-green-900 hover:!bg-green-900 hover:!text-white">{d.guide.journey}</Link>
            <Link href={`${base}/certification-journey#prepare`} className="btn btn-outline !border-green-800 !text-green-900 hover:!bg-green-900 hover:!text-white">{d.journeyUi.prepare}</Link>
          </div>
        </div>
      </section>
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
      <section id="team" className="scroll-mt-24 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle title={d.sections.team} intro={d.team.cbNote} />
          <div className="mt-8">
            <RowSlider label={d.sections.team} prev={d.slider.prev} next={d.slider.next} slides={team.map((p) => <TeamCard key={p.id} person={p} locale={lang} as="div" />)} />
          </div>
        </div>
      </section>

      {/* NEWS */}
      {news.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle title={d.sections.news} />
            <Link href={`${base}/news`} className="btn btn-green">{d.viewAll}</Link>
          </div>
          <div className="mt-8"><NewsSlider items={news.slice(0, 8)} locale={lang} /></div>
        </section>
      )}

      <JoinBand locale={lang} image={h.joinImage} title={t(h.joinTitle, lang)} text={t(h.joinText, lang)} />
    </>
  );
}
