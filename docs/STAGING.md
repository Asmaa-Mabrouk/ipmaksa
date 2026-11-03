# Staging on Vercel + Neon (free), production later on Google Cloud (Dammam)

Staging is for the team to try the site with test data. It is never indexed by search engines
(`SITE_ENV=staging` adds `noindex` everywhere and an empty sitemap). Do not put real member data here.

## 1. Database (Neon)
1. Create a free project at neon.com (region closest to Riyadh, e.g. Frankfurt).
2. Copy the **pooled** connection string (host contains `-pooler`). It ends with `?sslmode=require`.
3. Nothing else: the tables are created automatically on first visit.

## 2. Website (Vercel)
1. vercel.com > Add New > Project > import `Asmaa-Mabrouk/ipmaksa` (branch `main`). Framework: Next.js (auto-detected).
2. Add these Environment Variables (Production and Preview):

| Name | Value |
|---|---|
| `DATABASE_URL` | the Neon pooled string |
| `SESSION_SECRET` | output of `openssl rand -hex 32` |
| `ADMIN_USERS` | `email:salt:hash` from `npm run admin:hash -- you@example.com 'password'` (run it on your Mac) |
| `SITE_ENV` | `staging` |
| `NEXT_PUBLIC_SITE_URL` | `https://staging.ipmaksa.world` (or the `xxx.vercel.app` address) |
| `ADMIN_HOST` | `admin.staging.ipmaksa.world` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_FROM`, `CONTACT_TO` | optional on staging (without SMTP, contact and reset emails show an error) |

3. Deploy. Every `git push` to `main` redeploys.

## 3. Domains (optional but needed for the admin)
The admin lives on a host that starts with `admin.`. In Vercel > Settings > Domains add:
- `staging.ipmaksa.world` (the public site)
- `admin.staging.ipmaksa.world` (the admin portal)

In GoDaddy DNS add one `CNAME` record for each name pointing to `cname.vercel-dns.com`
(Vercel shows the exact value). Do not touch the main `ipmaksa.world` records: they stay on the old site until production is ready.

Without a custom domain the public site works at the `xxx.vercel.app` address, but the admin portal will not.

## Limits to remember
- Vercel Hobby is free for non-commercial use only. Check the current terms before showing it as an official site.
- Uploads through the admin must be under about 4 MB on Vercel (profile photos are shrunk automatically).
- The login/contact rate limits are per server instance on Vercel, so they are weaker than on a single VM.
- Staging and production use separate databases. Content edited on staging is not copied to production.
