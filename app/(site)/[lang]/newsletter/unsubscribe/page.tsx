import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unsubscribe } from "@/app/(site)/actions";
import { getDict, isLocale } from "@/lib/i18n";

export const metadata: Metadata = { robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Unsub({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ id?: string; token?: string; confirm?: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { id = "", token = "", confirm } = await searchParams;
  const d = getDict(lang).unsubscribe;
  const done = confirm === "1" ? await unsubscribe(id, token) : null;
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-extrabold text-green-900">{d.title}</h1>
      {done === null ? (
        <>
          <p className="mt-4 text-lg">{d.text}</p>
          <form method="get" className="mt-6">
            <input type="hidden" name="id" value={id} /><input type="hidden" name="token" value={token} /><input type="hidden" name="confirm" value="1" />
            <button className="btn btn-green">{d.confirm}</button>
          </form>
        </>
      ) : (
        <p className="mt-4 text-lg">{done ? d.done : d.invalid}</p>
      )}
    </div>
  );
}
