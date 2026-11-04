/** Pulls the downloadable application files out of a level page's markdown ("Application templates and forms"). */
export type LevelForm = { label: string; url: string };

export function levelForms(markdown: string): LevelForm[] {
  const lines = markdown.split("\n");
  const out: LevelForm[] = [];
  let inSection = false;
  for (const line of lines) {
    if (/^##\s/.test(line)) inSection = /Application templates|نماذج وقوالب التقديم/.test(line);
    else if (inSection) {
      const m = line.match(/^\s*-\s*\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/);
      if (m) out.push({ label: m[1], url: m[2] });
    }
  }
  return out;
}

export type FinderAnswers = {
  role: "project" | "programme" | "portfolio" | "assisting" | "none" | "";
  complexity: "moderate" | "complex" | "veryComplex" | "";
  years: "lt3" | "y3" | "y5" | "";
  leadership: "yes" | "no" | "";
};

export const needsComplexity = (a: FinderAnswers) => a.role === "project" || a.role === "programme" || a.role === "portfolio";
export const needsYears = (a: FinderAnswers) => (needsComplexity(a) ? a.complexity !== "" : a.role === "assisting");
export const needsLeadership = (a: FinderAnswers) => needsComplexity(a) && (a.complexity === "complex" || a.complexity === "veryComplex") && a.years === "y5";

/** Indicative level from the eligibility criteria in the Candidate Handbook. The Certification Body decides at application. */
export function recommend(a: FinderAnswers): { level: "A" | "B" | "C" | "D"; otherDomainNote: boolean } | null {
  if (a.role === "") return null;
  if (a.role === "none") return { level: "D", otherDomainNote: false };
  if (a.role === "assisting") return a.years === "" ? null : { level: a.years === "lt3" ? "D" : "C", otherDomainNote: false };
  if (a.complexity === "" || a.years === "") return null;
  const senior = a.years === "y5" && a.leadership === "yes";
  if (a.years === "y5" && (a.complexity === "complex" || a.complexity === "veryComplex") && a.leadership === "") return null;
  if (a.complexity === "veryComplex" && senior) return { level: "A", otherDomainNote: false };
  if ((a.complexity === "complex" || a.complexity === "veryComplex") && senior) return { level: "B", otherDomainNote: false };
  if (a.years !== "lt3") return { level: "C", otherDomainNote: a.role !== "project" };
  return { level: "D", otherDomainNote: false };
}
