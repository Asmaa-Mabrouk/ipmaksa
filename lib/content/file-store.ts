import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { SEED } from "./seed";
import type { RawDoc, Store } from "./store";

/**
 * File-backed store for local development and simple self-hosting.
 * Collections live in ./content-data/<collection>.json. Until a collection is first edited,
 * the built-in seed content is served, so the site works out of the box.
 */
const DATA_DIR = path.join(process.cwd(), "content-data");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const safe = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");

async function readCollection(collection: string): Promise<RawDoc[]> {
  const file = path.join(DATA_DIR, `${safe(collection)}.json`);
  try {
    const raw = await fs.readFile(file, "utf8");
    const obj = JSON.parse(raw) as Record<string, Record<string, unknown>>;
    return Object.entries(obj).map(([id, data]) => ({ id, data }));
  } catch {
    const seed = SEED[collection] ?? {};
    return Object.entries(seed).map(([id, data]) => ({ id, data: data as Record<string, unknown> }));
  }
}

async function writeCollection(collection: string, docs: RawDoc[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const obj: Record<string, Record<string, unknown>> = {};
  for (const d of docs) obj[d.id] = d.data;
  await fs.writeFile(
    path.join(DATA_DIR, `${safe(collection)}.json`),
    JSON.stringify(obj, null, 2),
    "utf8",
  );
}

export function createFileStore(): Store {
  return {
    kind: "file",
    list: readCollection,
    async get(collection, id) {
      const docs = await readCollection(collection);
      return docs.find((d) => d.id === id) ?? null;
    },
    async put(collection, id, data) {
      const docs = await readCollection(collection);
      const i = docs.findIndex((d) => d.id === id);
      if (i >= 0) docs[i] = { id, data };
      else docs.push({ id, data });
      await writeCollection(collection, docs);
    },
    async remove(collection, id) {
      const docs = (await readCollection(collection)).filter((d) => d.id !== id);
      await writeCollection(collection, docs);
    },
    async putFile(name, bytes) {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      await fs.writeFile(path.join(UPLOAD_DIR, safe(name.replace(/\.[^.]+$/, "")) + path.extname(name).toLowerCase()), bytes);
      return `/uploads/${safe(name.replace(/\.[^.]+$/, ""))}${path.extname(name).toLowerCase()}`;
    },
  };
}
