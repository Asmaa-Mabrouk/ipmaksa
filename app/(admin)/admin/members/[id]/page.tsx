import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getStore } from "@/lib/content/store";
import type { BadgeDoc, MemberDoc } from "@/lib/content/types";
import { deleteMember } from "../../actions";
import { BadgePicker } from "./BadgePicker";

export const dynamic = "force-dynamic";

export default async function Member({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) redirect("/admin/login");
  const { id } = await params;
  const store = getStore();
  const row = await store.get("members", id);
  if (!row) notFound();
  const m = row.data as unknown as MemberDoc;
  const badges = (await store.list("badges")).map((b) => ({ id: b.id, title: (b.data as unknown as BadgeDoc).title.en || b.id })).sort((a, b) => a.title.localeCompare(b.title));
  return (
    <div className="max-w-3xl">
      <Link href="/admin/members" className="text-sm font-bold text-green-700">← Members</Link>
      <h1 className="mt-2 text-3xl font-extrabold text-green-900">{m.firstName} {m.lastName}</h1>
      <p className="mt-1 text-ink/70" dir="ltr">{m.email} · {m.country} · joined {m.createdAt.slice(0, 10)}</p>
      <h2 className="mt-8 text-xl font-extrabold text-green-900">Badges</h2>
      <p className="text-sm text-ink/70">Tick a badge to award it. Add badge types in the Badges section.</p>
      <BadgePicker id={id} badges={badges} awarded={m.badges} />
      <form action={deleteMember.bind(null, id)} className="mt-10"><button className="font-bold text-red-700">Delete this member account</button></form>
    </div>
  );
}
