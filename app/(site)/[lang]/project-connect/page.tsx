import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventCards, JoinBand, PageHero } from "@/components/Sections";
import { getEvents, getPage } from "@/lib/content/api";
import { JsonLd } from "@/components/JsonLd";
import { getDict, isLocale, t } from "@/lib/i18n";
import type { ProjectEventDoc } from "@/lib/content/types";
import { SITE, abs } from "@/lib/seo";
import { Markdown } from "@/lib/markdown";
import { eventEnded, validRegistrationLink } from "@/lib/events";

export const revalidate = 300; // re-check "upcoming vs past" every 5 minutes

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const p = isLocale(lang) ? await getPage("project-connect") : null;
  return p && isLocale(lang) ? pageMeta({ lang, path: "/project-connect", title: t(p.data.title, lang), description: t(p.data.intro, lang), image: p.data.image || undefined }) : {};
}

export default async function ProjectConnect({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const [page, events] = await Promise.all([getPage("project-connect"), getEvents()]);
  const isPast = (e: { data: ProjectEventDoc }) => eventEnded(e.data);
  const upcoming = events.filter((e) => !isPast(e));
  const past = events.filter(isPast).reverse();
  const ld = events.filter((e) => e.data.date).map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: t(e.data.title, lang),
    description: t(e.data.description, lang),
    startDate: e.data.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: { "@type": "VirtualLocation", url: validRegistrationLink(e.data.link) ? e.data.link : `${SITE}/${lang}/project-connect` },
    ...(e.data.image ? { image: abs(e.data.image) } : {}),
    ...(t(e.data.speaker, lang) ? { performer: { "@type": "Person", name: t(e.data.speaker, lang) } } : {}),
    organizer: { "@id": `${SITE}/#org` },
    offers: { "@type": "Offer", price: "0", priceCurrency: "SAR", availability: "https://schema.org/InStock", url: validRegistrationLink(e.data.link) ? e.data.link : `${SITE}/${lang}/project-connect` },
  }));
  return (
    <>
      <JsonLd data={ld} />
      <PageHero title={page ? t(page.data.title, lang) : d.nav.projectConnect} intro={page ? t(page.data.intro, lang) : undefined} image={page?.data.image || undefined} />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-12 grid items-center gap-8 md:grid-cols-[1fr_16rem]">
          {page && t(page.data.body, lang) ? <div className="max-w-3xl"><Markdown source={t(page.data.body, lang)} /></div> : <div />}
          <div className="mx-auto w-48 overflow-hidden rounded-3xl bg-[#f7f7f7] shadow-lg ring-1 ring-green-100 md:w-64">
            <Image src="/images/project-connect-logo.webp" alt="Project Connect – ملتقى المشاريع" width={497} height={700} className="h-auto w-full" />
          </div>
        </div>
        <Link href={`/${lang}/project-connect/magazine`} className="mb-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold-500/60 bg-green-900 p-6 text-white transition hover:bg-green-800">
          <span>
            <span className="block text-2xl font-extrabold">{d.magazine.name}</span>
            <span className="mt-1 block max-w-2xl text-white/85">{d.magazine.cardText}</span>
          </span>
          <span className="btn btn-gold">{d.magazine.readMagazine}</span>
        </Link>
        <h2 className="mb-6 text-2xl font-extrabold text-green-900">{d.events.upcoming}</h2>
        {upcoming.length ? <EventCards events={upcoming} locale={lang} /> : <p className="rounded-xl border border-green-900/15 bg-white p-8 text-center text-ink/70">{d.events.none}</p>}
        {past.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-2xl font-extrabold text-green-900">{d.events.past}</h2>
            <EventCards events={past} locale={lang} past />
          </section>
        )}
      </div>
      <JoinBand locale={lang} />
    </>
  );
}
