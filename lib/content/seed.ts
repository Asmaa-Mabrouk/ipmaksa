import { CERT } from "./seed-certifications";
import { JOURNEY } from "./seed-journey";

/**
 * Starting content (Arabic + English), built from the IPMA KSA 2026 deck.
 * Served until an editor changes a collection in the admin portal.
 * English copy uses American spelling. IPMA KSA is a member association (never a "chapter").
 */
const l = (ar: string, en: string) => ({ ar, en });

const home = {
  heroEyebrow: l("المملكة العربية السعودية • جمعية عضو في IPMA", "Saudi Arabia • IPMA Member Association"),
  heroTitle: l("مركز عالمي لتنفيذ المشاريع", "A global center for project delivery"),
  heroText: l(
    "من البرامج العالمية الكبرى إلى القدرات المهنية الوطنية: نبني كفاءة إدارة المشاريع في المملكة وفق المعايير الدولية.",
    "From world-scale programs to national professional capability: building project management competence in the Kingdom to global standards.",
  ),
  heroImage: "/images/hero-village.webp",
  stats: [
    { value: 70, suffix: "+", label: l("دولة في اتحاد IPMA", "Countries in the IPMA federation") },
    { value: 200, suffix: "+", label: l("عضو منذ إطلاق العضوية في سبتمبر 2025", "Members since membership opened in September 2025") },
    { value: 4, suffix: "", label: l("برامج تعمل فعلياً في المملكة", "Programs already live in the Kingdom") },
    { value: 120, suffix: "", label: l("جنسية في المنتدى العالمي لإدارة المشاريع 2026", "Nationalities at GPMF 2026") },
  ],
  pillarsTitle: l("لماذا تحصل على شهادة IPMA؟", "Why get certified with IPMA?"),
  pillars: [
    {
      icon: "globe",
      title: l("معايير عالمية واعتراف دولي", "Global standards and recognition"),
      text: l(
        "شهادات مبنية على معايير IPMA المعتمدة دولياً، ومعترف بها لدى جهات التوظيف في أكثر من 70 دولة.",
        "Certifications built on internationally recognized IPMA standards, valued by employers in 70+ countries.",
      ),
    },
    {
      icon: "growth",
      title: l("تطوير مهني قائم على الكفاءة", "Competence-based professional growth"),
      text: l(
        "مسار واضح يقيس المعرفة والمهارات والسلوك المهني في كل مرحلة من مراحل مسيرتك.",
        "A clear path that assesses knowledge, skills and behavior at every stage of your career.",
      ),
    },
    {
      icon: "community",
      title: l("خبرة محلية ومجتمع مهني", "Local expertise and a professional community"),
      text: l(
        "مجتمع وطني من الممارسين والمؤسسات يدعم تطوير مهنة إدارة المشاريع في المملكة.",
        "A national community of practitioners and organizations advancing project management in the Kingdom.",
      ),
    },
  ],
  ambitionTitle: l("مشاريع بحجم العالم تحتاج كفاءات بمستوى عالمي", "World-scale programs need world-class project capability"),
  ambitionText: l(
    "من المدن والسياحة إلى النقل والطاقة والصناعات الجديدة، تتعدد جبهات التنفيذ في المملكة. ونحن نبني القدرات المهنية جنباً إلى جنب مع محفظة المشاريع.",
    "From cities and tourism to mobility, energy and new industries, delivery in the Kingdom spans many frontiers. We build professional capability alongside the project portfolio.",
  ),
  aboutTitle: l("بيت وطني وشبكة عالمية", "A national home, a global network"),
  aboutText: l(
    "IPMA السعودية هي المنصة الوطنية التي تمثل الجمعية الدولية لإدارة المشاريع (IPMA) في المملكة العربية السعودية.\n\nنوطّن النهج القائم على الكفاءة الذي تعتمده IPMA لدعم المهنيين والمؤسسات في بناء القدرات التي تتطلبها رؤية المملكة 2030. والجمعية وجهة منح الشهادات مستقلتان عن بعضهما، ولا يوجد للجمعية أي دور في قرارات منح الشهادات.",
    "IPMA KSA is the national platform representing the International Project Management Association (IPMA) in the Kingdom of Saudi Arabia.\n\nWe localize IPMA's competence-based approach to help professionals and organizations build the capability that Vision 2030 demands. The member association and the Certification Body are independent of each other, and the association has no role in certification decisions.",
  ),
  aboutImage: "/images/pma-launch.webp",
  liveTitle: l("ما هو متاح اليوم في المملكة", "What is live in Saudi Arabia today"),
  liveText: l(
    "قبل عام لم يكن أي من هذا موجوداً هنا. أربعة برامج تعمل اليوم، وثلاثة قيد الإعداد.",
    "A year ago none of this existed here. Four programs are live, and three are being set up.",
  ),
  live: [
    {
      title: l("IPMA 4-L-C", "IPMA 4-L-C"),
      text: l(
        "معتمد في ثلاثة مجالات وموافق عليه من المؤسسة العامة للتدريب التقني والمهني (TVTC)، وأُجريت جولتا اختبار في الربع الثالث من 2026.",
        "Validated in three domains and approved by TVTC, with two exam rounds held in Q3 2026.",
      ),
      status: "live",
    },
    {
      title: l("IPMA Delta", "IPMA Delta"),
      text: l(
        "التقييم المؤسسي، نُفّذ لصالح أرامكو السعودية (2025) و WTCO (2026).",
        "Organizational assessment, delivered for Saudi Aramco (2025) and WTCO (2026).",
      ),
      status: "live",
    },
    {
      title: l("العضوية", "Membership"),
      text: l(
        "الجمعية العضو تعمل منذ سبتمبر 2025، ولدينا أكثر من 200 عضو.",
        "The member association has been running since September 2025, with 200+ members already.",
      ),
      status: "live",
    },
    {
      title: l("IPMA Young Crew", "IPMA Young Crew"),
      text: l(
        "تأسس في 2026، وأُقيم أول برنامج له في GPMF 2026.",
        "Set up in 2026, with its first program at GPMF 2026.",
      ),
      status: "live",
    },
    {
      title: l("أساسيات إدارة المشاريع", "PM Fundamentals"),
      text: l("دفعة تجريبية مخطط لها في ديسمبر 2026.", "Pilot cohort planned for December 2026."),
      status: "setting-up",
    },
    {
      title: l("IPMA CCT", "IPMA CCT"),
      text: l("أول المرشحين مخطط له في فبراير 2027.", "First candidates planned for February 2027."),
      status: "setting-up",
    },
    {
      title: l("IPMA REG", "IPMA REG"),
      text: l(
        "نعمل مع الجامعات ومعاهد TVTC، وأول مقدّمي البرامج في مارس 2027.",
        "Onboarding universities and TVTC institutes, with the first providers in March 2027.",
      ),
      status: "setting-up",
    },
    {
      title: l("IPMA Kids", "IPMA Kids"),
      text: l("قُدّم في جناح GPMF وساحته.", "Presented at our GPMF pavilion and arena."),
      status: "introduced",
    },
    {
      title: l("التميز في المشاريع", "Project Excellence"),
      text: l(
        "بعد أن يعمل IPMA 4-L-C و IPMA Delta على نطاق واسع.",
        "Once 4-L-C and Delta are running at scale.",
      ),
      status: "later",
    },
  ],
  gpmfTitle: l("IPMA السعودية في المنتدى العالمي لإدارة المشاريع 2026", "IPMA KSA at the Global Project Management Forum 2026"),
  gpmfText: l(
    "الرياض، 19–21 سبتمبر 2026. اختيرت IPMA السعودية شريكاً استراتيجياً للمنتدى، وحضره 21 ألف مسجل و209 متحدثين من 120 جنسية.",
    "Riyadh, September 19–21, 2026. IPMA KSA was the Strategic Partner of the forum, which welcomed 21,000 registrations and 209 speakers from 120 nationalities.",
  ),
  gpmfImage: "/images/gpmf-group.webp",
  joinTitle: l("انضم إلينا", "Join us"),
  joinText: l(
    "كن جزءاً من مجتمع المهنيين الذين يبنون مستقبل إدارة المشاريع في المملكة. أنشئ حساباً مجانياً لتحصل على ملفك الشخصي في IPMA السعودية وتشاهد الشارات التي مُنحت لك.",
    "Be part of the community building the future of project management in the Kingdom. Create a free account to get your IPMA KSA profile and see the badges awarded to you.",
  ),
  joinImage: "/images/red-sea.webp",
};

