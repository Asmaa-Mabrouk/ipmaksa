import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import { JoinBand, MagazineTabs, PageHero } from "@/components/Sections";
import { getPage } from "@/lib/content/api";
import { getDict, isLocale, t } from "@/lib/i18n";
import { Markdown } from "@/lib/markdown";

const ID = "project-connect-magazine-guidelines";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const p = isLocale(lang) ? await getPage(ID) : null;
  return p && isLocale(lang) ? pageMeta({ lang, path: "/project-connect/magazine/guidelines", title: t(p.data.title, lang), description: t(p.data.intro, lang), image: p.data.image || undefined }) : {};
}

export default async function MagazineGuidelines({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const page = await getPage(ID);
  if (!page) notFound();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(lang, [{ name: d.siteName, path: "/" }, { name: d.nav.projectConnect, path: "/project-connect" }, { name: d.magazine.name, path: "/project-connect/magazine" }, { name: t(page.data.title, lang), path: "/project-connect/magazine/guidelines" }])} />
      <PageHero title={t(page.data.title, lang)} intro={t(page.data.intro, lang)} image={page.data.image || undefined} />
      <MagazineTabs locale={lang} current="guidelines" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6"><article className="max-w-3xl"><Markdown source={t(page.data.body, lang)} /></article></div>
      <JoinBand locale={lang} title={d.magazine.write} text={d.magazine.writeText} />
    </>
  );
}
