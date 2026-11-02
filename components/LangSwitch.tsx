"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

/** Shows the flag of the OTHER language. One click switches and remembers the choice. */
export function LangSwitch({ locale, label, text }: { locale: "ar" | "en"; label: string; text: string }) {
  const pathname = usePathname() || `/${locale}`;
  const other = locale === "ar" ? "en" : "ar";
  const target = pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${other}`) || `/${other}`;
  return (
    <Link
      href={target}
      hrefLang={other}
      lang={other}
      aria-label={label}
      title={label}
      onClick={() => {
        try { document.cookie = `lang=${other}; path=/; max-age=31536000; samesite=lax`; } catch {}
      }}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 transition hover:bg-white/10"
    >
      <Image src={other === "ar" ? "/flags/sa.svg" : "/flags/gb.svg"} alt="" width={24} height={18} className="h-[18px] w-6 rounded-[3px] object-cover" unoptimized />
      <span className="sr-only">{text}</span>
    </Link>
  );
}
