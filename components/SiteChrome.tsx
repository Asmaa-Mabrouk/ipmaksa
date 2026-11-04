import Image from "next/image";
import Link from "next/link";
import { Icon } from "./Icon";
import { LangSwitch } from "./LangSwitch";
import { MobileMenu, type MobileItem } from "./MobileMenu";
import { getDict, t } from "@/lib/i18n";
import { getPages, getSettings } from "@/lib/content/api";
import type { Locale } from "@/lib/content/types";

export const telHref = (p: string) => "tel:" + p.replace(/[^\d+]/g, "");

export async function TopBar({ locale }: { locale: Locale }) {
  const s = await getSettings();
  const d = getDict(locale);
  return (
    <div className="bg-green-950 text-sm text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <a href={`mailto:${s.email}`} className="inline-flex items-center gap-2 font-semibold hover:text-gold-300">
            <Icon name="mail" className="h-4 w-4 text-gold-500" />
            <span dir="ltr">{s.email}</span>
          </a>
          {s.phone && (
            <a href={telHref(s.phone)} className="inline-flex items-center gap-2 font-semibold hover:text-gold-300">
              <Icon name="phone" className="h-4 w-4 text-gold-500" />
              <span dir="ltr">{s.phone}</span>
            </a>
          )}
        </div>
        <span className="hidden text-white/70 md:inline">{d.tagline}</span>
      </div>
    </div>
  );
}

const NAV_FEATURED = "whitespace-nowrap rounded-full border border-gold-500/70 bg-gold-500/15 px-3 py-1.5 font-bold text-gold-300 transition hover:bg-gold-500 hover:text-green-950";
const NAV_LINK = "whitespace-nowrap rounded-lg px-2.5 py-2 font-bold text-white transition hover:bg-white/10 hover:text-gold-300";

