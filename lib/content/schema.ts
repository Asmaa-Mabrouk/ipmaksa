/**
 * Declarative schema for every editable collection.
 * The admin forms are generated from this, and the server sanitises every save against it.
 */
export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "image"
  | "number"
  | "date"
  | "select"
  | "bool"
  | "url"
  | "email"
  | "list";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  /** bilingual: stored as { ar, en } */
  i18n?: boolean;
  options?: { value: string; label: string }[];
  fields?: Field[]; // for lists
  help?: string;
  itemLabel?: string; // lists
};

export type CollectionDef = {
  id: string;
  label: string;
  description?: string;
  /** single = one document with a fixed id */
  single?: string;
  /** field used as the title in lists */
  titleKey?: string;
  canCreate?: boolean;
  canDelete?: boolean;
  fields: Field[];
  /** Pages/sections that are not editable content (e.g. messages) are handled separately. */
};

const status = [
  { value: "open", label: "Open for registration" },
  { value: "soon", label: "Coming soon" },
  { value: "tba", label: "Date to be announced" },
  { value: "closed", label: "Closed / completed" },
];

export const ICON_OPTIONS = [
  { value: "globe", label: "Globe" },
  { value: "growth", label: "Growth" },
  { value: "community", label: "Community" },
  { value: "card", label: "Membership card" },
  { value: "calendar", label: "Calendar / events" },
  { value: "network", label: "Network" },
  { value: "book", label: "Knowledge" },
  { value: "badge", label: "Discount / badge" },
  { value: "shield", label: "Certification" },
];

