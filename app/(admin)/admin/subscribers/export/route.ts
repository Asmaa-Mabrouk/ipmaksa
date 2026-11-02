import { getSession } from "@/lib/auth";
import { getStore } from "@/lib/content/store";
import type { SubscriberDoc } from "@/lib/content/types";

export const dynamic = "force-dynamic";

// Prefix risky leading characters so spreadsheet apps never run a cell as a formula.
const cell = (v: string) => `"${(/^[=+\-@\t\r]/.test(v) ? "'" + v : v).replace(/"/g, '""')}"`;

export async function GET() {
  if (!(await getSession())) return new Response("Unauthorized", { status: 401 });
  const rows = (await getStore().list("subscribers")).map((r) => r.data as unknown as SubscriberDoc).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const csv = ["email,name,language,source,joined", ...rows.map((r) => [r.email, r.name, r.lang, r.source, r.createdAt].map(cell).join(","))].join("\r\n");
  return new Response("﻿" + csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="ipma-ksa-subscribers.csv"', "Cache-Control": "no-store" } });
}
