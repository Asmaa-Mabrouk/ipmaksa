import { LevelFinder } from "./LevelFinder";
import { getPage, getSettings } from "@/lib/content/api";
import { getDict, t } from "@/lib/i18n";
import type { Locale } from "@/lib/content/types";
import { levelForms } from "@/lib/levels";

/** "Find your level": loads the level pages (for their forms) and the certification email. Used on Membership and Profile. */
export async function LevelFinderSection({ lang }: { lang: Locale }) {
  const d = getDict(lang);
  const [s, a, b, c, dd] = await Promise.all([getSettings(), getPage("ipma-level-a"), getPage("ipma-level-b"), getPage("ipma-level-c"), getPage("ipma-level-d")]);
  const info = (id: string, p: typeof a) => ({ title: p ? t(p.data.title, lang) : id, href: `/${lang}/${id}`, forms: p ? levelForms(t(p.data.body, lang)) : [] });
  const levels = { A: info("ipma-level-a", a), B: info("ipma-level-b", b), C: info("ipma-level-c", c), D: info("ipma-level-d", dd) };
  return <LevelFinder d={d.finder} levels={levels} email={s.certEmail || "ca@ipmaksa.world"} />;
}
