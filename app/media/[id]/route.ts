import { readMedia } from "@/lib/content/postgres-store";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = process.env.DATABASE_URL;
  if (!url || !/^[a-z0-9][a-z0-9.-]{0,100}$/i.test(id)) return new Response("Not found", { status: 404 });
  const m = await readMedia(url, id);
  if (!m) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(m.data), {
    headers: { "Content-Type": m.content_type, "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" },
  });
}
