import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { emptyDoc, getCollection } from "@/lib/content/schema";
import { getStore } from "@/lib/content/store";
import { Editor } from "./Editor";

export const dynamic = "force-dynamic";

export default async function EditDoc({ params }: { params: Promise<{ collection: string; id: string }> }) {
  if (!(await getSession())) redirect("/admin/login");
  const { collection, id } = await params;
  const def = getCollection(collection);
  if (!def) notFound();
  const isNew = id === "new" && !!def.canCreate;
  const row = isNew ? null : await getStore().get(collection, id);
  if (!isNew && !row) notFound();
  // Fill any fields added to the schema after this document was saved.
  const initial = { ...emptyDoc(def.fields), ...(row?.data ?? {}) };
  return (
    <div className="max-w-4xl">
      {!def.single && <Link href={`/admin/c/${collection}`} className="text-sm font-bold text-green-700">← {def.label}</Link>}
      <h1 className="mt-2 text-3xl font-extrabold text-green-900">{def.single ? def.label : isNew ? `New: ${def.label}` : `Edit: ${def.label}`}</h1>
      <Editor def={def} id={isNew ? "" : id} isNew={isNew} initial={initial} />
    </div>
  );
}