function Menu({ label, items, base, locale, featured }: { label: string; items: { id: string; href?: string; data: { title: { ar: string; en: string } } }[]; base: string; locale: Locale; featured?: boolean }) {
  return (
    <div className="group relative">
      <button type="button" className={`${featured ? NAV_FEATURED : NAV_LINK} inline-flex items-center gap-1`} aria-haspopup="true">
        {label}
        <Icon name="chevron" className="h-4 w-4" />
      </button>
      <div className="invisible absolute start-0 top-full z-50 min-w-72 translate-y-1 rounded-2xl border border-green-100 bg-white p-2 opacity-0 shadow-xl transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        {items.map((p) => (
          <Link key={p.id} href={p.href ?? `${base}/${p.id}`} className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-green-900 hover:bg-green-50">
            {t(p.data.title, locale)}
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function Header({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const pages = await getPages();
  const grp = (g: string) => pages.filter((p) => p.data.group === g);
  const base = `/${locale}`;
  const about = grp("about");
  const journeyItem = { id: "certification-journey", data: { title: { ar: d.nav.journey, en: d.nav.journey } } } as unknown as (typeof pages)[number];
  const cert = [...grp("certification"), journeyItem];
  const link = NAV_LINK;
  const pc = [
    { id: "pc-podcast", href: `${base}/project-connect`, data: { title: { ar: d.magazine.nav.podcast, en: d.magazine.nav.podcast } } },
    { id: "pc-about", href: `${base}/project-connect/magazine`, data: { title: { ar: d.magazine.nav.about, en: d.magazine.nav.about } } },
    { id: "pc-articles", href: `${base}/project-connect/magazine/articles`, data: { title: { ar: d.magazine.nav.articles, en: d.magazine.nav.articles } } },
    { id: "pc-guidelines", href: `${base}/project-connect/magazine/guidelines`, data: { title: { ar: d.magazine.nav.guidelines, en: d.magazine.nav.guidelines } } },
  ];

  const kids = (list: typeof about) => list.map((p) => ({ label: t(p.data.title, locale), href: `${base}/${p.id}` }));
  const mobile: MobileItem[] = [
    { label: d.nav.home, href: base },
    { label: d.nav.about, children: kids(about) },
    { label: d.nav.certification, children: kids(cert) },
    { label: d.nav.examDates, href: `${base}/exam-dates` },
    { label: d.nav.projectConnect, featured: true, children: pc.map((i) => ({ label: t(i.data.title, locale), href: i.href })) },
    { label: d.nav.membership, href: `${base}/membership` },
    { label: d.nav.team, href: `${base}#team` },
    { label: d.nav.news, href: `${base}/news` },
    { label: d.nav.contact, href: `${base}/contact` },
    { label: d.account.signIn, href: `${base}/login` },
    { label: d.account.register, href: `${base}/register` },
  ];

  return (
    <header className="sticky top-0 z-40 bg-green-900 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6">
        <Link href={base} aria-label={d.siteName} className="shrink-0">
          <Image src="/images/logo-white.png" alt={d.siteName} width={1378} height={321} priority className="h-8 w-auto min-[400px]:h-10 sm:h-12" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-0.5 text-[0.9rem] min-[1320px]:flex">
          <Link href={base} className={link}>{d.nav.home}</Link>
          <Menu label={d.nav.about} items={about} base={base} locale={locale} />
          <Menu label={d.nav.certification} items={cert} base={base} locale={locale} />
          <Link href={`${base}/exam-dates`} className={link}>{d.nav.examDates}</Link>
          <Menu label={d.nav.projectConnect} items={pc} base={base} locale={locale} featured />
          <Link href={`${base}/membership`} className={link}>{d.nav.membership}</Link>
          <Link href={`${base}#team`} className={link}>{d.nav.team}</Link>
          <Link href={`${base}/news`} className={link}>{d.nav.news}</Link>
          <Link href={`${base}/contact`} className={link}>{d.nav.contact}</Link>
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch locale={locale} label={d.switchLabel} text={d.switchTo} />
          <Link href={`${base}/login`} aria-label={d.account.signIn} title={d.account.signIn} className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white/10 sm:flex"><Icon name="user" className="h-5 w-5" /></Link>
          <span className="hidden sm:block"><Link href={`${base}/register`} className="btn btn-gold whitespace-nowrap !py-2">{d.joinCta}</Link></span>
          <MobileMenu items={mobile} label={d.menu} cta={d.joinCta} ctaHref={`${base}/register`} />
        </div>
      </div>
      <div className="najdi" aria-hidden="true" />
    </header>
  );
}

export async function Footer({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const s = await getSettings();
  const pages = await getPages();
  const base = `/${locale}`;
  const social = [
    ["linkedin", s.linkedin, "LinkedIn"],
    ["x", s.x, "X"],
    ["instagram", s.instagram, "Instagram"],
    ["youtube", s.youtube, "YouTube"],
    ["whatsapp", s.whatsappChannel, locale === "ar" ? "قناة واتساب" : "WhatsApp channel"],
  ].filter((x) => x[1]);
  const links = [
    [d.nav.about, `${base}/about-us`],
    [d.nav.certification, `${base}/ipma-standards`],
    [d.nav.journey, `${base}/certification-journey`],
    [d.nav.examDates, `${base}/exam-dates`],
    [d.nav.projectConnect, `${base}/project-connect`],
    [d.magazine.name, `${base}/project-connect/magazine`],
    [d.nav.membership, `${base}/membership`],
    [d.nav.team, `${base}#team`],
    [d.nav.news, `${base}/news`],
    [d.nav.contact, `${base}/contact`],
  ];
  const privacy = pages.find((p) => p.id === "privacy-policy");
  return (
    <footer className="bg-green-950 text-white">
      <div className="najdi" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <Image src="/images/logo-white.png" alt={d.siteName} width={1378} height={321} className="h-12 w-auto" />
          <p className="mt-4 max-w-sm text-white/75">{d.tagline}</p>
          <p className="mt-3 max-w-sm text-sm text-white/60">{d.footer.independence}</p>
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-gold-300">{d.footer.explore}</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
            {links.map(([label, href]) => (
              <li key={href}><Link href={href} className="text-white/85 hover:text-gold-300">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-gold-300">{d.footer.contact}</h2>
          <ul className="mt-4 grid gap-3 text-white/90">
            <li><a href={`mailto:${s.email}`} className="inline-flex items-center gap-2 hover:text-gold-300"><Icon name="mail" className="h-5 w-5 text-gold-500" /><span dir="ltr">{s.email}</span></a></li>
            {s.phone && <li><a href={telHref(s.phone)} className="inline-flex items-center gap-2 hover:text-gold-300"><Icon name="phone" className="h-5 w-5 text-gold-500" /><span dir="ltr">{s.phone}</span></a></li>}
            {t(s.address, locale) && <li className="inline-flex items-start gap-2"><Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />{t(s.address, locale)}</li>}
          </ul>
          {social.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-white/70">{d.footer.follow}</p>
              <div className="mt-2 flex gap-2">
                {social.map(([n, url, label]) => (
                  <a key={n} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-gold-500 hover:text-green-950">
                    <Icon name={n} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-white/60">
        © {new Date().getFullYear()} {d.siteName}. {d.footer.rights}
        {privacy && <> · <Link href={`${base}/privacy-policy`} className="underline hover:text-gold-300">{d.footer.privacy}</Link></>}
      </div>
    </footer>
  );
}
