import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getStore } from "@/lib/content/store";
import type { MessageDoc } from "@/lib/content/types";
import { messageAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function Messages() {
  if (!(await getSession())) redirect("/admin/login");
  const rows = (await getStore().list("messages"))
    .map((r) => ({ id: r.id, ...(r.data as unknown as MessageDoc) }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-extrabold text-green-900">Messages</h1>
      <p className="mt-2 text-ink/70">Messages sent from the Contact page. Reply from your own email.</p>
      <ul className="mt-6 grid gap-4">
        {rows.map((m) => (
          <li key={m.id} className={"rounded-2xl border bg-white p-5 " + (m.read ? "border-green-100" : "border-gold-500")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-extrabold text-green-900">{m.name} <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject || "Your message to IPMA KSA"))}`} className="font-semibold text-green-700 underline" dir="ltr">{m.email}</a></p>
              <time className="text-sm text-ink/60" dir="ltr">{m.createdAt.slice(0, 16).replace("T", " ")}</time>
            </div>
            {m.subject && <p className="mt-1 font-bold">{m.subject}</p>}
            <p className="mt-2 whitespace-pre-wrap">{m.message}</p>
            <div className="mt-3 flex gap-4 text-sm font-bold">
              {!m.read && <form action={messageAction.bind(null, m.id, "read")}><button className="text-green-700">Mark as read</button></form>}
              <form action={messageAction.bind(null, m.id, "delete")}><button className="text-red-700">Delete</button></form>
            </div>
          </li>
        ))}
        {!rows.length && <li className="rounded-2xl bg-white p-6 text-ink/60">No messages yet.</li>}
      </ul>
    </div>
  );
}
