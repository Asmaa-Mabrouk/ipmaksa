import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import { ExamCards, JoinBand, PageHero } from "@/components/Sections";
import { getExams, getPage, getSettings } from "@/lib/content/api";
import { getDict, isLocale, t } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const p = isLocale(lang) ? await getPage("exam-dates") : null;
  return p && isLocale(lang) ? pageMeta({ lang, path: "/exam-dates", title: t(p.data.title, lang), description: t(p.data.intro, lang), image: p.data.image || undefined }) : {};
}

export default async function ExamDates({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const [page, exams, s] = await Promise.all([getPage("exam-dates"), getExams(), getSettings()]);
  const upcoming = exams.filter((e) => e.data.status !== "closed");
  const past = exams.filter((e) => e.data.status === "closed");
  return (
    <>
      <PageHero title={page ? t(page.data.title, lang) : d.nav.examDates} intro={page ? t(page.data.intro, lang) : undefined} image={page?.data.image || undefined} />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <ExamCards exams={upcoming} locale={lang} email={s.email} whatsapp={s.whatsapp} />
        {page && t(page.data.body, lang) && (
          <p className="mt-8 rounded-2xl bg-green-50 p-5 font-semibold text-green-900">
            {t(page.data.body, lang)} <a className="underline" href={`mailto:${s.email}`} dir="ltr">{s.email}</a>
            {s.phone && <> · <a className="underline" href={`tel:${s.phone.replace(/[^\d+]/g, "")}`} dir="ltr">{s.phone}</a></>}
          </p>
        )}
        {past.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-5 text-2xl font-extrabold text-green-900">{d.exams.past}</h2>
            <ExamCards exams={past} locale={lang} email={s.email} whatsapp={s.whatsapp} />
          </section>
        )}
      </div>
      <JoinBand locale={lang} />
    </>
  );
}
