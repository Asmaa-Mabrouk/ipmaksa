import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import { CompareLevels } from "@/components/CompareLevels";
import { FaqList, JourneyCycle, PrepareBlock } from "@/components/Journey";
import { JoinBand, PageHero } from "@/components/Sections";
import { getJourney, getSettings } from "@/lib/content/api";
import { getDict, isLocale, t } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMeta({ lang, path: "/certification-journey", title: d.nav.journey, description: lang === "ar" ? "كيف تعمل شهادة IPMA: مراحل الطلب والتقييم والمقابلة واعتماد الشهادة، وكيف تستعد باستخدام ICB4، وأكثر الأسئلة شيوعاً." : "How IPMA certification works in Saudi Arabia: application, assessment, interview and award, how to prepare with ICB4, and the most frequently asked questions." });
}

export default async function JourneyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const [j, s] = await Promise.all([getJourney(), getSettings()]);
  return (
    <>
      <PageHero title={getDict(lang).nav.journey} intro={t(j.cycleIntro, lang)} />
      <CompareLevels locale={lang} />
      <JourneyCycle j={j} locale={lang} />
      <PrepareBlock j={j} locale={lang} />
      <FaqList j={j} locale={lang} email={s.email} />
      <JoinBand locale={lang} />
    </>
  );
}
