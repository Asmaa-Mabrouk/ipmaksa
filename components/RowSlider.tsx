"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/** A plain row of cards that scrolls: 5 across on large screens, fewer on small ones. Works in RTL. */
export function RowSlider({ slides, label, prev, next }: { slides: ReactNode[]; label: string; prev: string; next: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    setEdge({ start: pos < 4, end: max - pos < 4 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: dir * (rtl ? -1 : 1) * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const arrow = "flex h-11 w-11 items-center justify-center rounded-xl border border-green-900/30 bg-white text-green-900 transition hover:bg-green-900 hover:text-gold-300 disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-green-900";
  const hasMore = !(edge.start && edge.end);

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <ul ref={track} onScroll={measure} tabIndex={0} className="-mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {slides.map((s, i) => (
          <li key={i} aria-roledescription="slide" aria-label={`${i + 1} / ${slides.length}`} className="w-[70%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] md:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-5rem)/5)]">
            {s}
          </li>
        ))}
      </ul>
      {hasMore && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <button type="button" className={arrow} onClick={() => go(-1)} disabled={edge.start} aria-label={prev}>
            <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" className={arrow} onClick={() => go(1)} disabled={edge.end} aria-label={next}>
            <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
