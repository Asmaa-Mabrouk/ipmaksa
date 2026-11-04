import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SITE, abs, breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JoinBand, columnLabel, fmtDate, readMinutes } from "@/components/Sections";
import { getArticle, getArticles } from "@/lib/content/api";
import { LOCALES, getDict, isLocale, t } from "@/lib/i18n";
import { Markdown } from "@/lib/markdown";

export const dynamicParams = true;

export async function generateStaticParams() {
  const list = await getArticles();
  return LOCALES.flatMap((lang) => list.map((a) => ({ lang, slug: a.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const a = isLocale(lang) ? await getArticle(slug) : null;
  if (!a || !isLocale(lang)) return {};
  return pageMeta({ lang, path: `/project-connect/magazine/articles/${slug}`, title: t(a.data.title, lang), description: t(a.data.excerpt, lang), image: a.data.image || undefined, type: "article", publishedTime: a.data.date || undefined });
}

export default async function MagazineArticle({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const a = await getArticle(slug);
  if (!a) notFound();
  const d = getDict(lang);
  const author = t(a.data.author, lang);
  const role = t(a.data.authorRole, lang);
  const path = `/project-connect/magazine/articles/${slug}`;
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: t(a.data.title, lang),
      description: t(a.data.excerpt, lang),
      inLanguage: lang,
      ...(a.data.date ? { datePublished: a.data.date, dateModified: a.data.date } : {}),
      ...(a.data.image ? { image: abs(a.data.image) } : {}),
      mainEntityOfPage: `${SITE}/${lang}${path}`,
      author: author ? { "@type": "Person", name: author, ...(role ? { jobTitle: role } : {}) } : { "@id": `${SITE}/#org` },
      publisher: { "@id": `${SITE}/#org` },
    },
    breadcrumbJsonLd(lang, [{ name: d.siteName, path: "/" }, { name: d.nav.projectConnect, path: "/project-connect" }, { name: d.magazine.name, path: "/project-connect/magazine" }, { name: d.magazine.nav.articles, path: "/project-connect/magazine/articles" }, { name: t(a.data.title, lang), path }]),
  ];
  return (
    <>
      <JsonLd data={ld} />
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <Link href={`/${lang}/project-connect/magazine/articles`} className="text-sm font-bold text-green-700 hover:text-gold-600">← {d.magazine.back}</Link>
        <p className="mt-6 font-semibold text-gold-600">
          {columnLabel(a.data.column, lang) && <Link href={`/${lang}/project-connect/magazine/articles?column=${a.data.column}`} className="font-extrabold text-green-800 hover:text-gold-600">{columnLabel(a.data.column, lang)}</Link>}
          {columnLabel(a.data.column, lang) && " · "}
          {a.data.date && <time dateTime={a.data.date}>{fmtDate(a.data.date, lang)}</time>}
          {a.data.date && " · "}
          {readMinutes(t(a.data.body, lang))} {d.magazine.minRead}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight text-green-900 sm:text-4xl">{t(a.data.title, lang)}</h1>
        {t(a.data.excerpt, lang) && <p className="mt-4 text-xl leading-9 text-ink/75">{t(a.data.excerpt, lang)}</p>}
        {author && (
          <p className="mt-5 border-s-4 border-gold-500 ps-4 text-green-900">
            <span className="font-extrabold">{d.magazine.by} {author}</span>
            {role && <span className="block text-sm text-ink/70">{role}</span>}
          </p>
        )}
        {a.data.image && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl"><Image src={a.data.image} alt="" fill priority sizes="(min-width:768px) 768px, 100vw" className="object-cover" /></div>
        )}
        <Markdown source={t(a.data.body, lang)} className="mt-8" />
        <p className="mt-12 rounded-2xl bg-green-50 p-5 text-green-900">
          <Link href={`/${lang}/project-connect/magazine/guidelines`} className="font-extrabold underline decoration-gold-500 decoration-2 underline-offset-4">{d.magazine.write}</Link>
          <span className="block text-sm text-ink/70">{d.magazine.writeText}</span>
        </p>
      </article>
      <JoinBand locale={lang} />
    </>
  );
}
