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

export type SubscriberDoc = {
  email: string;
  name: string;
  lang: Locale;
  source: string;
  token: string;
  createdAt: string;
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