const settings = {
  email: "care@ipmaksa.world",
  certEmail: "ca@ipmaksa.world",
  myIpmaUrl: "https://myipma.ipma.world",
  phone: "+966 50 365 6644",
  whatsapp: "966503656644",
  address: l("الظهران، المملكة العربية السعودية", "Dhahran, Saudi Arabia"),
  hours: l("", ""),
  linkedin: "https://www.linkedin.com/company/ipma-ksa/",
  x: "https://x.com/IPMAKSA",
  instagram: "https://www.instagram.com/ipmaksa/",
  whatsappChannel: "https://whatsapp.com/channel/0029Vb8zjSO2kNFqeS4m4630",
  youtube: "",
};

type P = {
  title: ReturnType<typeof l>;
  intro: ReturnType<typeof l>;
  body: ReturnType<typeof l>;
  image: string;
  group: string;
  published: boolean;
  needsReview: boolean;
};
const page = (p: Partial<P> & Pick<P, "title" | "intro" | "body">): P => ({
  image: "",
  group: "other",
  published: true,
  needsReview: false,
  ...p,
});

const pages: Record<string, P> = {
  "about-us": page({
    group: "about",
    image: "/images/diriyah-dusk.webp",
    title: l("من نحن", "About us"),
    intro: l(
      "IPMA السعودية هي المنصة الوطنية الممثلة للجمعية الدولية لإدارة المشاريع (IPMA) في المملكة، وهي جمعية عضو معتمدة في الاتحاد الدولي.",
      "IPMA KSA is the national platform representing the International Project Management Association (IPMA) in the Kingdom, a verified member association of the international federation.",
    ),
    body: l(
      "## رسالتنا\nنوطّن النهج القائم على الكفاءة الذي تعتمده IPMA، لدعم المهنيين والمؤسسات في بناء القدرات التي تتطلبها رؤية المملكة 2030.\n\n## ما نقدمه\n- **العضوية** للأفراد والمؤسسات.\n- **مسارات الشهادات** وفق نظام IPMA 4-L-C، والتقييم المؤسسي IPMA Delta.\n- **IPMA Young Crew** لدعم المهنيين الشباب.\n- **المعرفة والمجتمع** عبر المنتدى العالمي لإدارة المشاريع (GPMF) والفعاليات المهنية.\n\n## الاستقلالية\nالجمعية وجهة منح الشهادات مستقلتان عن بعضهما. وليس للجمعية أي دور في قرارات منح الشهادات.",
      "## Our mission\nWe localize IPMA's competence-based approach to help professionals and organizations build the capability that Vision 2030 demands.\n\n## What we offer\n- **Membership** for individuals and organizations.\n- **Certification pathways** through IPMA 4-L-C, and organizational assessment through IPMA Delta.\n- **IPMA Young Crew** supporting young professionals.\n- **Knowledge and community** through the Global Project Management Forum (GPMF) and professional events.\n\n## Independence\nThe member association and the Certification Body are independent of each other. The association has no role in certification decisions.",
    ),
  }),
  "ipma-ksa-president": page({
    group: "about",
    needsReview: true,
    title: l("رئيس IPMA السعودية", "IPMA KSA President"),
    intro: l(
      "المهندس بدر برشيد، رئيس الجمعية العضو IPMA السعودية.",
      "Eng. Badr Burshaid, President of the IPMA KSA Member Association.",
    ),
    body: l(
      "## الدور\nيقود رئيس الجمعية العضوية وبرنامج Young Crew وبرامج الجمعية، ويمنح جهة منح الشهادات استقلالها الفني، ويتولى العلاقة مع IPMA.\n\nللتعرف على فريق العمل كاملاً، يمكنكم زيارة صفحة الفريق.",
      "## Role\nThe President leads membership, Young Crew and the association's programs, gives the Certification Body its technical independence, and holds the relationship with IPMA.\n\nTo meet the full team, visit the Team page.",
    ),
  }),
  "ipma-world-affiliation": page({
    group: "about",
    title: l("الانتساب إلى IPMA العالمية", "IPMA world affiliation"),
    intro: l(
      "IPMA اتحاد عالمي للجمعيات الأعضاء في أكثر من 70 دولة، وIPMA السعودية عضو فيه.",
      "IPMA is a global federation of member associations in 70+ countries, and IPMA KSA is one of them.",
    ),
    body: l(
      "## من الإطلاق إلى منظومة مستدامة\n- إطلاق جمعية إدارة المشاريع (PMA) والمنصة المهنية IPMA السعودية.\n- الانتساب إلى الجمعية الدولية لإدارة المشاريع (IPMA).\n- مسارات مهنية متوافقة مع المعايير العالمية.\n\n## شريك استراتيجي للمنتدى العالمي لإدارة المشاريع 2026\nأعلن المنتدى عن IPMA السعودية شريكاً استراتيجياً لعام 2026، وكُرّمت بجائزة الشريك الاستراتيجي خلال المنتدى.",
      "## From launch to a sustainable ecosystem\n- Launch of the Project Management Association (PMA) and the IPMA KSA professional platform.\n- Affiliation with the International Project Management Association (IPMA).\n- Professional pathways aligned with global standards.\n\n## Strategic Partner of GPMF 2026\nThe forum named IPMA KSA its Strategic Partner for 2026, and IPMA KSA received the Strategic Partner award at the forum.",
    ),
  }),
  "equality-non-discrimination-human-rights": page({
    group: "about",
    needsReview: true,
    title: l("المساواة وعدم التمييز وحقوق الإنسان", "Equality, non-discrimination and human rights"),
    intro: l(
      "نلتزم بتكافؤ الفرص والمعاملة العادلة لكل من يتعامل مع IPMA السعودية.",
      "We are committed to equal opportunity and fair treatment for everyone who engages with IPMA KSA.",
    ),
    body: l(
      "## التزامنا\nلا نميّز بين الأفراد على أساس الجنس أو الجنسية أو الدين أو الإعاقة أو العمر. ويُطبَّق هذا المبدأ على العضوية والتدريب والتقييم وجميع فعاليات الجمعية.\n\n## الشكاوى والتظلمات\nيمكن لأي شخص تقديم شكوى أو تظلم عبر قنوات التواصل الرسمية، وتنظر فيه لجنة الشكاوى والتظلمات بحيادية.",
      "## Our commitment\nWe do not discriminate on the basis of gender, nationality, religion, disability or age. This applies to membership, training, assessment and every association activity.\n\n## Complaints and appeals\nAnyone can raise a complaint or appeal through our official channels, and it is reviewed impartially by the Complaints and Appeals Committee.",
    ),
  }),
  "ipma-code-of-ethics": page({
    group: "about",
    needsReview: true,
    title: l("مدونة أخلاقيات IPMA", "IPMA code of ethics"),
    intro: l(
      "المبادئ الأخلاقية التي يلتزم بها أعضاء IPMA والمهنيون الحاصلون على شهاداتها.",
      "The ethical principles that IPMA members and certified professionals commit to.",
    ),
    body: l(
      "## مبادئ أساسية\n- النزاهة والمصداقية في الممارسة المهنية.\n- الحياد وتجنب تضارب المصالح.\n- احترام السرية وحماية المعلومات.\n- الالتزام بالتطوير المهني المستمر.\n\nيمكنكم الاطلاع على النص الكامل للمدونة من خلال IPMA العالمية.",
      "## Core principles\n- Integrity and credibility in professional practice.\n- Impartiality and avoiding conflicts of interest.\n- Respect for confidentiality and information protection.\n- A commitment to continuing professional development.\n\nThe full text of the code is available through IPMA global.",
    ),
  }),
  "head-of-certification-body": page({
    group: "certification",
    image: "/images/milestones.webp",
    title: l("رئيس جهة منح الشهادات", "Head of the Certification Body"),
    intro: l(
      "معالي الدكتور بدر بن عبدالله الدلامي، رئيس جهة منح الشهادات الوطنية.",
      "H.E. Dr. Badr Bin Abdullah Al-Dulami, Head of the national Certification Body.",
    ),
    body: l(
      "نائب وزير (الدور الحكومي وفق البروتوكول).\n\n## مسؤوليات قيادة الجهة\n- **المساءلة المؤسسية:** قائد معيّن لجهة الشهادات ومسؤولياتها في الحوكمة.\n- **الاستقلال المهني:** يبقى التقييم ومنح الشهادات قائمين على الأدلة وتحت سيطرة الجهة.\n- **الجودة والحياد:** كفاءة المقيّمين، وفحص تضارب المصالح، وقرارات موثقة.",
      "Deputy Minister (government role per protocol).\n\n## Leadership responsibilities\n- **Institutional accountability:** a designated leader for the Certification Body and its governance responsibilities.\n- **Professional independence:** assessment and certification remain evidence-based and controlled within the Certification Body.\n- **Quality and impartiality:** assessor competence, conflict checks and documented decisions.",
    ),
  }),
  "ipma-standards": page({
    group: "certification",
    title: l("معايير IPMA", "IPMA standards"),
    intro: l(
      "معايير IPMA هي الأساس الذي تقوم عليه الشهادات القائمة على الكفاءة.",
      "IPMA's standards are the foundation of competence-based certification.",
    ),
    body: l(
      "## المعايير\n- **ICB4:** قاعدة الكفاءة الفردية، وتغطي كفاءات الأشخاص والممارسة والمنظور.\n- **OCB:** قاعدة الكفاءة المؤسسية.\n- **PEB:** قاعدة التميز في المشاريع.\n\n## المنتجات\n- **IPMA 4-L-C:** نظام الشهادات الفردية بأربعة مستويات (A وB وC وD).\n- **IPMA Delta:** تقييم القدرة المؤسسية. وكانت أرامكو السعودية أول جهة تحصل على IPMA Delta في المملكة في مارس 2025، عن مشروع الزلف البحري.",
      "## The standards\n- **ICB4:** the Individual Competence Baseline, covering the People, Practice and Perspective competences.\n- **OCB:** the Organizational Competence Baseline.\n- **PEB:** the Project Excellence Baseline.\n\n## The products\n- **IPMA 4-L-C:** the four-level individual certification system (Levels A, B, C and D).\n- **IPMA Delta:** organizational capability assessment. Saudi Aramco received the first IPMA Delta in the Kingdom in March 2025, for the Zuluf Offshore Oil Project.",
    ),
  }),
  "ipma-level-a": page({
    group: "certification",
    title: l("المستوى A: مدير مشاريع معتمد (Projects Director)", "Level A: Certified Projects Director"),
    intro: l(
      "لمن يديرون محافظ أو برامج معقدة ذات أهمية استراتيجية.",
      "For leaders of complex portfolios or programs of strategic importance.",
    ),
    body: l(
      "## لمن هذا المستوى؟\nالمستوى A مخصص للقادة الذين يتولون إدارة محفظة مشاريع أو برنامج كبير ذي أهمية استراتيجية للمؤسسة.\n\n## كيف يتم التقييم؟\nيقوم التقييم على الأدلة وفق معيار ICB4، ويشمل مراجعة الخبرة والكفاءات ومقابلة مع المقيّمين.",
      "## Who is it for?\nLevel A is for leaders who direct a portfolio or a large program of strategic importance to their organization.\n\n## How is it assessed?\nAssessment is evidence-based against ICB4 and includes a review of experience and competences and an interview with assessors.",
    ),
  }),
  "ipma-level-b": page({
    group: "certification",
    title: l("المستوى B: مدير مشاريع أول معتمد (Senior Project Manager)", "Level B: Certified Senior Project Manager"),
    intro: l(
      "لمديري المشاريع والبرامج المعقدة.",
      "For managers of complex projects and programs.",
    ),
    body: l(
      "## لمن هذا المستوى؟\nالمستوى B لمديري المشاريع ذوي الخبرة الذين يقودون مشاريع معقدة أو برامج.\n\n## كيف يتم التقييم؟\nيقوم التقييم على الأدلة وفق معيار ICB4، ويشمل مراجعة الخبرة والكفاءات ومقابلة مع المقيّمين.",
      "## Who is it for?\nLevel B is for experienced project managers who lead complex projects or programs.\n\n## How is it assessed?\nAssessment is evidence-based against ICB4 and includes a review of experience and competences and an interview with assessors.",
    ),
  }),
  "ipma-level-c": page({
    group: "certification",
    title: l("المستوى C: مدير مشاريع معتمد (Project Manager)", "Level C: Certified Project Manager"),
    intro: l(
      "لمديري المشاريع ذات التعقيد المحدود.",
      "For managers of projects of limited complexity.",
    ),
    body: l(
      "## لمن هذا المستوى؟\nالمستوى C لمديري المشاريع الذين يقودون مشاريع ذات تعقيد محدود ويتحملون مسؤولية النتائج.\n\n## كيف يتم التقييم؟\nيشمل التقييم اختباراً وتقييماً للخبرة والكفاءات وفق معيار ICB4.",
      "## Who is it for?\nLevel C is for project managers who lead projects of limited complexity and are accountable for results.\n\n## How is it assessed?\nAssessment includes an exam and an evaluation of experience and competences against ICB4.",
    ),
  }),
  "ipma-level-d": page({
    group: "certification",
    title: l("المستوى D: مساعد إدارة مشاريع معتمد (Associate)", "Level D: Certified Project Management Associate"),
    intro: l(
      "لمن يطبقون معارف إدارة المشاريع ويبدأون مسيرتهم المهنية.",
      "For professionals who apply project management knowledge and are starting their careers.",
    ),
    body: l(
      "## لمن هذا المستوى؟\nالمستوى D لمن يمتلكون معرفة بإدارة المشاريع ويطبقونها كأعضاء في فرق المشاريع، وهو نقطة انطلاق ممتازة للمهنيين الشباب.\n\n## كيف يتم التقييم؟\nيعتمد التقييم على اختبار المعرفة بكفاءات ICB4.",
      "## Who is it for?\nLevel D is for people who have project management knowledge and apply it as members of project teams. It is an excellent starting point for young professionals.\n\n## How is it assessed?\nAssessment is based on an exam covering the ICB4 competences.",
    ),
  }),
  recertification: page({
    group: "certification",
    needsReview: true,
    title: l("إعادة الاعتماد", "Recertification"),
    intro: l(
      "الشهادات محددة المدة، وتُجدَّد عبر إعادة الاعتماد بناءً على التطوير المهني الموثق.",
      "Certificates are time-limited and renewed through recertification based on documented professional development.",
    ),
    body: l(
      "## كيف تجدد شهادتك؟\n1. وثّق أنشطة التطوير المهني المستمر خلال فترة الشهادة.\n2. قدّم طلب إعادة الاعتماد قبل انتهاء الصلاحية.\n3. تراجع جهة منح الشهادات الأدلة وتصدر القرار.\n\nللتفاصيل، راجع صفحة التطوير المهني المستمر أو تواصل معنا.",
      "## How to renew\n1. Document your continuing professional development during the certificate period.\n2. Submit your recertification application before your certificate expires.\n3. The Certification Body reviews the evidence and issues a decision.\n\nFor details, see the Continuing Professional Development page or contact us.",
    ),
  }),
  "continuing-professional-development": page({
    group: "certification",
    needsReview: true,
    title: l("التطوير المهني المستمر", "Continuing professional development"),
    intro: l(
      "سجّل أنشطتك التعليمية والمهنية لدعم إعادة اعتماد شهادتك.",
      "Record your learning and professional activities to support your recertification.",
    ),
    body: l(
      "## ما الذي يُحتسب؟\n- التدريب والدورات والورش.\n- حضور المؤتمرات والفعاليات مثل المنتدى العالمي لإدارة المشاريع.\n- التأليف والتدريس والإرشاد المهني.\n- الممارسة المهنية والتعلم من المشاريع.\n\nيلزم 35 ساعة على الأقل من التطوير المهني المستمر عن كل سنة منذ شهادتك السابقة. اطّلع على [دليل إعادة الاعتماد ونقاط التطوير المهني المستمر (PDF)](https://ipmaksa.world/wp-content/uploads/2026/04/IPMAKSA_Recertification-and-Continuing-Professional-Development-CPD-Points-Guide.pdf).",
      "## What counts?\n- Training, courses and workshops.\n- Attending conferences and events such as the Global Project Management Forum.\n- Writing, teaching and professional mentoring.\n- Professional practice and learning from projects.\n\nYou need at least 35 CPD hours for each year since your previous certification. Read the [recertification and CPD points guide (PDF)](https://ipmaksa.world/wp-content/uploads/2026/04/IPMAKSA_Recertification-and-Continuing-Professional-Development-CPD-Points-Guide.pdf).",
    ),
  }),
  "project-connect-magazine": page({
    group: "magazine",
    needsReview: true,
    image: "/images/diriyah-dusk.webp",
    title: l("ما هي مجلة ملتقى المشاريع؟", "What is Project Connect Magazine?"),
    intro: l(
      "مقالات عملية من مجتمع ملتقى المشاريع عن المشاريع والكفاءات والشهادات.",
      "Practical articles from the Project Connect community on projects, competences and certification.",
    ),
    body: l(
      'مجلة ملتقى المشاريع هي المنصة المكتوبة لملتقى المشاريع، مجتمع IPMA السعودية للمهنيين العاملين في إدارة المشاريع بالمملكة. تنشر مقالات عملية عن إدارة المشاريع والبرامج والمحافظ، وعن الكفاءات التي تقف خلف التنفيذ الجيد، وعن كيف يبني الأفراد والمؤسسات هذه الكفاءات.\n\n## ماذا ستجد فيها\n- **خبرة الممارسين:** مشاريع حقيقية، وما نجح وما لم ينجح، وما كان الكاتب سيفعله بشكل مختلف.\n- **الكفاءات والشهادات:** كيف يُطبَّق إطار IPMA للكفاءات ونظام الشهادات IPMA 4-L-C في العمل اليومي.\n- **أفكار من المجتمع:** مقالات تتابع حلقات ملتقى المشاريع والندوات، يكتبها المتحدثون والضيوف.\n- **التطوير المهني:** إرشادات في التعلّم والإرشاد المهني والحفاظ على كفاءتك محدَّثة.\n\n## لمن هي\nمديرو المشاريع والبرامج والمحافظ، وأعضاء الفرق، والمهنيون الحاصلون على الشهادات والمتقدمون لها، والمؤسسات التي يعملون بها.\n\n## اقرأ وشارك\nتصفّح [المقالات](/ar/project-connect/magazine/articles). وإذا كان لديك ما تشاركه، فاطّلع على [إرشادات المحتوى](/ar/project-connect/magazine/guidelines) و[تواصل معنا](/ar/contact) بفكرتك.',
      "Project Connect Magazine is the written home of Project Connect, IPMA KSA's community for project professionals in the Kingdom. It publishes practical articles on project, programme and portfolio management, on the competences behind good delivery, and on how people and organisations are building them.\n\n## What you will find\n- **Practitioner experience:** real projects, what worked, what did not, and what the author would do differently.\n- **Competences and certification:** how the IPMA competence framework and the IPMA 4-L-C certification system apply in everyday work.\n- **Ideas from the community:** follow-ups to Project Connect episodes and webinars, written by speakers and guests.\n- **Professional development:** guidance on learning, mentoring and keeping your competence current.\n\n## Who it is for\nProject, programme and portfolio managers, team members, certified professionals and candidates, and the organisations that employ them.\n\n## Read and contribute\nBrowse the [articles](/en/project-connect/magazine/articles). If you have something to share, read the [content guidelines](/en/project-connect/magazine/guidelines) and [contact us](/en/contact) with your idea.",
    ),
  }),
  "project-connect-magazine-guidelines": page({
    group: "magazine",
    needsReview: true,
    image: "/images/diriyah-dusk.webp",
    title: l("إرشادات المحتوى", "Content guidelines"),
    intro: l(
      "كل ما تحتاج معرفته قبل أن تكتب لمجلة ملتقى المشاريع.",
      "Everything you need to know before writing for Project Connect Magazine.",
    ),
    body: l(
      'تساعد هذه الإرشادات الكتّاب على الكتابة لمجلة ملتقى المشاريع، وتساعد محرّرينا على المراجعة بإنصاف واتساق.\n\n## الأعمدة\nينتمي كل مقال إلى عمود واحد:\n- **آراء ونقاشات:** موقف يُدافَع عنه بالأدلة.\n- **حوار:** محادثة أو مقابلة.\n- **حكايات مشاريع:** قصة مشروع تُروى بصدق.\n- **موضوع ساخن:** قضية راهنة في المهنة.\n- **بحث وأكاديميا:** نتائج ودراسات ومنظورات أكاديمية.\n- **الشباب المهنيون:** أصوات وأسئلة المهنيين في بداية مسيرتهم.\n\n## المواضيع التي ننشرها\n- إدارة المشاريع والبرامج والمحافظ في الممارسة العملية.\n- الكفاءات والتطوير المهني، بما في ذلك موضوعات كفاءات IPMA وشهاداتها.\n- دروس مستفادة من مشاريع حقيقية في المملكة وخارجها.\n- تأملات تتابع حلقات ملتقى المشاريع والندوات.\n\n## ما الذي نبحث عنه\n- **مفيد:** يستطيع القارئ أن يطبّق شيئاً بعد القراءة.\n- **أصيل:** من كتابتك، ولم يُنشر في مكان آخر، وليس نصاً مولَّداً يُقدَّم على أنه تجربتك.\n- **محدد:** أمثلة وأرقام وسياق بدل العموميات.\n- **متوازن:** وجهة نظر واضحة دون هجوم على أشخاص أو جهات.\n\n## الشكل\n- **الطول:** ثلاثة أشكال، وهي التالية.\n- **تحديث سريع:** أقل من 500 كلمة. خبر أو ملاحظة قصيرة أو نصيحة سريعة.\n- **مقال قصير:** من 1,000 إلى 2,500 كلمة تقريباً. حجة أو حالة أو درس مستفاد.\n- **مقال مميّز:** من 2,500 إلى 4,000 كلمة تقريباً. موضوع معمّق بالأدلة والأمثلة.\n- **اللغة:** العربية أو الإنجليزية. ويمكننا نشر النسختين إذا قدّمتهما معاً.\n- **البناء:** ملخص قصير من جملتين أو ثلاث، وعناوين واضحة، وفقرات قصيرة.\n- **بيانات الكاتب:** اسمك ودورك وجهة عملك، وسطر قصير عنك.\n- **الصور:** فقط الصور التي تملكها أو لديك إذن باستخدامها، مع وصف مختصر.\n\n## الأخلاقيات والسرية والحياد\n- لا تكشف معلومات سرية عن عميل أو جهة عمل أو متقدم للشهادة. اجعل الحالات مجهولة بحيث لا يمكن التعرف على أحد دون موافقته الكتابية.\n- لا تروّج لمنتجات أو جهات تدريب أو خدمات. اذكر أداة أو جهة فقط إذا كان ذلك ضرورياً للفكرة، وأخبرنا بأي علاقة لك بها.\n- لا تنشر أسئلة اختبارات أو مواد تقييم أو أي شيء قد يمسّ نزاهة شهادات IPMA.\n- انسب المصادر إلى أصحابها، واقتبس منها بدقة واختصار.\n- المجلة ليست قناة للشكاوى أو التظلمات، فهذه لها إجراءاتها الرسمية.\n\n## مراحل المراجعة\n1. **أرسل فكرتك أو مسودتك** عبر [صفحة التواصل](/ar/contact)، مع عنوان مبدئي وملخص من سطرين.\n2. **المراجعة التحريرية:** نتحقق من الملاءمة والجودة والدقة والنقاط أعلاه، وقد نطلب تعديلات.\n3. **الاعتماد:** نتفق معك على النص النهائي والعنوان وموعد النشر.\n4. **النشر:** يُنشر المقال على الموقع باسمك.\n\nالنشر وفق تقدير هيئة التحرير. وبإرسالك تؤكد أن العمل من تأليفك، وتوافق على أن تنشره IPMA السعودية على موقعها وقنواتها مع نسبته إليك. ويبقى لك حق إعادة نشره في مكان آخر بعد نشره عندنا، مع الإشارة إلى المجلة كمصدر أصلي.\n\nجاهز للكتابة؟ [تواصل معنا](/ar/contact) بفكرتك.',
      "These guidelines help authors write for Project Connect Magazine and help our editors review fairly and consistently.\n\n## Columns\nEvery article belongs to one column:\n- **Arguments:** a position, argued with evidence.\n- **Dialogue:** a conversation or interview.\n- **Storytelling:** a project story, told honestly.\n- **Hot topic:** a current issue in the profession.\n- **Research and academia:** findings, studies and academic perspectives.\n- **Young professionals:** voices and questions from early-career professionals.\n\n## Topics we publish\n- Project, programme and portfolio management in practice.\n- Competences and professional development, including IPMA competence and certification topics.\n- Lessons learned from real projects in the Kingdom and beyond.\n- Reflections that follow up Project Connect episodes and webinars.\n\n## What we look for\n- **Useful:** a reader should be able to apply something after reading.\n- **Original:** written by you, not published elsewhere, and not generated text presented as your own experience.\n- **Specific:** examples, numbers and context rather than general claims.\n- **Balanced:** a clear point of view, stated without attacking people or organisations.\n\n## Format\n- **Length:** one of three formats, listed next.\n- **Quick update:** under 500 words. A news item, a short observation or a quick tip.\n- **Short essay:** about 1,000 to 2,500 words. An argument, a case or a lesson learned.\n- **Featured article:** about 2,500 to 4,000 words. An in-depth piece with evidence and examples.\n- **Language:** Arabic or English. We can publish both versions when you provide them.\n- **Structure:** a short summary of two or three sentences, clear headings, and short paragraphs.\n- **Author details:** your name, role and organisation, and a short line about you.\n- **Images:** only images you own or have permission to use, with a short description.\n\n## Ethics, confidentiality and impartiality\n- Do not disclose confidential client, employer or candidate information. Anonymise cases so that no one can be identified without their written consent.\n- Do not promote products, training providers or services. Mention a tool or provider only when it is essential to the point, and tell us about any relationship you have with it.\n- Do not publish exam questions, assessment material or anything that could compromise the integrity of IPMA certification.\n- Credit your sources, and quote them accurately and briefly.\n- The magazine is not a channel for complaints or appeals. Those follow the official procedures.\n\n## Review process\n1. **Send your idea or draft** through the [contact page](/en/contact), with a working title and a two-line summary.\n2. **Editorial review:** we check fit, quality, accuracy and the points above, and may ask for changes.\n3. **Confirmation:** we agree the final text, title and publication date with you.\n4. **Publication:** the article is published on the website with your byline.\n\nPublication is at the editors' discretion. By submitting, you confirm the work is yours and agree that IPMA KSA may publish it on its website and social channels, with you credited. You keep the right to republish it elsewhere after publication, mentioning the magazine as the original source.\n\nReady to write? [Contact us](/en/contact) with your idea.",
    ),
  }),
  "ipma-croatia-collaboration": page({
    group: "certification",
    needsReview: true,
    title: l("التعاون مع IPMA كرواتيا", "IPMA Croatia collaboration"),
    intro: l(
      "تعاون مع جمعية IPMA كرواتيا في خدمات الشهادات.",
      "Collaboration with IPMA Croatia on certification services.",
    ),
    body: l(
      "تعمل IPMA السعودية مع الجمعيات الأعضاء في IPMA لتبادل الخبرات ودعم تطوير المقيّمين. وسننشر هنا تفاصيل التعاون مع IPMA كرواتيا.",
      "IPMA KSA works with other IPMA member associations to exchange expertise and support assessor development. Details of the collaboration with IPMA Croatia will be published here.",
    ),
  }),
  "education-training": page({
    group: "other",
    image: "/images/gpmf-lobby.webp",
    title: l("التعليم والتدريب", "Education and training"),
    intro: l(
      "نبني القدرات المهنية عبر برامج تدريبية ومسارات تعليمية متوافقة مع معايير IPMA.",
      "We build professional capability through training programs and learning pathways aligned with IPMA standards.",
    ),
    body: l(
      "## البرامج\n- **أساسيات إدارة المشاريع:** دفعة تجريبية مخطط لها في ديسمبر 2026.\n- **IPMA REG:** نعمل مع الجامعات ومعاهد TVTC، وأول مقدّمي البرامج في مارس 2027.\n- **IPMA CCT:** أول المرشحين مخطط له في فبراير 2027.\n- **IPMA Kids:** برنامج تعليم إدارة المشاريع للأطفال والشباب من 6 إلى 18 عاماً.\n\n## المعرفة العربية\nنعمل على محتوى عربي وبحوث تطبيقية وتعاون مع الجامعات لإثراء المعرفة المهنية في المنطقة.",
      "## Programs\n- **PM Fundamentals:** pilot cohort planned for December 2026.\n- **IPMA REG:** onboarding universities and TVTC institutes, with the first providers in March 2027.\n- **IPMA CCT:** first candidates planned for February 2027.\n- **IPMA Kids:** project management learning for children and young people aged 6–18.\n\n## Arabic knowledge\nWe are developing Arabic content, applied research and university collaboration to enrich professional knowledge in the region.",
    ),
  }),
  "privacy-policy": page({
    group: "other",
    needsReview: true,
    title: l("سياسة الخصوصية", "Privacy policy"),
    intro: l(
      "كيف تجمع IPMA السعودية بياناتك وتستخدمها وتحميها.",
      "How IPMA KSA collects, uses and protects your information.",
    ),
    body: l(
      "## البيانات التي نجمعها\nنجمع الاسم والبريد الإلكتروني عند إنشاء حساب أو التواصل معنا.\n\n## كيف نستخدمها\nنستخدمها للرد على استفساراتكم ولإرسال أخبار الجمعية ومواعيد الاختبارات والفعاليات. ولا نبيع بياناتكم أو نشاركها مع أطراف أخرى لأغراض تسويقية.\n\n## حقوقكم\nيمكنكم إلغاء الاشتراك في أي وقت عبر الرابط المرفق بالنشرة أو بمراسلتنا على care@ipmaksa.world.",
      "## Information we collect\nWe collect your name and email address when you create an account or contact us.\n\n## How we use it\nWe use it to answer your inquiries and to send association news, exam dates and events. We do not sell your information or share it with third parties for marketing.\n\n## Your rights\nYou can ask us to stop contacting you or delete your account at any time by writing to care@ipmaksa.world.",
    ),
  }),
  // Pages with their own layout: only the heading, intro and optional text are edited here.
  membership: page({
    group: "main",
    image: "/images/red-sea.webp",
    title: l("العضوية", "Membership"),
    intro: l(
      "انضم إلى مجتمع المهنيين والمؤسسات الذين يبنون مستقبل إدارة المشاريع في المملكة.",
      "Join the community of professionals and organizations building the future of project management in the Kingdom.",
    ),
    body: l(
      "العضوية مفتوحة للمهنيين في جميع مراحل مسيرتهم وللمؤسسات. التسجيل والدفع يتمّان عبر بوابة MyIPMA.\n\n## عضوية الأفراد (سنوياً)\n- **عضوية فردية:** 200 ريال\n- **عضوية الشباب (أقل من 35 سنة):** 100 ريال\n- **عضوية الطلاب:** 80 ريال\n\n## عضوية المؤسسات (سنوياً)\n- **صغيرة، حتى 10 أعضاء:** 1,800 ريال\n- **متوسطة، حتى 50 عضواً:** 8,000 ريال\n- **كبيرة، حتى 250 عضواً:** 25,000 ريال\n- **استراتيجية، حتى 500 عضو:** 40,000 ريال\n\n## الشروط\n- أسعار إطلاق سارية حتى 31 ديسمبر 2026، وغير شاملة ضريبة القيمة المضافة. وسيُراجع التسعير لعام 2027.\n- مدة العضوية 12 شهراً من تاريخ التفعيل، ويجب السداد كاملاً قبل التفعيل. والرسوم غير قابلة للاسترداد بعد التفعيل.\n- عضوية الأفراد غير قابلة للنقل. وعضوية الشباب تتطلب أن يقل العمر عن 35 سنة عند التسجيل، وعضوية الطلاب تتطلب التحقق من الصفة الطلابية.\n- عضوية المؤسسات تُفعّل عند استلام الدفع واعتماد قائمة الأعضاء، ويجب تقديم القائمة بالأسماء وتحديثها. ولا تُسترد المقاعد غير المستخدمة.\n\nالعضوية منفصلة عن الشهادة ولا تُشترط للحصول عليها، ويستفيد الأعضاء من رسوم الشهادات الأقل.",
      "Membership is open to professionals at every career stage and to organizations. Registration and payment are completed through the MyIPMA portal.\n\n## Individual membership (per year)\n- **Individual:** SAR 200\n- **Young Crew (under 35):** SAR 100\n- **Student:** SAR 80\n\n## Corporate membership (per year)\n- **Small, up to 10 members:** SAR 1,800\n- **Medium, up to 50 members:** SAR 8,000\n- **Enterprise, up to 250 members:** SAR 25,000\n- **Strategic, up to 500 members:** SAR 40,000\n\n## Terms\n- Launch prices valid until 31 December 2026, excluding VAT. Pricing will be reviewed for 2027.\n- Membership lasts 12 months from activation. Full payment is due before activation, and fees are non-refundable once activated.\n- Individual memberships are non-transferable. Young Crew requires age under 35 at registration; Student requires verified student status.\n- Corporate membership activates on receipt of payment and an approved member list. Named member lists must be submitted and kept current. Unused slots are non-refundable.\n\nMembership is separate from certification and is not required to certify. Members pay lower certification fees.",
    ),
  }),
  team: page({
    group: "main",
    image: "/images/gpmf-group.webp",
    title: l("فريق IPMA السعودية", "The IPMA KSA team"),
    intro: l(
      "الأشخاص الذين يقودون الجمعية وجهة منح الشهادات.",
      "The people who lead the association and the Certification Body.",
    ),
    body: l(
      "الجمعية وجهة منح الشهادات مستقلتان عن بعضهما، وليس للجمعية أي دور في قرارات منح الشهادات.",
      "The member association and the Certification Body are independent of each other. The association has no role in certification decisions.",
    ),
  }),
  "project-connect": page({
    group: "main",
    image: "/images/gpmf-lobby.webp",
    title: l("ملتقى المشاريع", "Project Connect"),
    intro: l(
      "مبادرة IPMA السعودية للندوات الإلكترونية وورش العمل التي تربط المهنيين بالمعرفة والخبرات في إدارة المشاريع.",
      "IPMA KSA's initiative of webinars and workshops connecting professionals with project management knowledge and experience.",
    ),
    body: l(
      "## عن المبادرة\nملتقى المشاريع (Project Connect) سلسلة من الندوات الإلكترونية وورش العمل التي تقدمها IPMA السعودية لتبادل المعرفة وبناء الكفاءات وتوسيع شبكة المهنيين. تُعلن المواعيد والتسجيل في هذه الصفحة.",
      "## About the initiative\nProject Connect is a series of webinars and workshops from IPMA KSA to share knowledge, build competence and grow the professional network. Dates and registration are announced on this page.",
    ),
  }),
  "exam-dates": page({
    group: "main",
    image: "/images/diriyah-aerial.webp",
    title: l("مواعيد الاختبارات", "Exam dates"),
    intro: l(
      "المواعيد القادمة للاختبارات والبرامج في المملكة.",
      "Upcoming exams and program dates in the Kingdom.",
    ),
    body: l(
      "للاستفسار عن التسجيل أو المواعيد، تواصلوا معنا على البريد الإلكتروني أو الهاتف.",
      "For registration or date inquiries, contact us by email or phone.",
    ),
  }),
  news: page({
    group: "main",
    image: "/images/awards.webp",
    title: l("الأخبار والمستجدات", "News and updates"),
    intro: l("آخر أخبار IPMA السعودية.", "The latest from IPMA KSA."),
    body: l("", ""),
  }),
  contact: page({
    group: "main",
    image: "/images/diriyah-dusk.webp",
    title: l("تواصل معنا", "Contact us"),
    intro: l(
      "يسعدنا تواصلكم. اكتب إلينا أو اتصل بنا وسنرد في أقرب وقت.",
      "We would love to hear from you. Write or call us and we will reply as soon as we can.",
    ),
    body: l("", ""),
  }),
};

