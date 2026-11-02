import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["ar", "en"];
const DEFAULT = "ar";
const ADMIN_HOST = (process.env.ADMIN_HOST || "").toLowerCase();

const isAdminHost = (host: string) =>
  (ADMIN_HOST && host === ADMIN_HOST) || host.startsWith("admin.");

export function proxy(req: NextRequest) {
  const host = (req.headers.get("host") || "").split(":")[0].toLowerCase();
  const { pathname } = req.nextUrl;
  const prod = process.env.NODE_ENV === "production";

  // 1) Admin lives on its own host and is rewritten to /admin/*
  if (isAdminHost(host)) {
    if (pathname.startsWith("/_next") || pathname.startsWith("/uploads") || pathname.startsWith("/media") || pathname.startsWith("/images")) return;
    const url = req.nextUrl.clone();
    url.pathname = pathname.startsWith("/admin") ? pathname : `/admin${pathname === "/" ? "" : pathname}`;
    const res = NextResponse.rewrite(url);
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // 2) The public host never exposes the admin portal in production
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (prod) return new NextResponse("Not found", { status: 404 });
    return; // dev: http://localhost:3000/admin works too
  }

  // 3) Locale handling for the public site
  const first = pathname.split("/")[1];
  if (LOCALES.includes(first)) return;
  const saved = req.cookies.get("lang")?.value;
  const locale = saved && LOCALES.includes(saved) ? saved : DEFAULT;
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|flags/|uploads/|media/|fonts/|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|webp|svg|ico|woff2?|txt|xml|mp4|pdf)$).*)",
  ],
};
