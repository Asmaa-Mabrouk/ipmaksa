import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { ContactCards, PageHero } from "@/components/Sections";
import { getPage, getSettings } from "@/lib/content/api";
import { getDict, isLocale, t } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const p = isLocale(lang) ? await getPage("contact") : null;
  return p && isLocale(lang) ? { title: t(p.data.title, lang), description: t(p.data.intro, lang) } : {};
}

export default async function Contact({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const [page, s] = await Promise.all([getPage("contact"), getSettings()]);
  return (
    <>
      <PageHero title={page ? t(page.data.title, lang) : d.contact.title} intro={page ? t(page.data.intro, lang) : undefined} image={page?.data.image || undefined} />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <ContactCards s={s} locale={lang} />
        <div className="mt-12 max-w-3xl rounded-2xl border border-green-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-2xl font-extrabold text-green-900">{d.contact.title}</h2>
          <ContactForm locale={lang} d={d.contact} />
        </div>
        {t(s.hours, lang) && <p className="mt-6 text-ink/70">{d.contact.hours}: {t(s.hours, lang)}</p>}
      </div>
    </>
  );
}
