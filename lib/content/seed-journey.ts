import type { JourneyDoc } from "./types";

const l = (ar: string, en: string) => ({ ar, en });

export const JOURNEY: JourneyDoc = {
  cycleTitle: l("رحلتك من التقديم إلى الشهادة", "From application to certificate"),
  cycleIntro: l("من يفعل ماذا في كل مرحلة", "Who does what at each stage"),
  stages: [
    { title: l("1 التواصل", "1 Contact") },
    { title: l("2 استلام الطلب", "2 Application received") },
    { title: l("3 المراجعة والأهلية", "3 Review and eligibility") },
    { title: l("4 التقييم", "4 Assessment") },
    { title: l("5 التقييم والقرار", "5 Evaluation and decision") },
    { title: l("6 الشهادة", "6 Certificate") },
  ],
  roles: [
    {
      name: l("مسؤول الشهادات", "Certification Administrator"),
      subtitle: l("التواصل اليومي مع المتقدمين", "Daily contact with applicants"),
      steps: [
        { text: l("يستلم البريد ويرسل النماذج", "Receive email, send the forms") },
        { text: l("يسجّل التاريخ ويتأكد من اكتمال المستندات", "Log the date, check all documents are in") },
        { text: l("يتابع المستندات الناقصة", "Chase missing items") },
        { text: l("يحدّد الجولات ويدعم منصة الاختبار", "Schedule rounds, support the exam platform") },
        { text: l("يسجّل النتائج ويبلغ المتقدم", "Record results, inform the candidate") },
        { text: l("يرسل الشهادة ويحفظ السجلات", "Send certificate, keep records") },
      ],
    },
    {
      name: l("مدير الشهادات", "Certification Manager"),
      subtitle: l("يراجع ويقرر", "Checks and decides"),
      steps: [
        { text: l("", "") },
        { text: l("يتحقق من النموذج والمستوى والمجال والتوقيع", "Check form, level, domain, signature") },
        { text: l("يفحص الملفات والتعقيد والأشهر ثم يقرر الأهلية", "Check files, complexity, months, then decide eligibility") },
        { text: l("", "") },
        { text: l("يتخذ قرار منح الشهادة", "Takes the certification decision") },
        { text: l("", "") },
      ],
    },
    {
      name: l("المقيّمون", "Assessors"),
      subtitle: l("يقيّمون الكفاءة", "Evaluate competence"),
      steps: [
        { text: l("", "") },
        { text: l("", "") },
        { text: l("يقدّمون المشورة عند عدم وضوح التعقيد أو الدور", "Advise when complexity or role is unclear") },
        { text: l("يصحّحون ما يخص مستواك (التقرير والاختبار)، ومقيّمان اثنان في كل مقابلة", "Mark what your level requires (report, exam). Two at every interview") },
        { text: l("التقييم النهائي للأدلة", "Final evaluation of the evidence") },
        { text: l("", "") },
      ],
    },
  ],
  noteStrong: l("تنتهي المسارات A وB وC بمقابلة، دائماً مع مقيّمين اثنين. أما المستوى D فلا مقابلة فيه.", "Levels A, B and C end with an interview, always with two assessors. Level D has no interview."),
  noteText: l("18 شهراً كحد أقصى من التقديم حتى منح الشهادة.", "18 months maximum from application to certificate award."),
  prepareTitle: l("كيف أستعد؟", "How to prepare"),
  prepareIntro: l(
    "للاستعداد، ادرس خط الأساس للكفاءات الفردية (ICB4)، وهو المعيار الذي تقوم عليه شهادة IPMA.",
    "To prepare, please study the IPMA Individual Competence Baseline (ICB4), the standard on which IPMA certification is based.",
  ),
  icbTitle: l("كيف تحصل عليه", "How to get it"),
  icbText: l("يمكنك تنزيل ICB4 من بوابة MyIPMA.", "The ICB4 is available to download from the MyIPMA portal."),
  icbButton: l("افتح بوابة MyIPMA", "Open the MyIPMA portal"),
  icbUrl: "https://myipma.ipma.world",
  structureTitle: l("ماذا يغطي ICB4", "What the ICB4 covers"),
  structureText: l(
    "ICB4 كتاب واحد يغطي ثلاثة مجالات، ولكل مجال عناصر كفاءة في ثلاثة محاور.",
    "The ICB4 is a single book covering three domains. Each domain has competence elements in three areas.",
  ),
  domainsLabel: l("المجالات", "Domains"),
  domains: [
    { name: l("المشاريع", "Project") },
    { name: l("البرامج", "Programme") },
    { name: l("المحافظ", "Portfolio") },
  ],
  areasLabel: l("المحاور", "Areas"),
  areas: [
    { name: l("المنظور", "Perspective") },
    { name: l("الأشخاص", "People") },
    { name: l("الممارسة", "Practice") },
  ],
  levelsTitle: l("ماذا تدرس حسب المستوى", "What to study, by level"),
  levels: [
    {
      badge: "D",
      label: l("المستوى D", "Level D"),
      text: l("عناصر كفاءة إدارة المشاريع، مع التركيز على المعرفة.", "The project management competence elements, with a focus on knowledge."),
    },
    {
      badge: "C",
      label: l("المستوى C", "Level C"),
      text: l("عناصر كفاءة إدارة المشاريع، مع التركيز على تطبيقها في مشاريعك.", "The project management competence elements, with a focus on applying them in your own projects."),
    },
    {
      badge: "B · A",
      label: l("المستويان B و A", "Levels B and A"),
      text: l(
        "جميع عناصر الكفاءة للمجال الذي تتقدم إليه (مشاريع أو برامج أو محافظ)، مطبّقة في بيئات معقدة (المستوى B) أو شديدة التعقيد (المستوى A).",
        "All competence elements for the domain you are applying for (project, programme or portfolio), applied to complex (Level B) or very complex (Level A) settings.",
      ),
    },
  ],
  guideNote: l(
    "يضم نموذج التقييم الذاتي في حزمة الطلب عناصر الكفاءة نفسها، لذلك يصلح أيضاً دليلاً للدراسة.",
    "The Self-Assessment Form in your application pack lists the same competence elements, so it is also a useful study guide.",
  ),
  freeNote: l("إتمام أي دورة تدريبية ليس إلزامياً للحصول على شهادة IPMA.", "Completing any training course is not mandatory for IPMA certification."),
  faqTitle: l("الأسئلة الأكثر شيوعاً", "Frequently asked questions"),
  faqIntro: l("إجابات سريعة قبل أن تتقدم", "Quick answers before you apply"),
  faqs: [
    {
      q: l("كم تستغرق رحلة الحصول على الشهادة؟", "How long does certification take?"),
      a: l("بحد أقصى 18 شهراً من تقديم الطلب حتى منح الشهادة.", "A maximum of 18 months from application to the award of the certificate."),
    },
    {
      q: l("هل الدورة التدريبية إلزامية؟", "Is a training course mandatory?"),
      a: l("لا. إتمام أي دورة تدريبية ليس إلزامياً للحصول على شهادة IPMA.", "No. Completing any training course is not mandatory for IPMA certification."),
    },
    {
      q: l("ماذا أدرس للاستعداد؟ ومن أين أحصل على ICB4؟", "What should I study, and where do I get the ICB4?"),
      a: l(
        "ادرس خط الأساس للكفاءات الفردية (ICB4) وهو متاح للتنزيل من بوابة MyIPMA: myipma.ipma.world. وتجد في نموذج التقييم الذاتي عناصر الكفاءة نفسها.",
        "Study the IPMA Individual Competence Baseline (ICB4), available to download from the MyIPMA portal: myipma.ipma.world. The Self-Assessment Form lists the same competence elements.",
      ),
    },
    {
      q: l("أي مستوى يناسبني؟", "Which level is right for me?"),
      a: l(
        "المستوى D يركز على المعرفة. المستوى C على تطبيق الكفاءات في مشاريعك. المستوى B للبيئات المعقدة والمستوى A للبيئات شديدة التعقيد. راجع صفحات المستويات في قائمة الشهادات لمعرفة شروط كل مستوى.",
        "Level D focuses on knowledge. Level C on applying the competences in your own projects. Level B is for complex settings and Level A for very complex ones. See the level pages in the Certification menu for each level's requirements.",
      ),
    },
    {
      q: l("كيف أبدأ التقديم؟", "How do I start my application?"),
      a: l(
        "راسلنا عبر البريد الإلكتروني وسيرسل لك مسؤول الشهادات النماذج المطلوبة. بعد ذلك يتم تسجيل طلبك والتحقق من اكتمال المستندات.",
        "Email us and the Certification Administrator will send you the forms. Your application is then logged and its documents checked for completeness.",
      ),
    },
    {
      q: l("من يقيّمني وكيف تجري المقابلة؟", "Who assesses me, and how does the interview work?"),
      a: l(
        "يقيّم المقيّمون ما يخص مستواك: A مقابلة موسّعة فقط، B تقرير واختبار ومقابلة، C اختبار كتابي ومقابلة، D اختبار كتابي فقط. وتكون المقابلة دائماً مع مقيّمين اثنين. ويتخذ مدير الشهادات قرار منح الشهادة.",
        "Assessors assess what your level requires: A is an extended interview only, B is report, exam and interview, C is a written exam and interview, D is a written exam only. Interviews are always with two assessors. The Certification Manager takes the certification decision.",
      ),
    },
    {
      q: l("أين أجد مواعيد الاختبارات والرسوم؟", "Where do I find exam dates and fees?"),
      a: l(
        "تجد المواعيد القادمة في صفحة «مواعيد الاختبارات»، وتجد الرسوم في صفحة كل مستوى وفي صفحة «إعادة الاعتماد والرسوم».",
        "Upcoming dates are on the Exam dates page. Fees are on each level's page and on the Recertification and fees page.",
      ),
    },
  ],
};
