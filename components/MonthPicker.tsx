"use client";

import { useEffect, useId, useRef, useState } from "react";

/** Friendly month picker: a button that opens a year + 12-month grid. Value is "YYYY-MM" (or ""). */
export function MonthPicker({ value, onChange, disabled, locale, placeholder, min = 1970, className = "" }: {
  value: string; onChange: (v: string) => void; disabled?: boolean; locale: string; placeholder: string; min?: number; className?: string;
}) {
  const [open, setOpen] = useState(false);
  const now = new Date();
  const [vy, vm] = value ? value.split("-").map(Number) : [0, 0];
  const [year, setYear] = useState(vy || now.getFullYear());
  const box = useRef<HTMLDivElement>(null);
  const id = useId();
  const fmt = (y: number, m: number) => new Intl.DateTimeFormat(locale === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB", { month: "long", year: "numeric" }).format(new Date(y, m - 1, 1));
  const short = (m: number) => new Intl.DateTimeFormat(locale === "ar" ? "ar-SA-u-ca-gregory" : "en-GB", { month: "short" }).format(new Date(2000, m - 1, 1));
  const max = now.getFullYear() + 1;

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  const nav = "flex h-9 w-9 items-center justify-center rounded-lg text-green-900 hover:bg-green-50 disabled:opacity-30";
  return (
    <div ref={box} className="relative">
      <button type="button" disabled={disabled} aria-haspopup="dialog" aria-expanded={open} aria-controls={id}
        onClick={() => { setYear(vy || now.getFullYear()); setOpen((o) => !o); }}
        className={`${className} flex items-center justify-between gap-2 text-start ${value ? "text-green-950" : "text-green-950/50"}`}>
        <span>{value ? fmt(vy, vm) : placeholder}</span>
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-green-800" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>
      </button>
      {open && (
        <div id={id} role="dialog" aria-label={placeholder} className="absolute start-0 z-30 mt-2 w-72 max-w-[88vw] rounded-2xl border border-green-900/15 bg-white p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <button type="button" className={nav} onClick={() => setYear((y) => y - 1)} disabled={year <= min} aria-label="−"><svg viewBox="0 0 24 24" className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg></button>
            <span className="text-lg font-extrabold text-green-900">{year}</span>
            <button type="button" className={nav} onClick={() => setYear((y) => y + 1)} disabled={year >= max} aria-label="+"><svg viewBox="0 0 24 24" className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg></button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
              const sel = year === vy && m === vm;
              const cur = year === now.getFullYear() && m === now.getMonth() + 1;
              return (
                <button key={m} type="button" onClick={() => { onChange(`${year}-${String(m).padStart(2, "0")}`); setOpen(false); }}
                  className={`rounded-xl px-2 py-2.5 text-sm font-bold transition ${sel ? "bg-green-900 text-gold-300" : "text-green-900 hover:bg-green-50"} ${cur && !sel ? "ring-1 ring-gold-500" : ""}`}>
                  {short(m)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
