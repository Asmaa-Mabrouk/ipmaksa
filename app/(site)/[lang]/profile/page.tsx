import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ProfileForm } from "@/components/AuthForms";
import { AvatarUpload } from "@/components/AvatarUpload";
import { Icon } from "@/components/Icon";
import { LevelFinderSection } from "@/components/LevelFinderSection";
import { fmtDate } from "@/components/Sections";
import { countryList } from "@/lib/countries";
import { getStore } from "@/lib/content/store";
import type { BadgeDoc } from "@/lib/content/types";
import { getDict, isLocale, t } from "@/lib/i18n";
import { getMember } from "@/lib/members";
import { logoutMember, saveLevelState } from "../../member-actions";
import { cleanState } from "@/lib/levels";

export const metadata: Metadata = { robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Profile({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { lang } = await params;
  const { tab: tabParam } = await searchParams;
  const tab = tabParam === "info" || tabParam === "level" ? tabParam : "badges";
  if (!isLocale(lang)) notFound();
  const m = await getMember();
  if (!m) redirect(`/${lang}/login`);
  const d = getDict(lang).account;
  const defs = (await getStore().list("badges")).map((r) => ({ id: r.id, ...(r.data as unknown as BadgeDoc) }));
  const earned = m.data.badges
    .map((b) => ({ b, def: defs.find((x) => x.id === b.id) }))
    .filter((x): x is { b: typeof x.b; def: NonNullable<typeof x.def> } => !!x.def);
  const countries = countryList(lang);
  const countryName = countries.find((c) => c.code === m.data.country)?.name ?? "";
  const name = `${m.data.firstName} ${m.data.lastName}`;
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <section className="flex flex-col items-start gap-5 rounded-3xl bg-green-900 p-6 text-white shadow-lg sm:flex-row sm:items-center sm:gap-6 sm:p-8">
        <AvatarUpload photo={m.data.photo} initial={m.data.firstName.charAt(0)} name={name} label={d.changePhoto} errorText={d.errors.photo} />
        <div className="w-full min-w-0 sm:flex-1">
          <h1 className="text-2xl font-extrabold sm:text-3xl">{name}</h1>
          <p className="mt-1 break-all text-white/80" dir="ltr">{m.data.email}</p>
          <p className="mt-1 text-sm text-white/80 sm:text-base">{countryName} · {d.memberSince} {fmtDate(m.data.createdAt.slice(0, 10), lang)}</p>
        </div>
        <form action={logoutMember.bind(null, lang)}><button className="btn btn-outline text-white">{d.signOut}</button></form>
      </section>

      <nav aria-label={d.tabsLabel} className="mt-8 border-b border-green-900/10">
        <ul className="flex gap-1 overflow-x-auto">
          {([["badges", d.badges], ["info", d.tabInfo], ["level", d.tabLevel]] as const).map(([id, label]) => (
            <li key={id}>
              <Link href={`/${lang}/profile?tab=${id}`} aria-current={id === tab ? "page" : undefined} className={"block whitespace-nowrap border-b-4 px-5 py-3.5 font-bold transition " + (id === tab ? "border-gold-500 text-green-900" : "border-transparent text-green-800/70 hover:text-green-900")}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8">
        {tab === "badges" && (
      <section>
        <h2 className="sr-only">{d.badges}</h2>
        {earned.length ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {earned.map(({ b, def }) => (
              <li key={b.id} className="flex items-start gap-4 rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                <span className={"relative flex shrink-0 items-center justify-center " + (def.image ? "h-24 w-24" : "h-20 w-20 overflow-hidden rounded-full bg-gold-100 text-gold-600 ring-2 ring-gold-500")}>
                  {def.image ? <Image src={def.image} alt="" fill sizes="96px" className="object-contain drop-shadow-md" /> : <Icon name={def.icon} className="h-10 w-10" />}
                </span>
                <div>
                  <h3 className="text-lg font-extrabold leading-snug text-green-900">{t(def.title, lang)}</h3>
                  <p className="mt-1 text-sm leading-6 text-ink/75">{t(def.description, lang)}</p>
                  {b.awardedAt && <p className="mt-2 text-xs font-semibold text-gold-600">{d.awarded}: {fmtDate(b.awardedAt.slice(0, 10), lang)}</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl bg-white p-8 text-center text-ink/70 shadow-sm">{d.noBadges}</p>
        )}
      </section>

        )}
        {tab === "info" && (
          <section className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="mb-5 text-xl font-extrabold text-green-900">{d.edit}</h2>
            <ProfileForm d={d} countries={countries} first={m.data.firstName} last={m.data.lastName} country={m.data.country} />
          </section>
        )}
        {tab === "level" && (
          <LevelFinderSection lang={lang} initial={cleanState(m.data.levelState)} onSave={saveLevelState} person={{ name, email: m.data.email, country: countryName }} />
        )}
      </div>
    </div>
  );
}
