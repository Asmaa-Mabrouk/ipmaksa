import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { EventCards, NewsletterBand, PageHero } from "@/components/Sections";
import { getEvents, getPage } from "@/lib/content/api";
import { getDict, isLocale, t } from "@/lib/i18n";
import { Markdown } from "@/lib/markdown";

export const revalidate = 3600; // re-check "upcoming vs past" every hour

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const p = isLocale(lang) ? await getPage("project-connect") : null;
  return p && isLocale(lang) ? { title: t(p.data.title, lang), description: t(p.data.intro, lang) } : {};
}

export default async function ProjectConnect({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const [page, events] = await Promise.all([getPage("project-connect"), getEvents()]);
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" });
  const isPast = (e: { data: { date: string } }) => !!e.data.date && e.data.date < today;
  const upcoming = events.filter((e) => !isPast(e));
  const past = events.filter(isPast).reverse();
  return (
    <>
      <PageHero title={page ? t(page.data.title, lang) : "Project Connect"} intro={page ? t(page.data.intro, lang) : undefined} image={page?.data.image || undefined} />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-12 grid items-center gap-8 md:grid-cols-[1fr_16rem]">
          {page && t(page.data.body, lang) ? <div className="max-w-3xl"><Markdown source={t(page.data.body, lang)} /></div> : <div />}
          <div className="mx-auto w-48 overflow-hidden rounded-3xl bg-[#f7f7f7] shadow-lg ring-1 ring-gold-300 md:w-64">
            <Image src="/images/project-connect-logo.webp" alt="Project Connect – ملتقى المشاريع" width={497} height={700} className="h-auto w-full" />
          </div>
        </div>
        <h2 className="mb-6 text-2xl font-extrabold text-green-900">{d.events.upcoming}</h2>
        {upcoming.length ? <EventCards events={upcoming} locale={lang} /> : <p className="rounded-2xl bg-white p-8 text-center text-ink/70 shadow-sm">{d.events.none}</p>}
        {past.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-2xl font-extrabold text-green-900">{d.events.past}</h2>
            <EventCards events={past} locale={lang} past />
          </section>
        )}
      </div>
      <NewsletterBand locale={lang} source="project-connect" />
    </>
  );
}