// Certification content supplied by IPMA KSA (levels A-D, recertification and fees)
for (const [slug, body] of Object.entries(CERT)) pages[slug].body = body;
Object.assign(pages["ipma-level-a"], {
  title: l("المستوى A: مدير مشاريع/برامج/محافظ معتمد", "Level A: Certified Project/Program/Portfolio Director"),
  intro: l("لمن قادوا ووجّهوا بيئات مشاريع شديدة التعقيد ذات أثر استراتيجي. 6,000 ريال للأعضاء · 7,500 لغير الأعضاء.", "For leaders of highly complex project environments with strategic impact. SAR 6,000 members · SAR 7,500 non-members."),
  needsReview: false,
});
Object.assign(pages["ipma-level-b"], {
  title: l("المستوى B: مدير مشاريع/برامج/محافظ أول معتمد", "Level B: Certified Senior Project/Program/Portfolio Manager"),
  intro: l("لمديري المشاريع في بيئات معقدة. 5,155 ريال للأعضاء · 6,444 لغير الأعضاء.", "For project managers in complex environments. SAR 5,155 members · SAR 6,444 non-members."),
  needsReview: false,
});
Object.assign(pages["ipma-level-c"], {
  title: l("المستوى C: مدير مشاريع معتمد", "Level C: Certified Project Manager"),
  intro: l("لمديري المشاريع متوسطة التعقيد. 2,851 ريال للأعضاء · 3,564 لغير الأعضاء.", "For managers of moderately complex projects. SAR 2,851 members · SAR 3,564 non-members."),
  needsReview: false,
});
Object.assign(pages["ipma-level-d"], {
  title: l("المستوى D: مساعد إدارة مشاريع معتمد", "Level D: Certified Project Management Associate"),
  intro: l("نقطة انطلاق للشباب والعاملين في فرق المشاريع. من 720 ريالاً للطلاب.", "A starting point for young people and project team members. From SAR 720 for students."),
  needsReview: false,
});
Object.assign(pages["recertification"], {
  title: l("إعادة الاعتماد والرسوم", "Recertification and fees"),
  intro: l("التجديد السنوي ورسوم الترقية والرسوم الإدارية.", "Annual renewal, upgrade fees and administrative fees."),
  needsReview: false,
});