export const COLLECTIONS: CollectionDef[] = [
  {
    id: "home",
    label: "Home page",
    description: "Hero, statistics, sections and call-to-action blocks of the home page.",
    single: "main",
    fields: [
      { key: "heroEyebrow", label: "Hero – small line above title", type: "text", i18n: true },
      { key: "heroTitle", label: "Hero – title", type: "text", i18n: true },
      { key: "heroText", label: "Hero – text", type: "textarea", i18n: true },
      { key: "heroImage", label: "Hero – background image", type: "image" },
      {
        key: "stats",
        label: "Statistics strip",
        type: "list",
        itemLabel: "Statistic",
        fields: [
          { key: "value", label: "Number", type: "number" },
          { key: "suffix", label: "Suffix (+, k, M)", type: "text" },
          { key: "label", label: "Label", type: "text", i18n: true },
        ],
      },
      { key: "pillarsTitle", label: "Why certify – section title", type: "text", i18n: true },
      {
        key: "pillars",
        label: "Why certify – cards",
        type: "list",
        itemLabel: "Card",
        fields: [
          { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
          { key: "title", label: "Title", type: "text", i18n: true },
          { key: "text", label: "Text", type: "textarea", i18n: true },
        ],
      },
      { key: "ambitionTitle", label: "Saudi ambition – title", type: "text", i18n: true },
      { key: "ambitionText", label: "Saudi ambition – text", type: "textarea", i18n: true },
      { key: "aboutTitle", label: "About – title", type: "text", i18n: true },
      { key: "aboutText", label: "About – text", type: "markdown", i18n: true },
      { key: "aboutImage", label: "About – image", type: "image" },
      { key: "liveTitle", label: "What is live – title", type: "text", i18n: true },
      { key: "liveText", label: "What is live – intro", type: "textarea", i18n: true },
      {
        key: "live",
        label: "What is live – programmes",
        type: "list",
        itemLabel: "Programme",
        fields: [
          { key: "title", label: "Name", type: "text", i18n: true },
          { key: "text", label: "Status text", type: "textarea", i18n: true },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "live", label: "Live" },
              { value: "setting-up", label: "Setting up" },
              { value: "introduced", label: "Introduced" },
              { value: "later", label: "Later" },
            ],
          },
        ],
      },
      { key: "gpmfTitle", label: "GPMF – title", type: "text", i18n: true },
      { key: "gpmfText", label: "GPMF – text", type: "textarea", i18n: true },
      { key: "gpmfImage", label: "GPMF – image", type: "image" },
      { key: "joinTitle", label: "Join us – title", type: "text", i18n: true },
      { key: "joinText", label: "Join us – text", type: "textarea", i18n: true },
      { key: "joinImage", label: "Join us – background image", type: "image" },
    ],
  },
  {
    id: "pages",
    label: "Pages",
    description: "About, certification levels, standards, education, privacy and other content pages.",
    titleKey: "title",
    canCreate: true,
    canDelete: true,
    fields: [
      { key: "title", label: "Title", type: "text", i18n: true },
      { key: "intro", label: "Introduction (short)", type: "textarea", i18n: true },
      {
        key: "body",
        label: "Content",
        type: "markdown",
        i18n: true,
        help: "Use ## for headings, - for bullet lists, **bold**, [link text](https://…)",
      },
      { key: "image", label: "Header image", type: "image" },
      { key: "group", label: "Menu group (about / certification / other)", type: "text" },
      { key: "published", label: "Published", type: "bool" },
      { key: "needsReview", label: "Needs review (hidden note for editors)", type: "bool" },
    ],
  },
  {
    id: "team",
    label: "Team",
    description: "People shown on the Team page. Add a LinkedIn link to show the LinkedIn button.",
    titleKey: "name",
    canCreate: true,
    canDelete: true,
    fields: [
      { key: "name", label: "Name", type: "text", i18n: true },
      { key: "role", label: "Role", type: "text", i18n: true },
      {
        key: "group",
        label: "Group",
        type: "select",
        options: [
          { value: "ma", label: "Member Association (IPMA KSA)" },
          { value: "cb", label: "Certification Body" },
        ],
      },
      { key: "bio", label: "Short bio", type: "textarea", i18n: true },
      { key: "photo", label: "Photo", type: "image" },
      { key: "linkedin", label: "LinkedIn profile URL", type: "url" },
      { key: "order", label: "Order (1 = first)", type: "number" },
    ],
  },
  {
    id: "exams",
    label: "Exam dates",
    description: "Upcoming exams and programme milestones, shown on the home page and the Exam Dates page.",
    titleKey: "title",
    canCreate: true,
    canDelete: true,
    fields: [
      { key: "title", label: "Title", type: "text", i18n: true },
      { key: "programme", label: "Programme (e.g. IPMA 4-L-C, Delta)", type: "text" },
      {
        key: "date",
        label: "Exact date",
        type: "date",
        help: "Leave empty if the date is not fixed yet and use the text below.",
      },
      { key: "dateText", label: "Date text (when no exact date)", type: "text", i18n: true },
      { key: "location", label: "Location / format", type: "text", i18n: true },
      { key: "status", label: "Status", type: "select", options: status },
      { key: "link", label: "Registration / details link", type: "url" },
      { key: "note", label: "Note", type: "textarea", i18n: true },
      { key: "order", label: "Order (used when no exact date)", type: "number" },
    ],
  },
  {
    id: "journey",
    label: "How certification works",
    description: "Cycle table, how to prepare and FAQ. The 6-stage application-to-certificate table, the 'How to prepare' text and the frequently asked questions. Shown on the home page and on the How certification works page.",
    single: "main",
    fields: [
      { key: "cycleTitle", label: "Cycle – section title", type: "text", i18n: true },
      { key: "cycleIntro", label: "Cycle – small line under the title", type: "text", i18n: true },
      { key: "stages", label: "Stages (the 6 columns, in order)", type: "list", itemLabel: "Stage", fields: [{ key: "title", label: "Stage name", type: "text", i18n: true }] },
      {
        key: "roles", label: "Who does what (rows)", type: "list", itemLabel: "Role",
        fields: [
          { key: "name", label: "Role", type: "text", i18n: true },
          { key: "subtitle", label: "Role – short description", type: "text", i18n: true },
          { key: "steps", label: "What this role does at each stage", type: "list", itemLabel: "Stage", help: "Keep the same order as the stages above. Leave the text empty if this role is not involved at that stage.", fields: [{ key: "text", label: "Action", type: "text", i18n: true }] },
        ],
      },
      { key: "noteStrong", label: "Bold note under the table", type: "text", i18n: true },
      { key: "noteText", label: "Second note under the table", type: "text", i18n: true },
      { key: "prepareTitle", label: "How to prepare – section title", type: "text", i18n: true },
      { key: "prepareIntro", label: "Intro (what to study first)", type: "textarea", i18n: true },
      { key: "icbTitle", label: "How to get the ICB4 – title", type: "text", i18n: true },
      { key: "icbText", label: "How to get the ICB4 – text", type: "textarea", i18n: true },
      { key: "icbButton", label: "Download button text", type: "text", i18n: true },
      { key: "icbUrl", label: "Download button link", type: "url" },
      { key: "structureTitle", label: "What the ICB4 covers – title", type: "text", i18n: true },
      { key: "structureText", label: "What the ICB4 covers – text", type: "textarea", i18n: true },
      { key: "domainsLabel", label: "Domains – label", type: "text", i18n: true },
      { key: "domains", label: "Domains", type: "list", itemLabel: "Domain", fields: [{ key: "name", label: "Name", type: "text", i18n: true }] },
      { key: "areasLabel", label: "Competence areas – label", type: "text", i18n: true },
      { key: "areas", label: "Competence areas", type: "list", itemLabel: "Area", fields: [{ key: "name", label: "Name", type: "text", i18n: true }] },
      { key: "levelsTitle", label: "What to study by level – title", type: "text", i18n: true },
      {
        key: "levels", label: "Levels", type: "list", itemLabel: "Level",
        fields: [
          { key: "badge", label: "Badge letter (D, C, B · A)", type: "text" },
          { key: "label", label: "Short label", type: "text", i18n: true },
          { key: "text", label: "What to study", type: "textarea", i18n: true },
        ],
      },
      { key: "guideNote", label: "Tip about the Self-Assessment Form", type: "textarea", i18n: true },
      { key: "freeNote", label: "Highlighted note (training not mandatory)", type: "text", i18n: true },
      { key: "faqTitle", label: "FAQ – title", type: "text", i18n: true },
      { key: "faqIntro", label: "FAQ – small line", type: "text", i18n: true },
      { key: "faqs", label: "Frequently asked questions", type: "list", itemLabel: "Question", fields: [{ key: "q", label: "Question", type: "text", i18n: true }, { key: "a", label: "Answer", type: "textarea", i18n: true }] },
    ],
  },
  {
    id: "events",
    label: "Project Connect events",
    description: "Webinars and workshops of the Project Connect initiative, announced on the Project Connect page.",
    titleKey: "title",
    canCreate: true,
    canDelete: true,
    fields: [
      { key: "title", label: "Title", type: "text", i18n: true },
      { key: "kind", label: "Type", type: "select", options: [{ value: "webinar", label: "Webinar" }, { value: "workshop", label: "Workshop" }, { value: "meetup", label: "Meetup" }] },
      { key: "description", label: "Description", type: "textarea", i18n: true },
      { key: "date", label: "Date", type: "date" },
      { key: "time", label: "Time", type: "text", help: "e.g. 6:00 PM - 7:30 PM (KSA time)" },
      { key: "format", label: "Online / location", type: "text", i18n: true },
      { key: "speaker", label: "Speaker(s)", type: "text", i18n: true },
      { key: "image", label: "Image", type: "image" },
      { key: "link", label: "Registration link", type: "url" },
      { key: "status", label: "Status", type: "select", options: [{ value: "open", label: "Open for registration" }, { value: "soon", label: "Coming soon" }, { value: "closed", label: "Finished / closed" }] },
      { key: "recording", label: "Recording link (after the event)", type: "url" },
    ],
  },
  {
    id: "benefits",
    label: "Membership benefits",
    description: "Benefits listed on the Membership page and in the Join Us section.",
    titleKey: "title",
    canCreate: true,
    canDelete: true,
    fields: [
      { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
      { key: "title", label: "Title", type: "text", i18n: true },
      { key: "text", label: "Description", type: "textarea", i18n: true },
      { key: "order", label: "Order", type: "number" },
    ],
  },
  {
    id: "badges",
    label: "Badges",
    description: "Badge types you can award to registered members (for example the Membership badge). Award them from the Members screen.",
    titleKey: "title",
    canCreate: true,
    canDelete: true,
    fields: [
      { key: "title", label: "Badge name", type: "text", i18n: true },
      { key: "description", label: "What it means", type: "textarea", i18n: true },
      { key: "image", label: "Badge artwork (optional)", type: "image", help: "Square image, ideally transparent PNG. If empty, the icon below is used." },
      { key: "icon", label: "Icon (used when there is no artwork)", type: "select", options: ICON_OPTIONS },
      { key: "order", label: "Order", type: "number" },
    ],
  },
  {
    id: "news",
    label: "News",
    description: "News and updates shown on the home page and the News page.",
    titleKey: "title",
    canCreate: true,
    canDelete: true,
    fields: [
      { key: "title", label: "Title", type: "text", i18n: true },
      { key: "excerpt", label: "Summary", type: "textarea", i18n: true },
      { key: "body", label: "Article", type: "markdown", i18n: true },
      { key: "date", label: "Date", type: "date" },
      { key: "image", label: "Image", type: "image" },
      { key: "published", label: "Published", type: "bool" },
    ],
  },
  {
    id: "settings",
    label: "Contact & settings",
    description: "Email, phone, address and social links used across the site.",
    single: "site",
    fields: [
      { key: "email", label: "Public email", type: "email" },
      { key: "phone", label: "Phone number (shown prominently)", type: "text", help: "e.g. +966 5X XXX XXXX" },
      { key: "whatsapp", label: "WhatsApp number (digits only, with country code)", type: "text" },
      { key: "address", label: "Address", type: "text", i18n: true },
      { key: "hours", label: "Working hours", type: "text", i18n: true },
      { key: "linkedin", label: "LinkedIn page URL", type: "url" },
      { key: "x", label: "X (Twitter) URL", type: "url" },
      { key: "instagram", label: "Instagram URL", type: "url" },
      { key: "youtube", label: "YouTube URL", type: "url" },
    ],
  },
];

