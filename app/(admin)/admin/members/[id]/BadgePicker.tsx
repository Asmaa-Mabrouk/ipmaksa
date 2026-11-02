"use client";
import { useState, useTransition } from "react";
import { setMemberBadges } from "../../actions";

export function BadgePicker({ id, badges, awarded }: { id: string; badges: { id: string; title: string }[]; awarded: { id: string; note: string }[] }) {
  const [on, setOn] = useState<Set<string>>(new Set(awarded.map((a) => a.id)));
  const [notes, setNotes] = useState<Record<string, string>>(Object.fromEntries(awarded.map((a) => [a.id, a.note])));
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();
  return (
    <div className="mt-4 grid gap-3">
      {badges.map((b) => (
        <div key={b.id} className="rounded-xl border border-green-100 bg-white p-4">
          <label className="flex items-center gap-3 font-bold text-green-900">
            <input type="checkbox" checked={on.has(b.id)} className="h-5 w-5 accent-green-700" onChange={(e) => setOn((s) => { const n = new Set(s); if (e.target.checked) n.add(b.id); else n.delete(b.id); return n; })} />
            {b.title}
          </label>
          {on.has(b.id) && <input placeholder="Optional note (for example certificate number)" value={notes[b.id] ?? ""} onChange={(e) => setNotes((n) => ({ ...n, [b.id]: e.target.value }))} className="mt-3 w-full rounded-lg border border-green-100 px-3 py-2" />}
        </div>
      ))}
      {!badges.length && <p className="text-ink/60">No badge types yet.</p>}
      <div className="flex items-center gap-4">
        <button disabled={pending} onClick={() => start(async () => { const r = await setMemberBadges(id, [...on], notes); setMsg(r.ok ? "Saved." : "Could not save."); })} className="btn btn-green disabled:opacity-60">{pending ? "Saving…" : "Save badges"}</button>
        {msg && <p role="status" className="font-semibold text-green-700">{msg}</p>}
      </div>
    </div>
  );
}
