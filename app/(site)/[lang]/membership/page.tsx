import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { BenefitsGrid, JoinBand, PageHero, SectionTitle } from "@/components/Sections";
import { getBenefits, getPage, getSettings } from "@/lib/content/api";
import { LevelFinder } from "@/components/LevelFinder";
import { levelForms } from "@/lib/levels";
import { getDict, isLocale, t } from "@/lib/i18n";
import { Markdown } from "@/lib/markdown";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const p = isLocale(lang) ? await getPage("membership") : null;
  return p && isLocale(lang) ? pageMeta({ lang, path: "/membership", title: t(p.data.title, lang), description: t(p.data.intro, lang), image: p.data.image || undefined }) : {};
}

export default async function Membership({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const [page, benefits, s, la, lb, lc, ld] = await Promise.all([getPage("membership"), getBenefits(), getSettings(), getPage("ipma-level-a"), getPage("ipma-level-b"), getPage("ipma-level-c"), getPage("ipma-level-d")]);
  const info = (id: string, p: typeof la) => ({ title: p ? t(p.data.title, lang) : id, href: `/${lang}/${id}`, forms: p ? levelForms(t(p.data.body, lang)) : [] });
  const levels = { A: info("ipma-level-a", la), B: info("ipma-level-b", lb), C: info("ipma-level-c", lc), D: info("ipma-level-d", ld) };
  return (
    <>
      <PageHero title={page ? t(page.data.title, lang) : d.nav.membership} intro={page ? t(page.data.intro, lang) : undefined} image={page?.data.image || undefined} />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionTitle title={d.sections.benefits} intro={d.sections.benefitsIntro} />
        <div className="mt-8"><BenefitsGrid benefits={benefits} locale={lang} /></div>
        {page && t(page.data.body, lang) && (
          <div className="mt-10 max-w-3xl">
            <Markdown source={t(page.data.body, lang)} />
            <a href={s.myIpmaUrl || "https://myipma.ipma.world"} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-8">{lang === "ar" ? "انضم عبر MyIPMA" : "Join through MyIPMA"}</a>
          </div>
        )}
      </section>
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6"><LevelFinder d={d.finder} levels={levels} email={s.certEmail || "ca@ipmaksa.world"} /></section>
      <JoinBand locale={lang} title={d.joinCta} />
    </>
  );
}