const team = {
  "badr-burshaid": {
    name: l("م. بدر برشيد", "Eng. Badr Burshaid"),
    role: l("رئيس IPMA السعودية", "President, IPMA KSA"),
    group: "ma",
    bio: l(
      "يقود العضوية وبرنامج Young Crew وبرامج الجمعية، ويمنح جهة منح الشهادات استقلالها الفني، ويتولى العلاقة مع IPMA.",
      "Leads membership, Young Crew and programs, gives the Certification Body its technical independence, and holds the relationship with IPMA.",
    ),
    photo: "/images/team/badr-burshaid.webp",
    linkedin: "",
    order: 1,
  },
  "badr-aldulami": {
    name: l("معالي د. بدر بن عبدالله الدلامي", "H.E. Dr. Badr Bin Abdullah Al-Dulami"),
    role: l("رئيس جهة منح الشهادات", "Head of Certification Body"),
    group: "cb",
    bio: l(
      "نائب وزير.",
      "Deputy Minister.",
    ),
    photo: "/images/team/badr-aldulami.webp",
    linkedin: "",
    order: 2,
  },
  "emine-bujupaj": {
    name: l("إمين بوجوباج", "Emine Bujupaj"),
    role: l("مديرة الشهادات", "Certification Manager"),
    group: "cb",
    bio: l("", ""),
    photo: "/images/team/emine-bujupaj.webp",
    linkedin: "",
    order: 3,
  },
  "muhammad-mohsin": {
    name: l("م. محمد محسن", "Engr. Muhammad Mohsin"),
    role: l("رئيس المقيّمين", "Head of Assessors"),
    group: "cb",
    bio: l("", ""),
    photo: "/images/team/muhammad-mohsin.webp",
    linkedin: "",
    order: 4,
  },
  "asmaa-mabrouk": {
    name: l("أسماء مبروك", "Asmaa Mabrouk"),
    role: l("مسؤولة إدارة الشهادات", "Certification Administrator"),
    group: "cb",
    bio: l("", ""),
    photo: "/images/team/asmaa-mabrouk.webp",
    linkedin: "",
    order: 5,
  },
  "jehad-alamri": {
    name: l("د. جهاد العمري", "Dr. Jehad Al Amri"),
    role: l("رئيس لجنة نظام الشهادات", "Head of Scheme Committee"),
    group: "cb",
    bio: l("", ""),
    photo: "/images/team/jehad-alamri.webp",
    linkedin: "",
    order: 6,
  },
  "olubusola-awosanya": {
    name: l("أولوبوسولا أووسانيا", "Olubusola Awosanya"),
    role: l("رئيسة لجنة الشكاوى والتظلمات", "Head of Complaints and Appeals Committee"),
    group: "cb",
    bio: l("", ""),
    photo: "/images/team/olubusola-awosanya.webp",
    linkedin: "",
    order: 7,
  },
};

