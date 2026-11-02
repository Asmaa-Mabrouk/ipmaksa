import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LoginForm } from "@/components/AuthForms";
import { PageHero } from "@/components/Sections";
import { getDict, isLocale } from "@/lib/i18n";
import { getMember } from "@/lib/members";

export const metadata: Metadata = { robots: { index: false } };

export default async function Login({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  if (await getMember()) redirect(`/${lang}/profile`);
  const d = getDict(lang).account;
  return (
    <>
      <PageHero title={d.loginTitle} image="/images/diriyah-dusk.webp" />
      <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
        <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm sm:p-8"><LoginForm locale={lang} d={d} /></div>
      </div>
    </>
  );
}
