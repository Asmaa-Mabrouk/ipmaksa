# IPMA KSA website

Bilingual (Arabic default, English) website for IPMA KSA with a separate admin portal.
Next.js 16 · React 19 · Tailwind 4. Static/ISR pages, self-hosted fonts, pre-optimized WebP images.

## Run locally with PostgreSQL
```bash
npm install
docker compose up -d              # starts PostgreSQL on localhost:5432 (user/password/db: ipma / ipma / ipmaksa)
cp .env.example .env.local        # DATABASE_URL is already set for the Docker database
npm run dev
```
- Site: http://localhost:3000 (redirects to `/ar`; the flag button switches language)
- Admin: http://localhost:3000/admin (also http://admin.localhost:3000)
  Dev login: `admin@ipmaksa.local` / `ipma-dev-password` (works only outside production)
- Without Docker, use any PostgreSQL you have: create a database and put its address in `DATABASE_URL`.
- The tables are created automatically on first use (`db/schema.sql` shows them). Content, newsletter
  subscribers, contact messages and uploaded images are all stored in PostgreSQL.
- If `DATABASE_URL` is empty the site still runs, saving to local files (`content-data/`, `public/uploads`).

## Admin portal
Served on its own host. In production the public host returns 404 for `/admin`; only the host set in
`ADMIN_HOST` (or any host starting with `admin.`) serves it, e.g. `https://admin.ipmaksa.world`.
Editors can change: Home page, Pages, Team (with LinkedIn), Exam dates, Membership benefits, News,
Contact and settings (email, phone, social). Every text has Arabic and English fields. The admin also lists newsletter
subscribers (CSV download) and contact messages.

## Deploying
1. Create a hosted PostgreSQL database (Neon, Railway, Render, AWS RDS, …) and copy its connection string.
2. Set the environment variables from `.env.example` on your host:
   `DATABASE_URL`, `ADMIN_USERS`, `SESSION_SECRET`, `ADMIN_HOST`, `NEXT_PUBLIC_SITE_URL`.
   (Supabase is still supported through `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` if `DATABASE_URL` is empty.)
3. Create admin logins: `npm run admin:hash -- you@example.com 'a strong password'` and paste the output into `ADMIN_USERS`.
4. Point both `ipmaksa.world` and `admin.ipmaksa.world` at the same deployment.

## Notes
- Until an editor changes a section, the built-in starter content (`lib/content/seed.ts`) is shown. Items marked
  `needsReview` in Pages need checking by the team.
- Newsletter: sign-ups are collected and exported; send campaigns from a mail provider by importing the CSV.
- Layout and colors follow the 2026 IPMA KSA deck (green, gold, cream). Logos are in `public/images`.
