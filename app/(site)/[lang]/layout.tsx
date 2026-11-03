import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../../globals.css";
import { Footer, Header, TopBar } from "@/components/SiteChrome";
import { JsonLd } from "@/components/JsonLd";
import { getSettings } from "@/lib/content/api";
import { LOCALES, dir, getDict, isLocale } from "@/lib/i18n";
import { NOINDEX, orgJsonLd } from "@/lib/seo";

export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://ipmaksa.world";
export const viewport: Viewport = { themeColor: "#10332a", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return {
    metadataBase: new URL(SITE),
    title: { default: d.siteName + " | " + d.tagline, template: "%s | " + d.siteName },
    description: lang === "ar"
      ? "IPMA السعودية: الممثل الرسمي للجمعية الدولية لإدارة المشاريع في المملكة. شهادات IPMA للكفاءة (المستويات A وB وC وD)، مواعيد الاختبارات، وملتقى المشاريع."
      : "IPMA KSA is the official national member of the International Project Management Association in Saudi Arabia: IPMA competence certification (Levels A, B, C, D), exam dates and the Project Connect community.",
    applicationName: d.siteName,
    keywords: lang === "ar"
      ? ["IPMA السعودية", "شهادة IPMA", "إدارة المشاريع", "شهادة إدارة المشاريع في السعودية", "ICB4", "ملتقى المشاريع"]
      : ["IPMA KSA", "IPMA certification Saudi Arabia", "project management certification", "ICB4", "IPMA Level D", "Project Connect"],
    robots: NOINDEX ? { index: false, follow: false } : { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } },
    alternates: { canonical: `/${lang}`, languages: { ar: "/ar", en: "/en", "x-default": "/ar" } },
    openGraph: { siteName: d.siteName, locale: lang === "ar" ? "ar_SA" : "en_US", type: "website", images: [{ url: "/images/hero-village.webp", alt: d.siteName }] },
    twitter: { card: "summary_large_image", images: ["/images/hero-village.webp"] },
    icons: { icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon.png", type: "image/png", sizes: "512x512" }], apple: "/apple-touch-icon.png" },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const settings = await getSettings();
  return (
    <html lang={lang} dir={dir(lang)}>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={orgJsonLd(settings, lang)} />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-gold-500 focus:p-3">{d.skip}</a>
        <TopBar locale={lang} />
        <Header locale={lang} />
        <main id="main" className="flex-1">{children}</main>
        <Footer locale={lang} />
      </body>
    </html>
  );
}
