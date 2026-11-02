import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { COLLECTIONS } from "@/lib/content/schema";
import { getStore } from "@/lib/content/store";
import type { MessageDoc } from "@/lib/content/types";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  if (!(await getSession())) redirect("/admin/login");
  const store = getStore();
  const [subs, msgs, members] = await Promise.all([store.list("subscribers"), store.list("messages"), store.list("members")]);
  const unread = msgs.filter((m) => !(m.data as unknown as MessageDoc).read).length;
  const card = "rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition hover:shadow-md";
  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-extrabold text-green-900">Dashboard</h1>
      {store.kind === "file" && (
        <p className="mt-4 rounded-xl bg-gold-100 p-4 text-sm font-semibold text-green-900">
          Local mode: changes are saved to files on this machine. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to store content in the database on your live site.
        </p>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/subscribers" className={card}><p className="text-4xl font-extrabold text-green-700">{subs.length}</p><p className="font-semibold">Newsletter subscribers</p></Link>
        <Link href="/admin/members" className={card}><p className="text-4xl font-extrabold text-green-700">{members.length}</p><p className="font-semibold">Registered members</p></Link>
        <Link href="/admin/messages" className={card}><p className="text-4xl font-extrabold text-green-700">{unread}</p><p className="font-semibold">Unread messages</p></Link>
      </div>
      <h2 className="mt-10 text-xl font-extrabold text-green-900">Edit content</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTIONS.map((c) => (
          <Link key={c.id} href={`/admin/c/${c.id}`} className={card}>
            <p className="text-lg font-extrabold text-green-900">{c.label}</p>
            <p className="mt-1 text-sm text-ink/70">{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
