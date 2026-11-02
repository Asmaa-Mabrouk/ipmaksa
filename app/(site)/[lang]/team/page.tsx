import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import { JoinBand, PageHero, TeamCard } from "@/components/Sections";
import { getPage, getTeam } from "@/lib/content/api";
import { getDict, isLocale, t } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const p = isLocale(lang) ? await getPage("team") : null;
  return p && isLocale(lang) ? pageMeta({ lang, path: "/team", title: t(p.data.title, lang), description: t(p.data.intro, lang), image: p.data.image || undefined }) : {};
}

export default async function TeamPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const [page, team] = await Promise.all([getPage("team"), getTeam()]);
  const groups = [
    { id: "ma", title: d.team.ma, note: d.team.maNote },
    { id: "cb", title: d.team.cb, note: d.team.cbNote },
  ];
  return (
    <>
      <PageHero title={page ? t(page.data.title, lang) : d.nav.team} intro={page ? t(page.data.intro, lang) : undefined} image={page?.data.image || undefined} />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {groups.map((g) => {
          const people = team.filter((p) => p.data.group === g.id);
          if (!people.length) return null;
          return (
            <section key={g.id} className="mb-14">
              <h2 className="text-2xl font-extrabold text-green-900">{g.title}</h2>
              <p className="mt-1 text-ink/70">{g.note}</p>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {people.map((p) => <TeamCard key={p.id} person={p} locale={lang} />)}
              </ul>
            </section>
          );
        })}
        {page && t(page.data.body, lang) && <p className="rounded-2xl bg-green-50 p-5 font-semibold text-green-900">{t(page.data.body, lang)}</p>}
      </div>
      <JoinBand locale={lang} />
    </>
  );
}
