// Usage: npm run smoke -- https://ipmaksa.vercel.app [https://ipmaksa-admin.vercel.app]
// Checks the main pages, SEO/staging flags, security headers and (optionally) the admin host.
const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const admin = (process.argv[3] || "").replace(/\/$/, "");
let fail = 0, ok = 0;
const pass = (m) => { ok++; console.log("  PASS", m); };
const bad = (m) => { fail++; console.log("  FAIL", m); };
const check = (c, m) => (c ? pass(m) : bad(m));
const get = async (u, o = {}) => { try { return await fetch(u, { redirect: "manual", ...o }); } catch (e) { return { status: 0, headers: new Headers(), text: async () => String(e) }; } };

console.log(`\nSite: ${base}`);
const PAGES = ["", "/certification-journey", "/exam-dates", "/project-connect", "/membership", "/team", "/news", "/contact", "/login", "/register", "/forgot-password", "/about-us", "/ipma-standards", "/privacy-policy"];

console.log("\n1. Pages load in Arabic and English (a 500 here usually means the database is not connected)");
for (const l of ["ar", "en"]) for (const p of PAGES) {
  const r = await get(`${base}/${l}${p}`);
  check(r.status === 200, `${r.status} /${l}${p || ""}`);
}

console.log("\n2. Redirect and 404");
let r = await get(`${base}/`);
check([307, 308].includes(r.status) && /\/(ar|en)$/.test(r.headers.get("location") || ""), `/ redirects to a language (${r.status} -> ${r.headers.get("location")})`);
r = await get(`${base}/ar/this-page-does-not-exist`);
check(r.status === 404, `unknown page gives 404 (${r.status})`);
r = await get(`${base}/admin/login`);
check(r.status === 404, `/admin is hidden on the public host (${r.status})`);

console.log("\n3. SEO and indexing");
const home = await get(`${base}/ar`); const html = await home.text();
const robotsMeta = (html.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || "";
const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
const staging = /noindex/.test(robotsMeta);
console.log(`  INFO mode: ${staging ? "STAGING (noindex)" : "PRODUCTION (indexable)"}`);
check(/<title>[^<]{10,}/.test(html), "has a title");
check(/<meta name="description" content="[^"]{40,}/.test(html), "has a description");
check(/hrefLang="en"|hreflang="en"/i.test(html), "has hreflang alternates");
check(/property="og:title"/.test(html) && /name="twitter:card"/.test(html), "has Open Graph and Twitter tags");
check(canonical.startsWith(base), `canonical points to this site (${canonical})`);
const lds = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)];
let ldOk = lds.length > 0; for (const m of lds) { try { JSON.parse(m[1]); } catch { ldOk = false; } }
check(ldOk, `JSON-LD present and valid (${lds.length} blocks)`);
const robots = await (await get(`${base}/robots.txt`)).text();
const sm = await get(`${base}/sitemap.xml`); const smText = await sm.text();
const xr = home.headers.get("x-robots-tag") || "";
if (staging) {
  check(/Disallow: \/\s*$/m.test(robots), "robots.txt blocks everything");
  check(/noindex/.test(xr), `X-Robots-Tag noindex header (${xr || "missing"})`);
  check(!/<loc>/.test(smText), "sitemap is empty");
} else {
  check(/Sitemap:/.test(robots) && /Disallow: \/admin/.test(robots), "robots.txt allows crawlers and lists the sitemap");
  check(/<loc>/.test(smText), "sitemap has URLs");
  const llms = await get(`${base}/llms.txt`); check(llms.status === 200 && /IPMA KSA/.test(await llms.text()), "llms.txt is served");
}

console.log("\n4. Security headers");
check(home.headers.get("x-content-type-options") === "nosniff", "X-Content-Type-Options");
check(!!home.headers.get("referrer-policy"), "Referrer-Policy");
check(!home.headers.get("x-powered-by"), "X-Powered-By hidden");

console.log("\n5. Static assets");
for (const a of ["/images/logo-white.png", "/images/hero-village.webp", "/favicon.ico", "/icon.png"]) {
  const x = await get(`${base}${a}`); check(x.status === 200, `${x.status} ${a}`);
}

if (admin) {
  console.log(`\n6. Admin host: ${admin}`);
  const a1 = await get(`${admin}/admin/login`); const t = await a1.text();
  check(a1.status === 200 && /IPMA KSA admin/i.test(t), `admin login page opens (${a1.status})`);
  check(/show password/i.test(t) || /Show password/.test(t), "password show/hide button present");
  const a2 = await get(`${admin}/`);
  check([307, 308].includes(a2.status) && /\/admin\/login/.test(a2.headers.get("location") || ""), `root redirects to the login (${a2.status})`);
  const a3 = await get(`${admin}/admin/c/home`); check([307, 308].includes(a3.status), `protected page redirects when signed out (${a3.status})`);
}
console.log(`\nResult: ${ok} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