const exams = {
  "4lc-2026-12-25": {
    title: l("اختبارات IPMA 4-L-C: ديسمبر 2026", "IPMA 4-L-C exams: December 2026"),
    programme: "IPMA 4-L-C",
    date: "2026-12-25",
    dateText: l("", ""),
    location: l("المملكة العربية السعودية", "Saudi Arabia"),
    status: "open",
    link: "",
    note: l("للتقديم راجع صفحات المستويات A وB وC وD أو راسلنا.", "To apply, see the Level A, B, C and D pages or write to us."),
    order: 1,
  },
  "4lc-2026-11-25": {
    title: l("اختبارات IPMA 4-L-C: نوفمبر 2026", "IPMA 4-L-C exams: November 2026"),
    programme: "IPMA 4-L-C",
    date: "2026-11-25",
    dateText: l("", ""),
    location: l("المملكة العربية السعودية", "Saudi Arabia"),
    status: "open",
    link: "",
    note: l("للتقديم راجع صفحات المستويات A وB وC وD أو راسلنا.", "To apply, see the Level A, B, C and D pages or write to us."),
    order: 2,
  },
  "4lc-2026-10-25": {
    title: l("اختبارات IPMA 4-L-C: أكتوبر 2026", "IPMA 4-L-C exams: October 2026"),
    programme: "IPMA 4-L-C",
    date: "2026-10-25",
    dateText: l("", ""),
    location: l("المملكة العربية السعودية", "Saudi Arabia"),
    status: "closed",
    link: "",
    note: l("", ""),
    order: 3,
  },
  "4lc-2026-09-25": {
    title: l("اختبارات IPMA 4-L-C: سبتمبر 2026", "IPMA 4-L-C exams: September 2026"),
    programme: "IPMA 4-L-C",
    date: "2026-09-25",
    dateText: l("", ""),
    location: l("المملكة العربية السعودية", "Saudi Arabia"),
    status: "closed",
    link: "",
    note: l("", ""),
    order: 4,
  },
  "cct-first-candidates": {
    title: l("أول مرشحي IPMA CCT", "First IPMA CCT candidates"),
    programme: "IPMA CCT",
    date: "",
    dateText: l("فبراير 2027", "February 2027"),
    location: l("المملكة العربية السعودية", "Saudi Arabia"),
    status: "soon",
    link: "",
    note: l("بالتنسيق مع CVMB.", "In coordination with CVMB."),
    order: 3,
  },
  "reg-first-providers": {
    title: l("أول مقدّمي برامج IPMA REG", "First IPMA REG providers"),
    programme: "IPMA REG",
    date: "",
    dateText: l("مارس 2027", "March 2027"),
    location: l("الجامعات ومعاهد TVTC", "Universities and TVTC institutes"),
    status: "soon",
    link: "",
    note: l("", ""),
    order: 4,
  },
};

