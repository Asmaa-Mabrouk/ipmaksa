import "server-only";
import { cache } from "react";
import { getStore } from "./store";
import { SEED } from "./seed";
import { JOURNEY } from "./seed-journey";
import type { JourneyDoc,
  BenefitDoc, Doc, ExamDoc, HomeDoc, NewsDoc, PageDoc, ProjectEventDoc, SiteSettings, TeamDoc,
} from "./types";

async function all<T>(collection: string): Promise<Doc<T>[]> {
  const rows = await getStore().list(collection);
  return rows.map((r) => ({ id: r.id, data: r.data as T }));
}

export const getJourney = cache(async () => ({ ...JOURNEY, ...((await getStore().get("journey", "main"))?.data as Partial<JourneyDoc>) }) as JourneyDoc);
export const getHome = cache(async () => (await getStore().get("home", "main"))?.data as HomeDoc);
/** Stored settings, with the official social links as fallback when a field has never been filled in. */
export const getSettings = cache(async () => {
  const seed = SEED.settings.site as unknown as SiteSettings;
  const stored = ((await getStore().get("settings", "site"))?.data ?? {}) as Partial<SiteSettings>;
  const out = { ...seed, ...stored } as SiteSettings;
  for (const k of ["linkedin", "x", "instagram", "whatsappChannel"] as const) if (!out[k]) out[k] = seed[k];
  return out;
});

export const getPages = cache(async () => (await all<PageDoc>("pages")).filter((p) => p.data.published));
export const getPage = cache(async (slug: string) => {
  const p = (await getStore().get("pages", slug)) as Doc<PageDoc> | null;
  return p && p.data.published ? p : null;
});

export const getTeam = cache(async () =>
  (await all<TeamDoc>("team")).sort((a, b) => a.data.order - b.data.order),
);
export const getBenefits = cache(async () =>
  (await all<BenefitDoc>("benefits")).sort((a, b) => a.data.order - b.data.order),
);

/** Dated, upcoming exams first (soonest first), then undated ones by order. Closed ones last. */
export const getExams = cache(async () => {
  const list = await all<ExamDoc>("exams");
  const rank = (e: Doc<ExamDoc>) => (e.data.status === "closed" ? 2 : e.data.date ? 0 : 1);
  return list.sort(
    (a, b) =>
      rank(a) - rank(b) ||
      (a.data.date || "9999").localeCompare(b.data.date || "9999") ||
      a.data.order - b.data.order,
  );
});

export const getNews = cache(async () =>
  (await all<NewsDoc>("news"))
    .filter((n) => n.data.published)
    .sort((a, b) => b.data.date.localeCompare(a.data.date)),
);
export const getNewsItem = cache(async (slug: string) => (await getNews()).find((n) => n.id === slug) ?? null);

export const getEvents = cache(async () =>
  (await all<ProjectEventDoc>("events")).sort((a, b) => a.data.date.localeCompare(b.data.date)),
);
