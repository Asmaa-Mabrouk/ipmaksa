import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { BenefitsGrid, NewsletterBand, PageHero, SectionTitle } from "@/components/Sections";
import { getBenefits, getPage } from "@/lib/content/api";
import { getDict, isLocale, t } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const p = isLocale(lang) ? await getPage("membership") : null;
  return p && isLocale(lang) ? { title: t(p.data.title, lang), description: t(p.data.intro, lang) } : {};
}

export default async function Membership({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const [page, benefits] = await Promise.all([getPage("membership"), getBenefits()]);
  return (
    <>
      <PageHero title={page ? t(page.data.title, lang) : d.nav.membership} intro={page ? t(page.data.intro, lang) : undefined} image={page?.data.image || undefined} />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionTitle title={d.sections.benefits} intro={d.sections.benefitsIntro} />
        <div className="mt-8"><BenefitsGrid benefits={benefits} locale={lang} /></div>
        {page && t(page.data.body, lang) && (
          <p className="mt-10 flex items-start gap-3 rounded-2xl bg-gold-100 p-5 text-lg font-semibold text-green-900">
            <Icon name="check" className="mt-1 h-6 w-6 shrink-0 text-green-700" />{t(page.data.body, lang)}
          </p>
        )}
      </section>
      <NewsletterBand locale={lang} source="membership" title={d.joinCta} />
    </>
  );
}
