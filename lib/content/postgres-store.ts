import "server-only";
import { Pool } from "pg";
import { SEED } from "./seed";
import type { RawDoc, Store } from "./store";

/**
 * PostgreSQL store. Works with any Postgres (local, Docker, Neon, Railway, RDS…).
 * Tables are created automatically on first use (see db/schema.sql for the same SQL).
 *   documents(collection, id, data jsonb)  – all content, members and messages
 *   media(id, content_type, data bytea)    – uploaded images, served from /media/<id>
 */
const globalForPg = globalThis as unknown as { __ipmaPool?: Pool; __ipmaReady?: Promise<void> };

const DDL = `
CREATE TABLE IF NOT EXISTS documents (
  collection text NOT NULL,
  id text NOT NULL,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (collection, id)
);
CREATE TABLE IF NOT EXISTS media (
  id text PRIMARY KEY,
  content_type text NOT NULL,
  data bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);`;

export function getPool(url: string): Pool {
  if (!globalForPg.__ipmaPool) {
    const ssl = /sslmode=require|ssl=true/.test(url) ? { rejectUnauthorized: false } : undefined;
    globalForPg.__ipmaPool = new Pool({ connectionString: url, max: 5, ssl });
  }
  return globalForPg.__ipmaPool;
}

export function createPostgresStore(url: string): Store {
  const pool = getPool(url);
  const ready = () => (globalForPg.__ipmaReady ??= pool.query(DDL).then(() => undefined));

  const seedDocs = (c: string): RawDoc[] =>
    Object.entries(SEED[c] ?? {}).map(([id, data]) => ({ id, data: data as Record<string, unknown> }));

  async function rows(c: string): Promise<RawDoc[]> {
    await ready();
    const r = await pool.query("SELECT id, data FROM documents WHERE collection = $1", [c]);
    return r.rows as RawDoc[];
  }
  async function upsert(c: string, id: string, data: Record<string, unknown>) {
    await pool.query(
      `INSERT INTO documents (collection, id, data) VALUES ($1, $2, $3)
       ON CONFLICT (collection, id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      [c, id, JSON.stringify(data)],
    );
  }
  /** On the first edit of a seeded collection, copy the starter content into the database. */
  async function materialise(c: string) {
    if ((await rows(c)).length === 0) for (const d of seedDocs(c)) await upsert(c, d.id, d.data);
  }

  return {
    kind: "postgres",
    async list(c) {
      const r = await rows(c);
      return r.length ? r : seedDocs(c);
    },
    async get(c, id) {
      return (await this.list(c)).find((d) => d.id === id) ?? null;
    },
    async put(c, id, data) {
      await materialise(c);
      await upsert(c, id, data);
    },
    async remove(c, id) {
      await materialise(c);
      await pool.query("DELETE FROM documents WHERE collection = $1 AND id = $2", [c, id]);
    },
    async putFile(name, bytes, contentType) {
      await ready();
      const id = `${Date.now().toString(36)}-${name.replace(/[^a-zA-Z0-9.-]/g, "-").slice(-60)}`;
      await pool.query("INSERT INTO media (id, content_type, data) VALUES ($1, $2, $3)", [id, contentType, bytes]);
      return `/media/${id}`;
    },
  };
}

export async function readMedia(url: string, id: string) {
  const pool = getPool(url);
  await (globalForPg.__ipmaReady ??= pool.query(DDL).then(() => undefined));
  const r = await pool.query("SELECT content_type, data FROM media WHERE id = $1", [id]);
  return r.rows[0] as { content_type: string; data: Buffer } | undefined;
}
