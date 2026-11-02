import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../../globals.css";
import { Footer, Header, TopBar } from "@/components/SiteChrome";
import { LOCALES, dir, getDict, isLocale } from "@/lib/i18n";

export const dynamicParams = false;
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
    description: d.tagline,
    alternates: { languages: { ar: "/ar", en: "/en" } },
    openGraph: { siteName: d.siteName, locale: lang === "ar" ? "ar_SA" : "en_US", type: "website", images: ["/images/hero-village.webp"] },
    icons: { icon: "/flags/sa.svg" },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  return (
    <html lang={lang} dir={dir(lang)}>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-gold-500 focus:p-3">{d.skip}</a>
        <TopBar locale={lang} />
        <Header locale={lang} />
        <main id="main" className="flex-1">{children}</main>
        <Footer locale={lang} />
      </body>
    </html>
  );
}
