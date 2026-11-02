import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResetForm } from "@/components/AuthForms";
import { PageHero } from "@/components/Sections";
import { getDict, isLocale } from "@/lib/i18n";
import { readResetToken } from "@/lib/reset";

export const metadata: Metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" };
export const dynamic = "force-dynamic";

export default async function Reset({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ token?: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const token = String((await searchParams).token ?? "");
  const valid = token ? !!(await readResetToken(token)) : false;
  const d = getDict(lang).account;
  return (
    <>
      <PageHero title={d.resetTitle} image="/images/diriyah-dusk.webp" />
      <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
        <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm sm:p-8">
          {valid ? (
            <ResetForm locale={lang} d={d} token={token} />
          ) : (
            <div className="grid gap-4">
              <p role="alert" className="rounded-xl bg-red-50 p-4 font-semibold text-red-700">{d.errors.token}</p>
              <Link href={`/${lang}/forgot-password`} className="btn btn-green justify-self-start">{d.sendLink}</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
