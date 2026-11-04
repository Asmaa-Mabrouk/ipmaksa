import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCards, JoinBand, MagazineTabs, PageHero } from "@/components/Sections";
import { getArticles, getPage } from "@/lib/content/api";
import { getDict, isLocale, t } from "@/lib/i18n";
import { Markdown } from "@/lib/markdown";

const ID = "project-connect-magazine";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const p = isLocale(lang) ? await getPage(ID) : null;
  return p && isLocale(lang) ? pageMeta({ lang, path: "/project-connect/magazine", title: t(p.data.title, lang), description: t(p.data.intro, lang), image: p.data.image || undefined }) : {};
}

export default async function MagazineAbout({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const [page, articles] = await Promise.all([getPage(ID), getArticles()]);
  if (!page) notFound();
  const latest = articles.slice(0, 3);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(lang, [{ name: d.siteName, path: "/" }, { name: d.nav.projectConnect, path: "/project-connect" }, { name: d.magazine.name, path: "/project-connect/magazine" }])} />
      <PageHero title={t(page.data.title, lang)} intro={t(page.data.intro, lang)} image={page.data.image || undefined} />
      <MagazineTabs locale={lang} current="about" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <article className="max-w-3xl"><Markdown source={t(page.data.body, lang)} /></article>
        <section className="mt-16" aria-labelledby="latest">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="latest" className="text-2xl font-extrabold text-green-900">{d.magazine.latest}</h2>
            {latest.length > 0 && <Link href={`/${lang}/project-connect/magazine/articles`} className="text-sm font-bold text-green-800 underline decoration-gold-500 decoration-2 underline-offset-4">{d.magazine.all}</Link>}
          </div>
          {latest.length ? <ArticleCards items={latest} locale={lang} /> : <p className="rounded-xl border border-green-900/15 bg-white p-8 text-center text-ink/70">{d.magazine.none}</p>}
        </section>
      </div>
      <JoinBand locale={lang} title={d.magazine.write} text={d.magazine.writeText} />
    </>
  );
}
