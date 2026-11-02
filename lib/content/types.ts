/** A bilingual string. Arabic is the default language of the site. */
export type L = { ar: string; en: string };

export type Locale = "ar" | "en";

export type SiteSettings = {
  email: string;
  phone: string;
  whatsapp: string;
  address: L;
  hours: L;
  linkedin: string;
  x: string;
  instagram: string;
  youtube: string;
};

export type Stat = { value: number; suffix: string; label: L };
export type Pillar = { icon: string; title: L; text: L };
export type LiveItem = {
  title: L;
  text: L;
  status: "live" | "setting-up" | "introduced" | "later";
};

export type HomeDoc = {
  heroEyebrow: L;
  heroTitle: L;
  heroText: L;
  heroImage: string;
  stats: Stat[];
  pillarsTitle: L;
  pillars: Pillar[];
  ambitionTitle: L;
  ambitionText: L;
  aboutTitle: L;
  aboutText: L;
  aboutImage: string;
  liveTitle: L;
  liveText: L;
  live: LiveItem[];
  gpmfTitle: L;
  gpmfText: L;
  gpmfImage: string;
  joinTitle: L;
  joinText: L;
  joinImage: string;
};

export type PageDoc = {
  title: L;
  intro: L;
  body: L;
  image: string;
  group: string;
  published: boolean;
  needsReview: boolean;
};

export type TeamDoc = {
  name: L;
  role: L;
  group: "ma" | "cb";
  bio: L;
  photo: string;
  linkedin: string;
  order: number;
};

export type ExamDoc = {
  title: L;
  programme: string;
  date: string; // YYYY-MM-DD or empty when not yet fixed
  dateText: L; // shown when no exact date, e.g. "December 2026"
  location: L;
  status: "open" | "soon" | "tba" | "closed";
  link: string;
  note: L;
  order: number;
};

export type BenefitDoc = {
  icon: string;
  title: L;
  text: L;
  order: number;
};

export type NewsDoc = {
  title: L;
  excerpt: L;
  body: L;
  date: string;
  image: string;
  published: boolean;
};

export type MessageDoc = {
  name: string;
  email: string;
  subject: string;
  message: string;
  lang: Locale;
  createdAt: string;
  read: boolean;
};

export type Doc<T> = { id: string; data: T };

export type ProjectEventDoc = {
  title: L;
  kind: "webinar" | "workshop" | "meetup";
  description: L;
  date: string; // YYYY-MM-DD
  time: string; // free text, e.g. "6:00 PM - 7:30 PM (KSA)"
  format: L; // e.g. Online (Zoom) / Riyadh
  speaker: L;
  image: string;
  link: string; // registration link
  status: "open" | "soon" | "closed";
  recording: string; // link to recording once finished
};

export type BadgeDoc = { title: L; description: L; image: string; icon: string; order: number };
export type MemberBadge = { id: string; awardedAt: string; note: string };
export type MemberDoc = {
  email: string;
  firstName: string;
  lastName: string;
  country: string; // ISO 3166-1 alpha-2
  dob: string;
  photo: string;
  passwordHash: string;
  lang: Locale;
  createdAt: string;
  badges: MemberBadge[];
};

export type JourneyDoc = {
  cycleTitle: L;
  cycleIntro: L;
  stages: { title: L }[];
  roles: { name: L; subtitle: L; steps: { text: L }[] }[];
  noteStrong: L;
  noteText: L;
  prepareTitle: L;
  prepareIntro: L;
  icbTitle: L;
  icbText: L;
  icbButton: L;
  icbUrl: string;
  structureTitle: L;
  structureText: L;
  domainsLabel: L;
  domains: { name: L }[];
  areasLabel: L;
  areas: { name: L }[];
  levelsTitle: L;
  levels: { badge: string; label: L; text: L }[];
  guideNote: L;
  freeNote: L;
  faqTitle: L;
  faqIntro: L;
  faqs: { q: L; a: L }[];
};
