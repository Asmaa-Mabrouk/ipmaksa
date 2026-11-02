import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsletterBand, PageHero } from "@/components/Sections";
import { getPage, getPages } from "@/lib/content/api";
import { LOCALES, getDict, isLocale, t } from "@/lib/i18n";
import { Markdown } from "@/lib/markdown";

const RESERVED = new Set(["team", "membership", "exam-dates", "news", "contact", "newsletter", "project-connect"]);

export async function generateStaticParams() {
  const pages = (await getPages()).filter((p) => !RESERVED.has(p.id));
  return LOCALES.flatMap((lang) => pages.map((p) => ({ lang, slug: p.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = isLocale(lang) && !RESERVED.has(slug) ? await getPage(slug) : null;
  if (!p || !isLocale(lang)) return {};
  return { title: t(p.data.title, lang), description: t(p.data.intro, lang), alternates: { canonical: `/${lang}/${slug}`, languages: { ar: `/ar/${slug}`, en: `/en/${slug}` } } };
}

export default async function ContentPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  if (RESERVED.has(slug)) notFound();
  const [page, all] = await Promise.all([getPage(slug), getPages()]);
  if (!page) notFound();
  const d = getDict(lang);
  const siblings = all.filter((p) => p.data.group === page.data.group && page.data.group !== "other" && page.data.group !== "main");
  return (
    <>
      <PageHero title={t(page.data.title, lang)} intro={t(page.data.intro, lang)} image={page.data.image || undefined} />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_20rem]">
        <article className="min-w-0 max-w-3xl"><Markdown source={t(page.data.body, lang)} /></article>
        {siblings.length > 1 && (
          <aside aria-label={d.footer.explore} className="h-fit rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
            <ul className="grid gap-1">
              {siblings.map((p) => (
                <li key={p.id}>
                  <Link href={`/${lang}/${p.id}`} aria-current={p.id === slug ? "page" : undefined} className={"block rounded-xl px-4 py-2.5 text-sm font-semibold " + (p.id === slug ? "bg-green-800 text-white" : "text-green-900 hover:bg-green-50")}>{t(p.data.title, lang)}</Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
      <NewsletterBand locale={lang} source={`page-${slug}`} />
    </>
  );
}