const benefits = {
  knowledge: {
    icon: "globe",
    title: l("معرفة وأطر عمل عالمية", "Global knowledge and frameworks"),
    text: l("وصول إلى المعايير والأطر ومحتوى IPMA العالمي.", "Access to IPMA's global standards, frameworks and content."),
    order: 1,
  },
  eligibility: {
    icon: "shield",
    title: l("أهلية للحصول على شهادات IPMA", "Eligibility for IPMA certifications"),
    text: l("مسار مباشر نحو شهادات IPMA 4-L-C المعتمدة دولياً.", "A direct path to internationally recognized IPMA 4-L-C certifications."),
    order: 2,
  },
  events: {
    icon: "calendar",
    title: l("فعاليات وندوات حصرية للأعضاء", "Member-only events and webinars"),
    text: l("ندوات وورش وفعاليات مخصصة لأعضاء الجمعية.", "Webinars, workshops and events reserved for members."),
    order: 3,
  },
  networking: {
    icon: "network",
    title: l("شبكة علاقات مهنية", "Professional networking"),
    text: l("تواصل مع المهنيين والمؤسسات في المملكة وحول العالم.", "Connect with professionals and organizations in the Kingdom and worldwide."),
    order: 4,
  },
  card: {
    icon: "card",
    title: l("بطاقة عضوية رقمية", "Digital membership card"),
    text: l("بطاقة عضوية رقمية تثبت انتماءك إلى IPMA السعودية.", "A digital card that confirms your IPMA KSA membership."),
    order: 5,
  },
  discounts: {
    icon: "badge",
    title: l("خصومات على التدريب والشهادات والفعاليات", "Discounts on training, certification and events"),
    text: l("أسعار تفضيلية للأعضاء على البرامج والفعاليات.", "Preferred member rates on programs and events."),
    order: 6,
  },
};

