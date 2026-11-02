import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqList, JourneyCycle, PrepareBlock } from "@/components/Journey";
import { JoinBand, PageHero } from "@/components/Sections";
import { getJourney, getSettings } from "@/lib/content/api";
import { getDict, isLocale, t } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? { title: getDict(lang).nav.journey } : {};
}

export default async function JourneyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const [j, s] = await Promise.all([getJourney(), getSettings()]);
  return (
    <>
      <PageHero title={getDict(lang).nav.journey} intro={t(j.cycleIntro, lang)} />
      <JourneyCycle j={j} locale={lang} />
      <PrepareBlock j={j} locale={lang} />
      <FaqList j={j} locale={lang} email={s.email} />
      <JoinBand locale={lang} />
    </>
  );
}
