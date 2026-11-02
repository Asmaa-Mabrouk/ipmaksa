"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteDoc, saveDoc, uploadImage } from "../../../actions";
import type { CollectionDef, Field } from "@/lib/content/schema";
import { emptyDoc } from "@/lib/content/schema";

type Obj = Record<string, unknown>;
const inputCls = "w-full rounded-xl border border-green-100 bg-white px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-gold-500";

function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true); setErr("");
    const fd = new FormData(); fd.set("file", file);
    const r = await uploadImage(fd);
    setBusy(false);
    if (r.url) onChange(r.url); else setErr(r.error || "Upload failed");
  }
  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {value && <img src={value} alt="" className="h-20 w-32 rounded-lg border border-green-100 object-cover" />}
        <label className="btn btn-green cursor-pointer !py-2 text-sm">{busy ? "Uploading…" : "Upload image"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} /></label>
        {value && <button type="button" onClick={() => onChange("")} className="text-sm font-bold text-red-700">Remove</button>}
      </div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="…or paste an image address (/images/… or https://…)" className={inputCls} dir="ltr" />
      {err && <p className="text-sm font-semibold text-red-700">{err}</p>}
    </div>
  );
}

function Scalar({ f, value, onChange, dir }: { f: Field; value: unknown; onChange: (v: unknown) => void; dir?: "rtl" | "ltr" }) {
  const v = value ?? "";
  switch (f.type) {
    case "textarea": return <textarea rows={3} dir={dir} value={String(v)} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
    case "markdown": return <textarea rows={12} dir={dir} value={String(v)} onChange={(e) => onChange(e.target.value)} className={inputCls + " font-mono text-sm"} />;
    case "number": return <input type="number" value={Number(v)} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
    case "date": return <input type="date" value={String(v)} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
    case "bool": return <label className="inline-flex items-center gap-2 font-semibold"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-green-700" /> Yes</label>;
    case "select": return <select value={String(v)} onChange={(e) => onChange(e.target.value)} className={inputCls}>{f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>;
    case "image": return <ImageInput value={String(v)} onChange={onChange} />;
    case "url": case "email": return <input type={f.type === "email" ? "email" : "text"} dir="ltr" value={String(v)} onChange={(e) => onChange(e.target.value)} className={inputCls} placeholder={f.type === "url" ? "https://…" : ""} />;
    default: return <input dir={dir} value={String(v)} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
  }
}

function FieldEditor({ f, value, onChange }: { f: Field; value: unknown; onChange: (v: unknown) => void }) {
  if (f.type === "list") {
    const items = (Array.isArray(value) ? value : []) as Obj[];
    const set = (next: Obj[]) => onChange(next);
    return (
      <div className="grid gap-3">
        <div>
          <p className="text-lg font-extrabold text-green-900">{f.label}</p>
          {f.help && <p className="text-xs text-ink/60">{f.help}</p>}
        </div>
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-green-100 bg-sand/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-bold text-green-900">{f.itemLabel ?? "Item"} {i + 1}</p>
              <div className="flex gap-3 text-sm font-bold">
                <button type="button" disabled={i === 0} onClick={() => { const n = [...items]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; set(n); }} className="text-green-700 disabled:opacity-30">↑</button>
                <button type="button" disabled={i === items.length - 1} onClick={() => { const n = [...items]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; set(n); }} className="text-green-700 disabled:opacity-30">↓</button>
                <button type="button" onClick={() => set(items.filter((_, j) => j !== i))} className="text-red-700">Remove</button>
              </div>
            </div>
            <div className="grid gap-4">
              {f.fields!.map((sf) => (
                <FieldEditor key={sf.key} f={sf} value={item[sf.key]} onChange={(v) => { const n = [...items]; n[i] = { ...item, [sf.key]: v }; set(n); }} />
              ))}
            </div>
          </div>
        ))}
        <button type="button" onClick={() => set([...items, emptyDoc(f.fields!)])} className="btn btn-outline justify-self-start !py-2 text-sm text-green-800">+ Add {f.itemLabel?.toLowerCase() ?? "item"}</button>
      </div>
    );
  }
  const body = f.i18n ? (
    <div className="grid gap-3 md:grid-cols-2">
      {(["ar", "en"] as const).map((l) => (
        <div key={l}>
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink/50">{l === "ar" ? "Arabic · العربية" : "English"}</p>
          <Scalar f={f} dir={l === "ar" ? "rtl" : "ltr"} value={(value as Obj | undefined)?.[l]} onChange={(v) => onChange({ ...(value as Obj), [l]: v })} />
        </div>
      ))}
    </div>
  ) : <Scalar f={f} value={value} onChange={onChange} />;
  return (
    <div>
      <p className="mb-1.5 font-bold text-green-900">{f.label}</p>
      {body}
      {f.help && <p className="mt-1 text-xs text-ink/60">{f.help}</p>}
    </div>
  );
}

export function Editor({ def, id, isNew, initial }: { def: CollectionDef; id: string; isNew: boolean; initial: Obj }) {
  const router = useRouter();
  const [doc, setDoc] = useState<Obj>(initial);
  const [newId, setNewId] = useState(id);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const save = () => start(async () => {
    setMsg(null);
    const r = await saveDoc(def.id, newId, doc, isNew);
    if (!r.ok) return setMsg({ ok: false, text: r.error || "Could not save" });
    setMsg({ ok: true, text: "Saved. The website is updated." });
    if (isNew && r.id) router.replace(`/admin/c/${def.id}/${r.id}`);
  });
  const del = () => {
    if (!confirm("Delete this item permanently?")) return;
    start(async () => { const r = await deleteDoc(def.id, id); if (r.ok) router.replace(`/admin/c/${def.id}`); else setMsg({ ok: false, text: r.error || "Could not delete" }); });
  };

  return (
    <div className="mt-6 grid gap-6 rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:p-8">
      {isNew && (
        <div>
          <p className="mb-1.5 font-bold text-green-900">Address / ID</p>
          <input dir="ltr" value={newId} onChange={(e) => setNewId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="for-example-new-item" className={inputCls} />
          <p className="mt-1 text-xs text-ink/60">Lowercase English letters, numbers and dashes. For pages and news this becomes the web address and cannot be changed later.</p>
        </div>
      )}
      {def.fields.map((f) => <FieldEditor key={f.key} f={f} value={doc[f.key]} onChange={(v) => setDoc((d) => ({ ...d, [f.key]: v }))} />)}
      <div className="sticky bottom-0 -mx-5 flex flex-wrap items-center gap-3 border-t border-green-100 bg-white/95 p-4 backdrop-blur sm:-mx-8 sm:px-8">
        <button type="button" onClick={save} disabled={pending} className="btn btn-green disabled:opacity-60">{pending ? "Saving…" : "Save changes"}</button>
        {!isNew && def.canDelete && <button type="button" onClick={del} disabled={pending} className="font-bold text-red-700">Delete</button>}
        {msg && <p role="status" className={"font-semibold " + (msg.ok ? "text-green-700" : "text-red-700")}>{msg.text}</p>}
      </div>
    </div>
  );
}