const news = {
  "gpmf-2026-strategic-partner": {
    title: l("IPMA السعودية شريك استراتيجي للمنتدى العالمي لإدارة المشاريع 2026", "IPMA KSA is Strategic Partner of the Global Project Management Forum 2026"),
    excerpt: l(
      "أُعلنت IPMA السعودية شريكاً استراتيجياً للمنتدى الذي أُقيم في الرياض في 19–21 سبتمبر 2026.",
      "IPMA KSA was named Strategic Partner of the forum held in Riyadh on September 19–21, 2026.",
    ),
    body: l(
      "أعلن المنتدى العالمي لإدارة المشاريع عن IPMA السعودية شريكاً استراتيجياً لعام 2026 قبل انعقاده، وكرّمها بجائزة الشريك الاستراتيجي خلال المنتدى. ووصف رئيس IPMA الدكتور ملادن فوكومانوفيتش المنتدى بأنه من أكبر التجمعات لمهنة إدارة المشاريع في العالم وأكبرها في الشرق الأوسط.",
      "The Global Project Management Forum named IPMA KSA its Strategic Partner for 2026 ahead of the event, and honored it with the Strategic Partner award at the forum. IPMA President Prof. Dr. Mladen Vukomanović called the forum one of the world's largest gatherings for the project profession and the largest in the Middle East.",
    ),
    date: "2026-09-19",
    image: "/images/gpmf-lobby.webp",
    published: true,
  },
  "young-crew-first-program": {
    title: l("أول برنامج لـ IPMA Young Crew في GPMF 2026", "First IPMA Young Crew program at GPMF 2026"),
    excerpt: l(
      "أُطلق IPMA Young Crew في المملكة في 2026 وقدّم أول برامجه خلال المنتدى.",
      "IPMA Young Crew was set up in the Kingdom in 2026 and ran its first program at the forum.",
    ),
    body: l(
      "تأسس IPMA Young Crew في المملكة في 2026 لدعم المهنيين الشباب، وقدّم أول برامجه خلال المنتدى العالمي لإدارة المشاريع 2026 في الرياض.",
      "IPMA Young Crew was set up in the Kingdom in 2026 to support young professionals, and ran its first program during the Global Project Management Forum 2026 in Riyadh.",
    ),
    date: "2026-09-20",
    image: "/images/gpmf-group.webp",
    published: true,
  },
  "first-ipma-delta-aramco": {
    title: l("أرامكو السعودية تحصل على أول IPMA Delta في المملكة", "Saudi Aramco receives the first IPMA Delta in the Kingdom"),
    excerpt: l(
      "جرى تكريم مشروع الزلف البحري في أرامكو السعودية على منصة IPMA خلال احتفالها بمرور 60 عاماً.",
      "The Zuluf Offshore Oil Project at Saudi Aramco was recognized on the IPMA stage during its 60th anniversary.",
    ),
    body: l(
      "في مارس 2025 حصلت أرامكو السعودية عن مشروع الزلف البحري على أول IPMA Delta في المملكة، وجرى تكريمها على منصة IPMA خلال احتفالها بمرور 60 عاماً. وأثبت ذلك أن IPMA Delta يعمل في أكثر بيئات التنفيذ تطلباً في المملكة.",
      "In March 2025, Saudi Aramco received the first IPMA Delta in the Kingdom for the Zuluf Offshore Oil Project and was recognized on the IPMA stage during its 60th anniversary. It showed that IPMA Delta works in the Kingdom's most demanding delivery environment.",
    ),
    date: "2025-03-15",
    image: "/images/milestones.webp",
    published: true,
  },
};

