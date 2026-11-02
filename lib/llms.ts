import { getExams, getJourney, getNews, getPages, getSettings } from "@/lib/content/api";
import { t } from "@/lib/i18n";
import { SITE } from "@/lib/seo";

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

/** Plain-text summary for AI assistants (llmstxt.org format). Built from live site content so it never goes stale. */
export async function buildLlms(full: boolean) {
  const [s, pages, news, exams, j] = await Promise.all([getSettings(), getPages(), getNews(), getExams(), getJourney()]);
  const out: string[] = [];
  out.push("# IPMA KSA (IPMA السعودية)");
  out.push("");
  out.push("> IPMA KSA is the official national member of the International Project Management Association (IPMA) in the Kingdom of Saudi Arabia. It administers IPMA project management competence certification (Levels A, B, C and D, based on the IPMA Individual Competence Baseline ICB4), publishes exam dates, and runs the Project Connect community events (ملتقى المشاريع). The site is bilingual: Arabic (default) and English.");
  out.push("");
  out.push("## Key facts");
  out.push("- Organisation: IPMA KSA, Saudi Arabia (Dhahran). Part of the global IPMA network (https://ipma.world).");
  out.push(`- Contact: ${s.email}${s.phone ? `, ${s.phone}` : ""}${s.whatsapp ? ` (WhatsApp +${s.whatsapp})` : ""}`);
  out.push("- Certification: IPMA four-level system (D Certified Project Management Associate, C Certified Project Manager, B Certified Senior Project Manager, A Certified Projects Director). Taking a training course is not mandatory; candidates prepare by studying ICB4.");
  out.push(`- Languages: Arabic ${SITE}/ar, English ${SITE}/en`);
  out.push("");
  out.push("## Main pages");
  const main: [string, string, string][] = [
    ["Home", "/", "Overview of IPMA KSA, certification, exams and community."],
    ["How certification works", "/certification-journey", "The certification cycle, how to prepare with ICB4, and frequently asked questions."],
    ["Exam dates", "/exam-dates", "Upcoming and past IPMA exam sessions in Saudi Arabia, with registration contacts."],
    ["Project Connect (ملتقى المشاريع)", "/project-connect", "Webinars, workshops and meetups for project professionals."],
    ["Membership", "/membership", "Membership benefits and how to create an account."],
    ["News", "/news", "Announcements and updates."],
    ["Team", "/team", "The people behind IPMA KSA."],
    ["Contact", "/contact", "Contact form, email and phone."],
  ];
  for (const [n, p, d] of main) out.push(`- [${n}](${SITE}/en${p === "/" ? "" : p}): ${d} Arabic: ${SITE}/ar${p === "/" ? "" : p}`);
  const extra = pages.filter((p) => !main.some(([, mp]) => mp === `/${p.id}`) && !["home"].includes(p.id));
  if (extra.length) {
    out.push("");
    out.push("## Other pages");
    for (const p of extra) out.push(`- [${t(p.data.title, "en") || t(p.data.title, "ar")}](${SITE}/en/${p.id}): ${clean(t(p.data.intro, "en") || t(p.data.intro, "ar"))}`);
  }
  if (news.length) {
    out.push("");
    out.push("## Latest news");
    for (const n of news.slice(0, 10)) out.push(`- [${t(n.data.title, "en") || t(n.data.title, "ar")}](${SITE}/en/news/${n.id})${n.data.date ? ` (${n.data.date})` : ""}: ${clean(t(n.data.excerpt, "en") || t(n.data.excerpt, "ar"))}`);
  }
  if (full) {
    out.push("");
    out.push("## Exam sessions");
    for (const e of exams) out.push(`- ${t(e.data.title, "en") || t(e.data.title, "ar")}: ${e.data.date || t(e.data.dateText, "en") || "date to be announced"}, ${t(e.data.location, "en") || "Saudi Arabia"}. Status: ${e.data.status}.`);
    out.push("");
    out.push(`## ${t(j.faqTitle, "en") || "Frequently asked questions"}`);
    for (const f of j.faqs) {
      out.push("");
      out.push(`### ${t(f.q, "en") || t(f.q, "ar")}`);
      out.push(clean(t(f.a, "en") || t(f.a, "ar")));
    }
  }
  out.push("");
  return out.join("\n");
}
