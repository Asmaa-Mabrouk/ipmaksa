/** Pulls the downloadable application files out of a level page's markdown ("Application templates and forms"). */
export type LevelForm = { label: string; url: string };

export function levelForms(markdown: string): LevelForm[] {
  const out: LevelForm[] = [];
  let inSection = false;
  for (const line of markdown.split("\n")) {
    if (/^##\s/.test(line)) inSection = /Application templates|نماذج وقوالب التقديم/.test(line);
    else if (inSection) {
      const m = line.match(/^\s*-\s*\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/);
      if (m) out.push({ label: m[1], url: m[2] });
    }
  }
  return out;
}

/* ---------- "Find your level": an assessor-style calculator over CV entries ---------- */

export type Role = "project" | "programme" | "portfolio" | "assisting";
export type Complexity = "moderate" | "complex" | "veryComplex";
export type Entry = {
  role: Role;
  complexity: Complexity; // ignored for "assisting"
  strategic: boolean; // only meaningful for very complex work
  from: string; // YYYY-MM
  to: string; // YYYY-MM, "" = present
  label: string;
};
export type FinderState = { entries: Entry[]; noExperience: boolean };
export const EMPTY_STATE: FinderState = { entries: [], noExperience: false };

export const ROLES: Role[] = ["project", "programme", "portfolio", "assisting"];
export const COMPLEXITIES: Complexity[] = ["moderate", "complex", "veryComplex"];
export const newEntry = (): Entry => ({ role: "project", complexity: "complex", strategic: false, from: "", to: "", label: "" });

/** Keeps only well-formed data (used on the server before saving, and when reading it back). */
export function cleanState(v: unknown): FinderState {
  const o = (v && typeof v === "object" ? v : {}) as { entries?: unknown; noExperience?: unknown };
  const ym = (s: unknown) => (typeof s === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(s) ? s : "");
  const entries = (Array.isArray(o.entries) ? o.entries : []).slice(0, 40).map((e: Record<string, unknown>) => ({
    role: ROLES.includes(e?.role as Role) ? (e.role as Role) : "project",
    complexity: COMPLEXITIES.includes(e?.complexity as Complexity) ? (e.complexity as Complexity) : "complex",
    strategic: e?.strategic === true,
    from: ym(e?.from),
    to: ym(e?.to),
    label: typeof e?.label === "string" ? e.label.replace(/[\u0000-\u001f]/g, " ").slice(0, 80) : "",
  }));
  return { entries, noExperience: o.noExperience === true };
}

const monthIndex = (ym: string) => Number(ym.slice(0, 4)) * 12 + Number(ym.slice(5, 7)) - 1;

/** Months covered by the entries that match `pick`, inside the last `years` years. Overlapping entries count once. */
export function monthsIn(entries: Entry[], pick: (e: Entry) => boolean, years: number, now: Date): number {
  const end = now.getFullYear() * 12 + now.getMonth() + 1; // exclusive: counts the current month
  const start = end - years * 12;
  const spans = entries
    .filter((e) => e.from && pick(e))
    .map((e) => [Math.max(monthIndex(e.from), start), Math.min((e.to ? monthIndex(e.to) : end - 1) + 1, end)] as [number, number])
    .filter(([a, b]) => b > a)
    .sort((x, y) => x[0] - y[0]);
  let total = 0;
  let cur: [number, number] | null = null;
  for (const s of spans) {
    if (!cur || s[0] > cur[1]) {
      if (cur) total += cur[1] - cur[0];
      cur = [s[0], s[1]];
    } else cur[1] = Math.max(cur[1], s[1]);
  }
  if (cur) total += cur[1] - cur[0];
  return total;
}

export type CheckId =
  | "pA1" | "pA2" | "pB1" | "pB2" | "pC1" | "pC2"
  | "gA1" | "gA2" | "gA3" | "gB1" | "gB2"
  | "fA1" | "fA2" | "fA3" | "fB1" | "fB2";
export type Check = { id: CheckId; have: number; need: number; window: number };
export type Option = { domain: "project" | "programme" | "portfolio"; level: "A" | "B" | "C"; ok: boolean; alternatives: Check[][] };

const yrs = (m: number) => Math.round((m / 12) * 10) / 10;

/** Eligibility per level and domain, from the Candidate Handbook (ICR Tables 4 and 5). Experience must fall inside each level's window. */
export function evaluate(entries: Entry[], now = new Date()): Option[] {
  const vc = (e: Entry) => e.role !== "assisting" && e.complexity === "veryComplex";
  const vcS = (e: Entry) => vc(e) && e.strategic;
  const cxUp = (e: Entry) => e.role !== "assisting" && (e.complexity === "complex" || e.complexity === "veryComplex");
  const is = (r: Role) => (e: Entry) => e.role === r;
  const both = (a: (e: Entry) => boolean, b: (e: Entry) => boolean) => (e: Entry) => a(e) && b(e);
  const either = (a: (e: Entry) => boolean, b: (e: Entry) => boolean) => (e: Entry) => a(e) || b(e);
  const c = (id: CheckId, pick: (e: Entry) => boolean, window: number, need: number): Check => ({ id, window, need, have: yrs(monthsIn(entries, pick, window, now)) });
  const pass = (alts: Check[][]) => alts.some((a) => a.every((k) => k.have + 1e-9 >= k.need));
  const opt = (domain: Option["domain"], level: Option["level"], alternatives: Check[][]): Option => ({ domain, level, alternatives, ok: pass(alternatives) });
  return [
    opt("project", "A", [[c("pA1", both(is("project"), vc), 12, 5), c("pA2", both(is("project"), vcS), 12, 3)]]),
    opt("project", "B", [[c("pB1", either(is("project"), is("assisting")), 8, 5), c("pB2", both(is("project"), cxUp), 8, 3)]]),
    opt("project", "C", [[c("pC1", is("project"), 6, 3)], [c("pC2", is("assisting"), 6, 3)]]),
    opt("programme", "A", [[c("gA1", both(is("programme"), vcS), 12, 5)], [c("gA2", both(is("programme"), vcS), 12, 4), c("gA3", both(is("project"), vcS), 12, 3)]]),
    opt("programme", "B", [[c("gB1", is("programme"), 8, 5), c("gB2", both(is("programme"), cxUp), 8, 3)]]),
    opt("portfolio", "A", [[c("fA1", both(is("portfolio"), vcS), 12, 5)], [c("fA2", both(is("portfolio"), vcS), 12, 4), c("fA3", both(either(is("project"), is("programme")), vcS), 12, 3)]]),
    opt("portfolio", "B", [[c("fB1", is("portfolio"), 8, 5), c("fB2", both(is("portfolio"), cxUp), 8, 3)]]),
  ];
}

/** The highest eligible level (A > B > C), or D when nothing else fits. */
export function suggest(options: Option[]): { level: "A" | "B" | "C" | "D"; eligible: Option[] } {
  const eligible = options.filter((o) => o.ok).sort((a, b) => a.level.localeCompare(b.level));
  return { level: eligible[0]?.level ?? "D", eligible };
}
