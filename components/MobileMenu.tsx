"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

export type MobileItem = { label: string; href?: string; children?: { label: string; href: string }[] };

/** Phone menu: main items only; groups open on tap; closes on outside tap, Escape or navigation. */
export function MobileMenu({ items, label, cta, ctaHref }: { items: MobileItem[]; label: string; cta: string; ctaHref: string }) {
  const [openAt, setOpenAt] = useState<string | null>(null);
  const [group, setGroup] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const open = openAt === path; // a page change closes the menu by itself
  const setOpen = (v: boolean | ((o: boolean) => boolean)) => {
    const next = typeof v === "function" ? v(open) : v;
    setOpenAt(next ? path : null);
    if (!next) setGroup(null);
  };
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", down); document.removeEventListener("keydown", key); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div ref={box} className="min-[1320px]:hidden">
      <button type="button" aria-label={label} aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-white/10">
        <Icon name={open ? "x" : "menu"} className="h-7 w-7" />
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full max-h-[80vh] overflow-y-auto border-t border-white/10 bg-green-900 px-4 pb-6 pt-2 shadow-xl">
          <ul className="mx-auto max-w-7xl">
            {items.map((m, i) => (
              <li key={m.label} className="border-b border-white/10">
                {m.children ? (
                  <>
                    <button type="button" aria-expanded={group === i} onClick={() => setGroup(group === i ? null : i)} className="flex w-full items-center justify-between py-3 text-start font-bold text-white">
                      {m.label}
                      <Icon name="chevron" className={`h-5 w-5 text-gold-300 transition ${group === i ? "rotate-180" : ""}`} />
                    </button>
                    {group === i && (
                      <ul className="mb-3 rounded-xl bg-black/20 p-1">
                        {m.children.map((c) => (
                          <li key={c.href}><Link href={c.href} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/10">{c.label}</Link></li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link href={m.href!} className="block py-3 font-bold text-white">{m.label}</Link>
                )}
              </li>
            ))}
          </ul>
          <Link href={ctaHref} className="btn btn-gold mx-auto mt-4 flex w-full max-w-7xl">{cta}</Link>
        </div>
      )}
    </div>
  );
}
