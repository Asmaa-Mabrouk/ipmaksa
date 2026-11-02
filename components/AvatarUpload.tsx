"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { uploadPhoto } from "@/app/(site)/member-actions";
import { shrinkImage } from "@/lib/shrink-image";

export function AvatarUpload({ photo, initial, name, label, errorText }: { photo: string; initial: string; name: string; label: string; errorText: string }) {
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true); setErr("");
    try {
      const fd = new FormData();
      fd.set("photo", await shrinkImage(file));
      const r = await uploadPhoto(fd);
      if (r.ok) router.refresh(); else setErr(errorText);
    } catch {
      setErr(errorText);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">
      <div className="relative h-full w-full overflow-hidden rounded-full bg-green-700 ring-4 ring-gold-500">
        {photo ? <Image src={photo} alt={name} fill sizes="112px" className="object-cover" /> : <span className="flex h-full items-center justify-center text-4xl font-extrabold text-gold-300">{initial}</span>}
        {busy && <span className="absolute inset-0 flex items-center justify-center bg-green-950/60"><span className="h-8 w-8 animate-spin rounded-full border-4 border-white/40 border-t-white" /></span>}
      </div>
      <button
        type="button" onClick={() => input.current?.click()} disabled={busy} aria-label={label} title={label}
        className="absolute -bottom-1 end-0 flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 text-green-950 shadow-md ring-2 ring-green-900 transition hover:bg-gold-300 focus-visible:outline-2 focus-visible:outline-white disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
      </button>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" tabIndex={-1} onChange={(e) => pick(e.target.files?.[0])} />
      {err && <p role="alert" className="absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 rounded-lg bg-white px-3 py-2 text-center text-sm font-semibold text-red-700 shadow-lg">{err}</p>}
    </div>
  );
}
