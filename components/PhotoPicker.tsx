"use client";
import { useRef, useState } from "react";
import { shrinkImage } from "@/lib/shrink-image";

/** Small "choose photo" button. Never shows the file's own name; the picture is shrunk before it is sent. */
export function PhotoPicker({ name, label, selected, remove, errorText }: { name: string; label: string; selected: string; remove: string; errorText: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<"none" | "busy" | "ready" | "error">("none");

  async function pick(file: File | undefined) {
    if (!file || !input.current) return;
    setState("busy");
    try {
      const small = await shrinkImage(file);
      const dt = new DataTransfer();
      dt.items.add(small);
      input.current.files = dt.files;
      setState("ready");
    } catch {
      input.current.value = "";
      setState("error");
    }
  }
  const clear = () => { if (input.current) input.current.value = ""; setState("none"); };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={() => input.current?.click()} disabled={state === "busy"}
        className="inline-flex items-center gap-2 rounded-full border border-green-700 px-4 py-2 text-sm font-bold text-green-800 transition hover:bg-green-50 disabled:opacity-60">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V4m0 0 4 4m-4-4L8 8" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
        {label}
      </button>
      <input ref={input} name={name} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" tabIndex={-1}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) pick(f); }} />
      {state === "ready" && (
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-700">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 10 4 4 8-8" /></svg>
          {selected}
          <button type="button" onClick={clear} className="font-bold text-red-700 underline">{remove}</button>
        </span>
      )}
      {state === "error" && <span role="alert" className="text-sm font-semibold text-red-700">{errorText}</span>}
    </div>
  );
}
