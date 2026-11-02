import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCollection } from "@/lib/content/schema";
import { getStore } from "@/lib/content/store";

export const dynamic = "force-dynamic";

export default async function CollectionList({ params }: { params: Promise<{ collection: string }> }) {
  if (!(await getSession())) redirect("/admin/login");
  const { collection } = await params;
  const def = getCollection(collection);
  if (!def) notFound();
  if (def.single) redirect(`/admin/c/${collection}/${def.single}`);
  const rows = await getStore().list(collection);
  const title = (d: Record<string, unknown>) => {
    const v = d[def.titleKey ?? "title"];
    return typeof v === "object" && v ? ((v as { en?: string; ar?: string }).en || (v as { ar?: string }).ar || "") : String(v ?? "");
  };
  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-green-900">{def.label}</h1>
        {def.canCreate && <Link href={`/admin/c/${collection}/new`} className="btn btn-green">+ Add new</Link>}
      </div>
      <p className="mt-2 text-ink/70">{def.description}</p>
      <ul className="mt-6 divide-y divide-green-100 overflow-hidden rounded-2xl border border-green-100 bg-white">
        {rows.map((r) => (
          <li key={r.id}>
            <Link href={`/admin/c/${collection}/${r.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-green-50">
              <span className="min-w-0"><span className="block truncate font-bold text-green-900">{title(r.data) || r.id}</span><span className="block truncate text-xs text-ink/50" dir="ltr">{r.id}</span></span>
              <span className="text-sm font-bold text-green-700">Edit →</span>
            </Link>
          </li>
        ))}
        {!rows.length && <li className="p-6 text-ink/60">Nothing here yet.</li>}
      </ul>
    </div>
  );
}
