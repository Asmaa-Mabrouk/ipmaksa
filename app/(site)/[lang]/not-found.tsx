import Link from "next/link";
import { getDict } from "@/lib/i18n";

export default function NotFound() {
  const d = getDict("ar");
  const e = getDict("en");
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-6xl font-extrabold text-gold-500">404</p>
      <h1 className="mt-4 text-3xl font-extrabold text-green-900">{d.notFound.title}</h1>
      <p className="mt-2 text-ink/70">{d.notFound.text}</p>
      <p className="mt-6 text-ink/70" dir="ltr">{e.notFound.title}</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/ar" className="btn btn-green">{d.notFound.back}</Link>
        <Link href="/en" className="btn btn-outline text-green-800">{e.notFound.back}</Link>
      </div>
    </div>
  );
}
