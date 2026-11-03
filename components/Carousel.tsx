"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/** Centre-focused scroll-snap slider. Direction-agnostic (works in RTL), keyboard and touch friendly. */
export function Carousel({ slides, label, prev, next, slideClass = "w-[78%] sm:w-[22rem]" }: { slides: ReactNode[]; label: string; prev: string; next: string; slideClass?: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const mid = el.getBoundingClientRect().left + el.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const go = (i: number) => {
    const el = track.current?.children[Math.max(0, Math.min(slides.length - 1, i))] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  const arrow = "flex h-11 w-11 items-center justify-center rounded-sm border border-green-900/30 bg-white text-green-900 transition hover:bg-green-900 hover:text-gold-300 disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-green-900";

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <ul ref={track} onScroll={update} tabIndex={0}
        className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[11%] pb-4 pt-2 [scrollbar-width:none] sm:-mx-6 sm:px-[calc(50%-11rem)] [&::-webkit-scrollbar]:hidden">
        {slides.map((s, i) => (
          <li key={i} aria-roledescription="slide" aria-label={`${i + 1} / ${slides.length}`}
            className={"shrink-0 snap-center transition duration-300 motion-reduce:transition-none " + slideClass + (i === active ? "" : " scale-[0.94] opacity-55")}>
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-center gap-4">
        <button type="button" className={arrow} onClick={() => go(active - 1)} disabled={active === 0} aria-label={prev}>
          <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {slides.map((_, i) => (
            <button key={i} type="button" tabIndex={-1} onClick={() => go(i)} className={"h-1.5 rounded-none transition-all " + (i === active ? "w-10 bg-gold-500" : "w-5 bg-green-900/20 hover:bg-green-900/40")} />
          ))}
        </div>
        <button type="button" className={arrow} onClick={() => go(active + 1)} disabled={active === slides.length - 1} aria-label={next}>
          <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
