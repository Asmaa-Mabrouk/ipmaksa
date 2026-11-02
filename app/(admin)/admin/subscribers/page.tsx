import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getStore } from "@/lib/content/store";
import type { SubscriberDoc } from "@/lib/content/types";
import { removeSubscriber } from "../actions";

export const dynamic = "force-dynamic";

export default async function Subscribers() {
  if (!(await getSession())) redirect("/admin/login");
  const rows = (await getStore().list("subscribers"))
    .map((r) => ({ id: r.id, ...(r.data as unknown as SubscriberDoc) }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-green-900">Newsletter subscribers <span className="text-ink/50">({rows.length})</span></h1>
        <Link href="/admin/subscribers/export" prefetch={false} className="btn btn-green">Download CSV</Link>
      </div>
      <p className="mt-2 text-ink/70">Import the CSV into your email provider (for example Mailchimp, Brevo or Stibee) to send newsletters.</p>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-green-100 bg-white">
        <table className="w-full text-start text-sm">
          <thead className="bg-green-50 text-start"><tr><th className="p-3 text-start">Email</th><th className="p-3 text-start">Name</th><th className="p-3 text-start">Language</th><th className="p-3 text-start">Source</th><th className="p-3 text-start">Joined</th><th /></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-green-100">
                <td className="p-3 font-semibold" dir="ltr">{r.email}</td><td className="p-3">{r.name}</td><td className="p-3 uppercase">{r.lang}</td><td className="p-3">{r.source}</td>
                <td className="p-3" dir="ltr">{r.createdAt.slice(0, 10)}</td>
                <td className="p-3"><form action={removeSubscriber.bind(null, r.id)}><button className="font-bold text-red-700">Remove</button></form></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={6} className="p-6 text-ink/60">No subscribers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