export const getCollection = (id: string) => COLLECTIONS.find((c) => c.id === id);

/** Collections that are stored but not edited through the generic forms. */
export const SYSTEM_COLLECTIONS = ["messages", "members"];

/* ---------- sanitising ---------- */

const str = (v: unknown, max = 20000) =>
  typeof v === "string" ? v.replace(/\u0000/g, "").slice(0, max) : "";

const safeUrl = (v: unknown) => {
  const s = str(v, 2000).trim();
  if (!s) return "";
  if (/^(https?:\/\/|\/|mailto:|tel:)/i.test(s)) return s;
  return "";
};

function sanitizeValue(f: Field, v: unknown): unknown {
  if (f.type === "list") {
    const arr = Array.isArray(v) ? v.slice(0, 100) : [];
    return arr.map((item) => sanitizeObject(f.fields ?? [], (item ?? {}) as Record<string, unknown>));
  }
  if (f.i18n) {
    const o = (v ?? {}) as Record<string, unknown>;
    return { ar: sanitizeScalar(f, o.ar), en: sanitizeScalar(f, o.en) };
  }
  return sanitizeScalar(f, v);
}

function sanitizeScalar(f: Field, v: unknown): unknown {
  switch (f.type) {
    case "number": {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    }
    case "bool":
      return v === true || v === "true";
    case "url":
    case "image":
      return safeUrl(v);
    case "email":
      return str(v, 200).trim();
    case "select": {
      const s = str(v, 100);
      return f.options?.some((o) => o.value === s) ? s : (f.options?.[0]?.value ?? "");
    }
    case "date": {
      const s = str(v, 20);
      return /^\d{4}-\d{2}-\d{2}$/.test(s) || s === "" ? s : "";
    }
    case "markdown":
      return str(v, 100000);
    case "textarea":
      return str(v, 5000);
    default:
      return str(v, 500);
  }
}

export function sanitizeObject(fields: Field[], input: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const f of fields) out[f.key] = sanitizeValue(f, input[f.key]);
  return out;
}

export function emptyValue(f: Field): unknown {
  if (f.type === "list") return [];
  if (f.i18n) return { ar: "", en: "" };
  if (f.type === "bool") return false;
  if (f.type === "number") return 0;
  if (f.type === "select") return f.options?.[0]?.value ?? "";
  return "";
}

export function emptyDoc(fields: Field[]): Record<string, unknown> {
  const o: Record<string, unknown> = {};
  for (const f of fields) o[f.key] = emptyValue(f);
  return o;
}
