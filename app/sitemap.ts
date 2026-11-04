import type { MetadataRoute } from "next";
import { getArticles, getNews, getPages } from "@/lib/content/api";
import { LOCALES } from "@/lib/i18n";
import { NOINDEX, SITE } from "@/lib/seo";

const PRIORITY: Record<string, number> = { "": 1, "/certification-journey": 0.9, "/exam-dates": 0.9, "/project-connect": 0.8, "/membership": 0.7, "/news": 0.6, "/team": 0.5, "/contact": 0.5 };
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (NOINDEX) return [];
  const [pages, news, articles] = await Promise.all([getPages(), getNews(), getArticles()]);
  const base = ["", "/team", "/membership", "/exam-dates", "/project-connect", "/project-connect/magazine", "/project-connect/magazine/articles", "/project-connect/magazine/guidelines", "/certification-journey", "/news", "/contact", ...pages.filter((p) => p.data.group !== "magazine").map((p) => `/${p.id}`)];
  const items = [
    ...base.map((p) => ({ p, lastModified: undefined as string | undefined, changeFrequency: (p === "" || p === "/exam-dates" || p === "/project-connect" ? "weekly" : "monthly") as "weekly" | "monthly", priority: PRIORITY[p] ?? 0.6 })),
    ...articles.map((a) => ({ p: `/project-connect/magazine/articles/${a.id}`, lastModified: a.data.date || undefined, changeFrequency: "yearly" as const, priority: 0.5 })),
    ...news.map((n) => ({ p: `/news/${n.id}`, lastModified: n.data.date || undefined, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
  const seen = new Set<string>();
  return items
    .filter((i) => !seen.has(i.p) && seen.add(i.p))
    .flatMap((i) =>
      LOCALES.map((l) => ({
        url: `${SITE}/${l}${i.p}`,
        ...(i.lastModified ? { lastModified: i.lastModified } : {}),
        changeFrequency: i.changeFrequency,
        priority: i.priority,
        alternates: { languages: { ar: `${SITE}/ar${i.p}`, en: `${SITE}/en${i.p}`, "x-default": `${SITE}/ar${i.p}` } },
      })),
    );
}