export const SEED: Record<string, Record<string, unknown>> = {
  home: { main: home },
  journey: { main: JOURNEY },
  settings: { site: settings },
  pages,
  articles: {
    "sample-article": {
      title: l("عنوان المقال", "Article title"),
      excerpt: l("ملخص من جملتين أو ثلاث يظهر في صفحة المقالات.", "A two or three sentence summary that appears on the Articles page."),
      body: l(
        "اكتب المقال هنا. استخدم عناوين ثانوية وفقرات قصيرة.\n\n## عنوان ثانوي\nنص الفقرة.",
        "Write the article here. Use subheadings and short paragraphs.\n\n## A subheading\nParagraph text.",
      ),
      author: l("اسم الكاتب", "Author name"),
      authorRole: l("الدور والجهة", "Role and organisation"),
      column: "storytelling",
      featured: false,
      date: "2026-11-04",
      image: "",
      published: false,
    },
  },
  team,
  exams,
  events: {
    "project-connect-ep1-what-makes-projects-succeed": {
      title: l("الحلقة الأولى من ملتقى المشاريع: ما الذي يصنع نجاح المشاريع فعلاً؟", "Project Connect Episode 1: What Makes Projects Succeed?"),
      kind: "webinar",
      description: l(
        "ليست الأدوات وحدها ولا الخطط وحدها، بل الكفاءات التي تقف خلف كل تسليم ناجح. في أولى جلسات ملتقى المشاريع من IPMA السعودية استضفنا نخبة من الخبراء ليتحدثوا عن الكفاءات التي تصنع الفرق بين مشروع يتعثر ومشروع يحقق أثره.",
        "Not tools alone and not plans alone, but the competences behind every successful delivery. In the first Project Connect session from IPMA KSA, experts discussed the competences that separate a project that struggles from one that delivers its impact.",
      ),
      date: "2026-10-27",
      time: "7:00 – 8:00 PM (KSA)",
      endTime: "20:00",
      format: l("عبر Zoom", "On Zoom"),
      speaker: l(
        "يدير الحوار: سامح مكي · المتحدثون: جيم جيسور (IPMA Level A, PMP, RMP, P.E.) وتورغوت يلدز",
        "Moderator: Sameh Makky · Speakers: Cem Cesur (IPMA Level A, PMP, RMP, P.E.) and Turgut Yildiz",
      ),
      image: "/images/pc-episode-1.webp",
      link: "",
      status: "closed",
      recording: "",
    },
    "project-connect-ep2-people-competences": {
      title: l("الحلقة الثانية من ملتقى المشاريع: كفاءات الأشخاص، مفتاح نجاح مديري المشاريع", "Project Connect Episode 2: People Competences for Successful Project Managers"),
      kind: "webinar",
      description: l(
        "خلف كل مشروع ناجح فريق، وخلف كل فريق قائد يُحسن التعامل مع الناس. في هذه الحلقة نتناول كفاءات الأشخاص (People Competences) في الإطار الدولي ICB5 الصادر عن IPMA، ونرى كيف تصنع القيادة والتواصل والعمل الجماعي وإدارة النزاعات فرقاً حقيقياً في نتائج المشاريع. يحصل الحضور على ساعة CPD في MyIPMA.",
        "Behind every successful project is a team, and behind every team is a leader who knows how to work with people. This episode explores the People Competences in IPMA's ICB5 framework and how leadership, communication, teamwork and conflict management make a real difference to project results. Attendees earn one CPD hour in MyIPMA.",
      ),
      date: "2026-11-03",
      time: "7:00 – 8:00 PM (KSA)",
      endTime: "20:00",
      format: l("عبر Zoom", "On Zoom"),
      speaker: l(
        "تيودورا بوجيفا (رئيسة الخدمات المهنية، Businessmap) · تدير الحوار: سلبي كيشيشيان (المؤسسة والرئيسة التنفيذية، SCALE Advisory)",
        "Teodora Bozheva (Head of Professional Services, Businessmap) · Moderator: Salpie Kechichian (Founder & CEO, SCALE Advisory)",
      ),
      image: "/images/pc-episode-2.webp",
      link: "https://zoom.us/webinar/register",
      status: "open",
      recording: "",
    },
  },
  badges: {
    membership: {
      title: l("عضو IPMA السعودية", "IPMA KSA Member"),
      description: l("عضوية معتمدة في IPMA السعودية.", "Verified membership of IPMA KSA."),
      image: "/images/badge-member.webp",
      icon: "card",
      order: 1,
    },
  },
  benefits,
  news,
};
