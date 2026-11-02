import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SITE, abs, breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JoinBand, fmtDate } from "@/components/Sections";
import { getNews, getNewsItem } from "@/lib/content/api";
import { LOCALES, getDict, isLocale, t } from "@/lib/i18n";
import { Markdown } from "@/lib/markdown";

export const dynamicParams = true;

export async function generateStaticParams() {
  const news = await getNews();
  return LOCALES.flatMap((lang) => news.map((n) => ({ lang, slug: n.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const n = isLocale(lang) ? await getNewsItem(slug) : null;
  if (!n || !isLocale(lang)) return {};
  return pageMeta({ lang, path: `/news/${slug}`, title: t(n.data.title, lang), description: t(n.data.excerpt, lang), image: n.data.image || undefined, type: "article", publishedTime: n.data.date || undefined });
}

export default async function NewsArticle({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const n = await getNewsItem(slug);
  if (!n) notFound();
  const d = getDict(lang);
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: t(n.data.title, lang),
      description: t(n.data.excerpt, lang),
      inLanguage: lang,
      ...(n.data.date ? { datePublished: n.data.date, dateModified: n.data.date } : {}),
      ...(n.data.image ? { image: abs(n.data.image) } : {}),
      mainEntityOfPage: `${SITE}/${lang}/news/${slug}`,
      author: { "@id": `${SITE}/#org` },
      publisher: { "@id": `${SITE}/#org` },
    },
    breadcrumbJsonLd(lang, [{ name: d.siteName, path: "/" }, { name: d.nav.news, path: "/news" }, { name: t(n.data.title, lang), path: `/news/${slug}` }]),
  ];
  return (
    <>
      <JsonLd data={ld} />
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <Link href={`/${lang}/news`} className="text-sm font-bold text-green-700 hover:text-gold-600">← {d.nav.news}</Link>
        {n.data.date && <time dateTime={n.data.date} className="mt-6 block font-semibold text-gold-600">{fmtDate(n.data.date, lang)}</time>}
        <h1 className="mt-2 text-3xl font-extrabold leading-tight text-green-900 sm:text-4xl">{t(n.data.title, lang)}</h1>
        {n.data.image && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl"><Image src={n.data.image} alt={t(n.data.title, lang)} fill priority sizes="(min-width:768px) 768px, 100vw" className="object-cover" /></div>
        )}
        <Markdown source={t(n.data.body, lang)} className="mt-8" />
      </article>
      <JoinBand locale={lang} />
    </>
  );
}
