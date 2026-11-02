import "server-only";
import { SEED } from "./seed";
import type { RawDoc, Store } from "./store";

/**
 * Supabase-backed store using the PostgREST + Storage HTTP APIs directly (no SDK, no extra JS).
 * Table:  public.documents (collection text, id text, data jsonb, updated_at timestamptz, pk(collection,id))
 * Bucket: media (public)
 * The service-role key is used server-side only. See supabase/schema.sql.
 */
export function createSupabaseStore(url: string, key: string): Store {
  const base = url.replace(/\/$/, "");
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };

  async function rows(collection: string, cache: RequestCache | undefined = "force-cache"): Promise<RawDoc[]> {
    const res = await fetch(
      `${base}/rest/v1/documents?collection=eq.${encodeURIComponent(collection)}&select=id,data`,
      { headers, cache, next: { tags: ["content"] } },
    );
    if (!res.ok) throw new Error(`Supabase read failed (${res.status})`);
    return (await res.json()) as RawDoc[];
  }

  async function upsert(collection: string, docs: RawDoc[]) {
    if (!docs.length) return;
    const res = await fetch(`${base}/rest/v1/documents?on_conflict=collection,id`, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(
        docs.map((d) => ({ collection, id: d.id, data: d.data, updated_at: new Date().toISOString() })),
      ),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Supabase write failed (${res.status}): ${await res.text()}`);
  }

  const seedDocs = (collection: string): RawDoc[] =>
    Object.entries(SEED[collection] ?? {}).map(([id, data]) => ({ id, data: data as Record<string, unknown> }));

  /** On the first edit of a seeded collection, copy the seed into the database so nothing disappears. */
  async function materialise(collection: string) {
    const existing = await rows(collection, "no-store");
    if (existing.length === 0) await upsert(collection, seedDocs(collection));
  }

  return {
    kind: "supabase",
    async list(collection) {
      const r = await rows(collection);
      return r.length ? r : seedDocs(collection);
    },
    async get(collection, id) {
      const r = await this.list(collection);
      return r.find((d) => d.id === id) ?? null;
    },
    async put(collection, id, data) {
      await materialise(collection);
      await upsert(collection, [{ id, data }]);
    },
    async remove(collection, id) {
      await materialise(collection);
      const res = await fetch(
        `${base}/rest/v1/documents?collection=eq.${encodeURIComponent(collection)}&id=eq.${encodeURIComponent(id)}`,
        { method: "DELETE", headers, cache: "no-store" },
      );
      if (!res.ok) throw new Error(`Supabase delete failed (${res.status})`);
    },
    async putFile(name, bytes, contentType) {
      const clean = `${Date.now()}-${name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const res = await fetch(`${base}/storage/v1/object/media/${clean}`, {
        method: "POST",
        headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": contentType },
        body: new Uint8Array(bytes),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status}): ${await res.text()}`);
      return `${base}/storage/v1/object/public/media/${clean}`;
    },
  };
}
