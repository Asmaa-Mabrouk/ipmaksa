import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { ProfileForm } from "@/components/AuthForms";
import { Icon } from "@/components/Icon";
import { fmtDate } from "@/components/Sections";
import { countryList } from "@/lib/countries";
import { getStore } from "@/lib/content/store";
import type { BadgeDoc } from "@/lib/content/types";
import { getDict, isLocale, t } from "@/lib/i18n";
import { getMember } from "@/lib/members";
import { logoutMember } from "../../member-actions";

export const metadata: Metadata = { robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Profile({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
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
      <section className="flex flex-wrap items-center gap-6 rounded-3xl bg-green-900 p-6 text-white shadow-lg sm:p-8">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-green-700 ring-4 ring-gold-500 sm:h-28 sm:w-28">
          {m.data.photo ? <Image src={m.data.photo} alt={name} fill sizes="112px" className="object-cover" /> : <span className="flex h-full items-center justify-center text-4xl font-extrabold text-gold-300">{m.data.firstName.charAt(0)}</span>}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-extrabold">{name}</h1>
          <p className="mt-1 break-all text-white/80" dir="ltr">{m.data.email}</p>
          <p className="mt-1 text-white/80">{countryName} · {d.memberSince} {fmtDate(m.data.createdAt.slice(0, 10), lang)}</p>
        </div>
        <form action={logoutMember.bind(null, lang)}><button className="btn btn-outline text-white">{d.signOut}</button></form>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold text-green-900">{d.badges}</h2>
        {earned.length ? (
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {earned.map(({ b, def }) => (
              <li key={b.id} className="flex items-start gap-4 rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                <span className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gold-100 text-gold-600 ring-2 ring-gold-500">
                  {def.image ? <Image src={def.image} alt="" fill sizes="80px" className="object-contain p-1" /> : <Icon name={def.icon} className="h-10 w-10" />}
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
          <p className="mt-5 rounded-2xl bg-white p-8 text-center text-ink/70 shadow-sm">{d.noBadges}</p>
        )}
      </section>

      <details className="mt-10 rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
        <summary className="cursor-pointer text-lg font-extrabold text-green-900">{d.edit}</summary>
        <div className="mt-5"><ProfileForm d={d} countries={countries} first={m.data.firstName} last={m.data.lastName} country={m.data.country} /></div>
      </details>
    </div>
  );
}
