"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { login, logout, requireAdmin } from "@/lib/auth";
import { getCollection, sanitizeObject } from "@/lib/content/schema";
import { getStore } from "@/lib/content/store";

const SLUG = /^[a-z0-9][a-z0-9-]{0,80}$/;
const refresh = () => revalidatePath("/", "layout");

export async function loginAction(_: { error?: string }, fd: FormData) {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
  const r = await login(String(fd.get("email") || ""), String(fd.get("password") || ""), ip);
  if (!r.ok) return { error: r.reason === "throttled" ? "Too many attempts. Try again in 15 minutes." : "Incorrect email or password." };
  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

export type SaveResult = { ok: boolean; error?: string; id?: string };

export async function saveDoc(collection: string, id: string, data: Record<string, unknown>, isNew: boolean): Promise<SaveResult> {
  await requireAdmin();
  const def = getCollection(collection);
  if (!def) return { ok: false, error: "Unknown collection" };
  const docId = def.single ?? id;
  if (!SLUG.test(docId)) return { ok: false, error: "The address (ID) may only contain lowercase letters, numbers and dashes." };
  const store = getStore();
  if (isNew && !def.single && (await store.get(collection, docId))) return { ok: false, error: "An item with this ID already exists." };
  await store.put(collection, docId, sanitizeObject(def.fields, data));
  refresh();
  return { ok: true, id: docId };
}

export async function deleteDoc(collection: string, id: string): Promise<SaveResult> {
  await requireAdmin();
  const def = getCollection(collection);
  if (!def || !def.canDelete || !SLUG.test(id)) return { ok: false, error: "Not allowed" };
  await getStore().remove(collection, id);
  refresh();
  return { ok: true };
}

const IMAGE_TYPES: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif" };

export async function uploadImage(fd: FormData): Promise<{ url?: string; error?: string }> {
  await requireAdmin();
  const f = fd.get("file");
  if (!(f instanceof File) || !f.size) return { error: "No file selected." };
  const ext = IMAGE_TYPES[f.type];
  if (!ext) return { error: "Please upload a JPG, PNG, WebP or GIF image." };
  if (f.size > 6 * 1024 * 1024) return { error: "The image is larger than 6 MB." };
  const base = f.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) || "image";
  try {
    const url = await getStore().putFile(`${base}-${Date.now()}${ext}`, Buffer.from(await f.arrayBuffer()), f.type);
    return { url };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload failed" };
  }
}

export async function removeSubscriber(id: string) {
  await requireAdmin();
  if (!/^[a-f0-9]{24}$/.test(id)) return;
  await getStore().remove("subscribers", id);
  revalidatePath("/admin/subscribers");
}

export async function messageAction(id: string, op: "read" | "delete") {
  await requireAdmin();
  if (!/^[0-9]+-[a-f0-9]{6}$/.test(id)) return;
  const store = getStore();
  if (op === "delete") await store.remove("messages", id);
  else {
    const m = await store.get("messages", id);
    if (m) await store.put("messages", id, { ...m.data, read: true });
  }
  revalidatePath("/admin/messages");
}
