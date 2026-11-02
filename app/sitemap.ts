import type { MetadataRoute } from "next";
import { getNews, getPages } from "@/lib/content/api";
import { LOCALES } from "@/lib/i18n";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://ipmaksa.world";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, news] = await Promise.all([getPages(), getNews()]);
  const paths = ["", "/team", "/membership", "/exam-dates", "/project-connect", "/certification-journey", "/news", "/contact", ...pages.map((p) => `/${p.id}`), ...news.map((n) => `/news/${n.id}`)];
  return [...new Set(paths)].flatMap((p) =>
    LOCALES.map((l) => ({ url: `${SITE}/${l}${p}`, alternates: { languages: { ar: `${SITE}/ar${p}`, en: `${SITE}/en${p}` } } })),
  );
}
