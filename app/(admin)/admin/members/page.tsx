import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getStore } from "@/lib/content/store";
import type { BadgeDoc, MemberDoc } from "@/lib/content/types";

export const dynamic = "force-dynamic";

export default async function Members() {
  if (!(await getSession())) redirect("/admin/login");
  const store = getStore();
  const [rows, badges] = await Promise.all([store.list("members"), store.list("badges")]);
  const name = (id: string) => (badges.find((b) => b.id === id)?.data as unknown as BadgeDoc | undefined)?.title.en ?? id;
  const members = rows.map((r) => ({ id: r.id, ...(r.data as unknown as MemberDoc) })).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-extrabold text-green-900">Members <span className="text-ink/50">({members.length})</span></h1>
      <p className="mt-2 text-ink/70">People who created an account on the website. Open a member to award or remove badges.</p>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-green-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-green-50"><tr><th className="p-3 text-start">Name</th><th className="p-3 text-start">Email</th><th className="p-3 text-start">Country</th><th className="p-3 text-start">Joined</th><th className="p-3 text-start">Badges</th><th /></tr></thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t border-green-100">
                <td className="p-3 font-bold">{m.firstName} {m.lastName}</td>
                <td className="p-3" dir="ltr">{m.email}</td><td className="p-3">{m.country}</td><td className="p-3" dir="ltr">{m.createdAt.slice(0, 10)}</td>
                <td className="p-3">{m.badges.length ? m.badges.map((b) => <span key={b.id} className="me-1 inline-block rounded-full bg-gold-100 px-2 py-0.5 text-xs font-bold text-gold-600">{name(b.id)}</span>) : <span className="text-ink/40">none</span>}</td>
                <td className="p-3"><Link href={`/admin/members/${m.id}`} className="font-bold text-green-700">Manage →</Link></td>
              </tr>
            ))}
            {!members.length && <tr><td colSpan={6} className="p-6 text-ink/60">No members yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
