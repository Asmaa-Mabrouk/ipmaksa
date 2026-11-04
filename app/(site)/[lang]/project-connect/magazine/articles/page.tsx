import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import { ArticleCards, ColumnTabs, FeaturedArticle, JoinBand, MagazineTabs, PageHero } from "@/components/Sections";
import { getArticles } from "@/lib/content/api";
import { getDict, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMeta({ lang, path: "/project-connect/magazine/articles", title: `${d.magazine.nav.articles} | ${d.magazine.name}`, description: d.magazine.cardText });
}

export default async function MagazineArticles({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ column?: string }> }) {
  const { lang } = await params;
  const { column = "" } = await searchParams;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const all = await getArticles();
  const d2 = d.magazine.columns as Record<string, string>;
  const col = column in d2 ? column : "";
  const articles = col ? all.filter((a) => a.data.column === col) : all;
  const featured = !col ? articles.find((a) => a.data.featured) : undefined;
  const rest = featured ? articles.filter((a) => a.id !== featured.id) : articles;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(lang, [{ name: d.siteName, path: "/" }, { name: d.nav.projectConnect, path: "/project-connect" }, { name: d.magazine.name, path: "/project-connect/magazine" }, { name: d.magazine.nav.articles, path: "/project-connect/magazine/articles" }])} />
      <PageHero title={d.magazine.nav.articles} intro={d.magazine.cardText} />
      <MagazineTabs locale={lang} current="articles" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <ColumnTabs locale={lang} current={col} />
        {featured && <FeaturedArticle id={featured.id} a={featured.data} locale={lang} />}
        {rest.length ? <ArticleCards items={rest} locale={lang} /> : featured ? null : <p className="rounded-xl border border-green-900/15 bg-white p-8 text-center text-ink/70">{d.magazine.none}</p>}
      </div>
      <JoinBand locale={lang} title={d.magazine.write} text={d.magazine.writeText} />
    </>
  );
}
