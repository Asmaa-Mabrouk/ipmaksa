"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";

type Country = { code: string; name: string };

/** Arabic/English friendly search: ignore case, diacritics and alef/ya/ta-marbuta variants. */
const norm = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[ً-ٟ̀-ͯ]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");

/** Site-styled, searchable country picker (replaces the browser's own dropdown). */
export function CountrySelect({ name, countries, defaultValue = "", placeholder, searchPlaceholder, noMatch, required = false }: {
  name: string; countries: Country[]; defaultValue?: string; placeholder: string; searchPlaceholder: string; noMatch: string; required?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();

  const shown = useMemo(() => { const n = norm(q.trim()); return n ? countries.filter((c) => norm(c.name).includes(n)) : countries; }, [q, countries]);
  const selected = countries.find((c) => c.code === value);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent | TouchEvent) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", away); document.addEventListener("touchstart", away);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("touchstart", away); };
  }, [open]);

  useEffect(() => { if (open) { search.current?.focus(); list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" }); } }, [open]);
  useEffect(() => { list.current?.children[active]?.scrollIntoView({ block: "nearest" }); }, [active]);

  const openList = () => { setQ(""); setActive(Math.max(0, countries.findIndex((c) => c.code === value))); setOpen(true); };
  const pick = (c: Country) => { setValue(c.code); setOpen(false); (root.current?.querySelector("button") as HTMLButtonElement | null)?.focus(); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, shown.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (shown[active]) pick(shown[active]); }
  };

  return (
    <div ref={root} className="relative">
      <input type="hidden" name={name} value={value} />
      {required && <input tabIndex={-1} aria-hidden="true" required value={value} onChange={() => {}} className="pointer-events-none absolute inset-0 h-full w-full opacity-0" />}
      <button
        type="button" aria-haspopup="listbox" aria-expanded={open} aria-controls={id}
        onClick={() => (open ? setOpen(false) : openList())}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-green-100 bg-white px-4 py-3 text-start text-base outline-none transition focus-visible:ring-2 focus-visible:ring-gold-500"
      >
        <span className={selected ? "text-ink" : "text-ink/50"}>{selected ? selected.name : placeholder}</span>
        <svg viewBox="0 0 20 20" className={"h-5 w-5 shrink-0 text-green-700 transition " + (open ? "rotate-180" : "")} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 8 5 5 5-5" /></svg>
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-green-100 bg-white shadow-[0_12px_32px_-8px_rgba(16,51,42,.28)]">
          <div className="border-b border-green-100 bg-sand/60 p-2">
            <input
              ref={search} value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onKey}
              placeholder={searchPlaceholder} aria-label={searchPlaceholder} autoComplete="off" role="combobox" aria-expanded="true" aria-controls={id}
              className="w-full rounded-lg border border-green-100 bg-white px-3 py-2 text-base outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          <ul ref={list} id={id} role="listbox" className="max-h-64 overflow-y-auto overscroll-contain py-1">
            {shown.map((c, i) => (
              <li
                key={c.code} role="option" aria-selected={c.code === value}
                onMouseEnter={() => setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(c)}
                className={"flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 " + (i === active ? "bg-green-50 " : "") + (c.code === value ? "font-bold text-green-900" : "text-ink")}
              >
                <span>{c.name}</span>
                {c.code === value && <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-gold-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 10 4 4 8-8" /></svg>}
              </li>
            ))}
            {!shown.length && <li className="px-4 py-3 text-ink/60">{noMatch}</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
