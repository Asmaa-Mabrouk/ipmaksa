import type { Metadata } from "next";
import type { Locale, SiteSettings } from "@/lib/content/types";

export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://ipmaksa.world").replace(/\/$/, "");
/** Staging/preview copies must never be indexed. Set SITE_ENV=staging there. */
export const NOINDEX = process.env.SITE_ENV === "staging";
export const DEFAULT_OG = "/images/hero-village.webp";

/** Per-page metadata: unique title/description, canonical, hreflang (+x-default), Open Graph and Twitter card. */
export function pageMeta(o: { lang: Locale; path: string; title?: string; description?: string; image?: string; type?: "website" | "article"; noindex?: boolean; publishedTime?: string }): Metadata {
  const p = o.path === "/" ? "" : o.path;
  const url = `/${o.lang}${p}`;
  const img = o.image || DEFAULT_OG;
  return {
    title: o.title,
    description: o.description,
    alternates: { canonical: url, languages: { ar: `/ar${p}`, en: `/en${p}`, "x-default": `/ar${p}` } },
    openGraph: {
      type: o.type ?? "website",
      url,
      siteName: o.lang === "ar" ? "IPMA السعودية" : "IPMA KSA",
      locale: o.lang === "ar" ? "ar_SA" : "en_US",
      alternateLocale: o.lang === "ar" ? "en_US" : "ar_SA",
      title: o.title,
      description: o.description,
      images: [{ url: img, alt: o.title || "IPMA KSA" }],
      ...(o.publishedTime ? { publishedTime: o.publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: o.title, description: o.description, images: [img] },
    ...(o.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export const abs = (u: string) => (u.startsWith("http") ? u : `${SITE}${u.startsWith("/") ? "" : "/"}${u}`);

/** Organisation + WebSite entity. This is what search engines and AI assistants use to identify the association. */
export function orgJsonLd(s: SiteSettings, lang: Locale) {
  const sameAs = [s.linkedin, s.x, s.instagram, s.youtube, s.whatsappChannel].filter(Boolean);
  const name = lang === "ar" ? "IPMA السعودية" : "IPMA KSA";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "EducationalOrganization"],
        "@id": `${SITE}/#org`,
        name,
        alternateName: lang === "ar" ? ["IPMA KSA", "الجمعية الدولية لإدارة المشاريع - السعودية"] : ["IPMA Saudi Arabia", "International Project Management Association Kingdom of Saudi Arabia"],
        url: SITE,
        logo: abs("/icon.png"),
        image: abs(DEFAULT_OG),
        description: lang === "ar"
          ? "الجهة الممثلة للجمعية الدولية لإدارة المشاريع (IPMA) في المملكة العربية السعودية: شهادات IPMA للكفاءة في إدارة المشاريع وملتقى المشاريع."
          : "The national member of the International Project Management Association (IPMA) in Saudi Arabia: IPMA project management competence certification and the Project Connect community.",
        email: s.email,
        telephone: s.phone,
        address: { "@type": "PostalAddress", addressLocality: "Dhahran", addressCountry: "SA" },
        areaServed: { "@type": "Country", name: "Saudi Arabia" },
        memberOf: { "@type": "Organization", name: "International Project Management Association (IPMA)", url: "https://ipma.world" },
        knowsAbout: ["IPMA certification", "Project management", "IPMA Individual Competence Baseline (ICB4)", "IPMA Level A, B, C, D"],
        contactPoint: [{ "@type": "ContactPoint", contactType: "customer support", email: s.email, telephone: s.phone, availableLanguage: ["Arabic", "English"], areaServed: "SA" }],
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name,
        inLanguage: ["ar", "en"],
        publisher: { "@id": `${SITE}/#org` },
      },
    ],
  };
}

export function breadcrumbJsonLd(lang: Locale, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE}/${lang}${it.path === "/" ? "" : it.path}` })),
  };
}
