import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "../../globals.css";
import { getSession } from "@/lib/auth";
import { COLLECTIONS } from "@/lib/content/schema";
import { logoutAction } from "./actions";

export const metadata: Metadata = { title: "IPMA KSA Admin", robots: { index: false, follow: false }, icons: { icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon.png", type: "image/png" }] } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen bg-sand">
        {session ? (
          <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
            <aside className="bg-green-900 p-4 text-white lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
              <Link href="/admin"><Image src="/images/logo-white.png" alt="IPMA KSA" width={1378} height={321} className="h-10 w-auto" /></Link>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gold-300">Content admin</p>
              <nav className="mt-5 flex flex-wrap gap-1 lg:grid" aria-label="Admin">
                <Link href="/admin" className="rounded-lg px-3 py-2 font-semibold hover:bg-white/10">Dashboard</Link>
                {COLLECTIONS.map((c) => (
                  <Link key={c.id} href={`/admin/c/${c.id}`} className="rounded-lg px-3 py-2 font-semibold hover:bg-white/10">{c.label}</Link>
                ))}
                <Link href="/admin/subscribers" className="rounded-lg px-3 py-2 font-semibold hover:bg-white/10">Newsletter subscribers</Link>
                <Link href="/admin/messages" className="rounded-lg px-3 py-2 font-semibold hover:bg-white/10">Messages</Link>
              </nav>
              <div className="mt-6 border-t border-white/15 pt-4 text-sm">
                <p className="break-all text-white/70">{session}</p>
                <form action={logoutAction}><button className="mt-2 font-bold text-gold-300 hover:underline">Sign out</button></form>
              </div>
            </aside>
            <main className="min-w-0 p-4 sm:p-8">{children}</main>
          </div>
        ) : (
          <main>{children}</main>
        )}
      </body>
    </html>
  );
}
