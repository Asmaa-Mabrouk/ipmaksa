import "server-only";
import { createFileStore } from "./file-store";
import { createPostgresStore } from "./postgres-store";
import { createSupabaseStore } from "./supabase-store";

export type RawDoc = { id: string; data: Record<string, unknown> };

export interface Store {
  readonly kind: "file" | "supabase" | "postgres";
  list(collection: string): Promise<RawDoc[]>;
  get(collection: string, id: string): Promise<RawDoc | null>;
  put(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  remove(collection: string, id: string): Promise<void>;
  /** Stores an uploaded file and returns its public URL. */
  putFile(name: string, bytes: Buffer, contentType: string): Promise<string>;
}

let instance: Store | null = null;

export function getStore(): Store {
  if (instance) return instance;
  if (process.env.DATABASE_URL) {
    instance = createPostgresStore(process.env.DATABASE_URL);
    return instance;
  }
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  instance = url && key ? createSupabaseStore(url, key) : createFileStore();
  return instance;
}
