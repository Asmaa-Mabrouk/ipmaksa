import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsCards, JoinBand, PageHero } from "@/components/Sections";
import { getNews, getPage } from "@/lib/content/api";
import { getDict, isLocale, t } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const p = isLocale(lang) ? await getPage("news") : null;
  return p && isLocale(lang) ? { title: t(p.data.title, lang), description: t(p.data.intro, lang) } : {};
}

export default async function NewsIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const [page, news] = await Promise.all([getPage("news"), getNews()]);
  return (
    <>
      <PageHero title={page ? t(page.data.title, lang) : d.nav.news} intro={page ? t(page.data.intro, lang) : undefined} image={page?.data.image || undefined} />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6"><NewsCards items={news} locale={lang} /></div>
      <JoinBand locale={lang} />
    </>
  );
}
