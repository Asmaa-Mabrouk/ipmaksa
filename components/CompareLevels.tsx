import Link from "next/link";
import type { Locale } from "@/lib/content/types";
import { SectionTitle } from "@/components/Sections";

type L = { en: string; ar: string };
const LEVELS = [
  { id: "A", slug: "ipma-level-a", title: { en: "Certified Projects Director", ar: "مدير مشاريع معتمد" },
    who: { en: "Strategic leaders of very complex projects, programmes or portfolios", ar: "قادة استراتيجيون لمشاريع أو برامج أو محافظ شديدة التعقيد" },
    exp: { en: "5 years as project manager of complex projects, 3 of them at strategic level, within the last 12 years", ar: "5 سنوات مدير مشاريع معقدة، منها 3 على المستوى الاستراتيجي، خلال آخر 12 سنة" },
    report: { en: "Yes", ar: "نعم" }, exam: { en: "No", ar: "لا" }, interview: { en: "120 min", ar: "120 دقيقة" } },
  { id: "B", slug: "ipma-level-b", title: { en: "Certified Senior Project Manager", ar: "مدير مشاريع أول معتمد" },
    who: { en: "Managers of complex projects, programmes or portfolios", ar: "مديرو مشاريع أو برامج أو محافظ معقدة" },
    exp: { en: "5 years as project manager, 3 of them in a responsible position on complex projects, within the last 8 years", ar: "5 سنوات مدير مشاريع، منها 3 في موقع مسؤولية على مشاريع معقدة، خلال آخر 8 سنوات" },
    report: { en: "Yes", ar: "نعم" }, exam: { en: "Yes", ar: "نعم" }, interview: { en: "90 min", ar: "90 دقيقة" } },
  { id: "C", slug: "ipma-level-c", title: { en: "Certified Project Manager", ar: "مدير مشاريع معتمد" },
    who: { en: "Project managers at moderate complexity, or assistants on complex projects", ar: "مديرو مشاريع متوسطة التعقيد، أو مساعدون في مشاريع معقدة" },
    exp: { en: "3 years managing moderately complex projects, or assisting on complex ones, within the last 6 years", ar: "3 سنوات في إدارة مشاريع متوسطة التعقيد أو المساعدة في مشاريع معقدة، خلال آخر 6 سنوات" },
    report: { en: "No", ar: "لا" }, exam: { en: "Yes, 3 hours", ar: "نعم، 3 ساعات" }, interview: { en: "90 min", ar: "90 دقيقة" } },
  { id: "D", slug: "ipma-level-d", title: { en: "Certified Project Management Associate", ar: "مساعد إدارة مشاريع معتمد" },
    who: { en: "Newcomers and team members with project management knowledge", ar: "المبتدئون وأعضاء فرق المشاريع ممن لديهم معرفة بإدارة المشاريع" },
    exp: { en: "No experience required", ar: "لا تُشترط خبرة" },
    report: { en: "No", ar: "لا" }, exam: { en: "Yes, 3 hours", ar: "نعم، 3 ساعات" }, interview: { en: "No", ar: "لا" } },
] as const;

export function CompareLevels({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const x = (v: L) => (ar ? v.ar : v.en);
  const rows: { label: L; get: (l: (typeof LEVELS)[number]) => L }[] = [
    { label: { en: "Suited to", ar: "مناسبة لـ" }, get: (l) => l.who },
    { label: { en: "Experience required", ar: "الخبرة المطلوبة" }, get: (l) => l.exp },
    { label: { en: "Project report", ar: "تقرير مشروع" }, get: (l) => l.report },
    { label: { en: "Written exam", ar: "الاختبار التحريري" }, get: (l) => l.exam },
    { label: { en: "Interview", ar: "المقابلة" }, get: (l) => l.interview },
    { label: { en: "Valid for", ar: "مدة الصلاحية" }, get: () => ({ en: "5 years", ar: "5 سنوات" }) },
  ];
  const title = ar ? "قارن بين الشهادات" : "Compare the certifications";
  const intro = ar ? "ملخص سريع للمستويات الأربعة لتعرف أيها يناسب خبرتك. القرار النهائي تتخذه جهة منح الشهادات عند مراجعة طلبك." : "A quick summary of the four levels to see which fits your experience. The Certification Body makes the final decision when it reviews your application.";
  const finder = ar ? "لا تعرف مستواك؟ جرّب «اكتشف مستواك»" : "Not sure? Try “Find your level”";
  const more = ar ? "تفاصيل المستوى" : "Level details";
  return (
    <section id="compare" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
      <SectionTitle title={title} intro={intro} />

      <div className="mt-8 hidden overflow-hidden rounded-2xl border border-green-900/15 bg-white shadow-sm lg:block">
        <table className="w-full table-fixed border-collapse text-start">
          <thead>
            <tr className="bg-green-900 text-white">
              <th className="w-44 p-4 text-start" />
              {LEVELS.map((l) => (
                <th key={l.id} scope="col" className="border-s border-white/10 p-4 text-start align-top">
                  <span className="block text-2xl font-extrabold text-gold-300">{ar ? `المستوى ${l.id}` : `Level ${l.id}`}</span>
                  <span className="mt-1 block text-sm font-bold leading-snug">{x(l.title)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.label.en} className={i % 2 ? "bg-green-50/50" : ""}>
                <th scope="row" className="p-4 text-start align-top text-sm font-extrabold text-green-900">{x(r.label)}</th>
                {LEVELS.map((l) => (
                  <td key={l.id} className="border-s border-green-900/10 p-4 align-top text-sm leading-6 text-ink/85">{x(r.get(l))}</td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row" className="p-4" />
              {LEVELS.map((l) => (
                <td key={l.id} className="border-s border-green-900/10 p-4">
                  <Link href={`/${locale}/${l.slug}`} className="text-sm font-bold text-green-700 underline-offset-4 hover:underline">{more}</Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:hidden">
        {LEVELS.map((l) => (
          <li key={l.id} className="overflow-hidden rounded-2xl border border-green-900/15 bg-white shadow-sm">
            <div className="bg-green-900 p-4 text-white">
              <span className="block text-2xl font-extrabold text-gold-300">{ar ? `المستوى ${l.id}` : `Level ${l.id}`}</span>
              <span className="text-sm font-bold">{x(l.title)}</span>
            </div>
            <dl className="divide-y divide-green-900/10 text-sm">
              {rows.map((r) => (
                <div key={r.label.en} className="p-3">
                  <dt className="font-extrabold text-green-900">{x(r.label)}</dt>
                  <dd className="mt-0.5 leading-6 text-ink/85">{x(r.get(l))}</dd>
                </div>
              ))}
            </dl>
            <div className="border-t-4 border-gold-500 p-3"><Link href={`/${locale}/${l.slug}`} className="text-sm font-bold text-green-700">{more}</Link></div>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center"><Link href={`/${locale}/membership#find-your-level`} className="btn btn-gold">{finder}</Link></p>
    </section>
  );
}
