# IPMA KSA website: project modules

Bilingual (Arabic default, English) website for IPMA KSA with a separate content admin, member accounts and a PostgreSQL database.
Stack: Next.js 16 (App Router), React 19, Tailwind v4, TypeScript, PostgreSQL 16.

## 1. Public website (`app/(site)/[lang]/…`)

| Page | Route | Content source |
|---|---|---|
| Home | `/ar`, `/en` | `home`, `journey`, `exams`, `events`, `team`, `benefits`, `news` |
| About / certification levels A–D / recertification / privacy | `/[slug]` | `pages` (group: about, certification, other) |
| How certification works | `/certification-journey` | `journey` (cycle table, How to prepare, FAQ) |
| Exam dates | `/exam-dates` | `exams` + page text from `pages` |
| Project Connect | `/project-connect` | `events` (upcoming, past, recording) |
| Membership | `/membership` | `benefits` |
| Team | `/team` | `team` |
| News and article | `/news`, `/news/[slug]` | `news` |
| Contact | `/contact` | `settings` + form → email (SMTP) |
| Register / Sign in / Profile | `/register`, `/login`, `/profile` | `members` (dynamic pages) |

Every page is statically generated, except profile, login and register which read the member cookie.
`/` and unprefixed paths redirect to `/ar` or `/en` using the `lang` cookie (`proxy.ts`).

## 2. Shared UI (`components/`)

| File | Role |
|---|---|
| `SiteChrome.tsx` | Top bar (email, phone), header (menus, flag-only language switch, account links), footer |
| `Sections.tsx` | Section title, page hero, exam cards, benefits grid, team card, news cards, event cards, Join band (Create account / Sign in), contact cards |
| `Journey.tsx` | 6-stage cycle table (table on desktop, stage cards on mobile), How to prepare block, FAQ accordion |
| `AuthForms.tsx` | Register, sign-in and profile forms (keep typed values after an error) |
| `ContactForm.tsx`, `LangSwitch.tsx`, `Icon.tsx` | Contact form with honeypot, flag button, icon set |

Design tokens live in `app/globals.css` (`@theme`): deep green, gold, cream, a subtle Najdi pattern band; Cairo font (self-hosted).

## 3. Content layer (`lib/content/`)

| File | Role |
|---|---|
| `types.ts` | Document types (`HomeDoc`, `PageDoc`, `TeamDoc`, `ExamDoc`, `ProjectEventDoc`, `JourneyDoc`, `MemberDoc`, …) |
| `schema.ts` | Declarative field schema for every editable collection. The admin forms and the server-side sanitising are both generated from it |
| `seed.ts`, `seed-certifications.ts`, `seed-journey.ts` | Built-in Arabic and English content |
| `store.ts` | Chooses the store: `DATABASE_URL` → PostgreSQL; Supabase variables → Supabase; otherwise JSON files |
| `postgres-store.ts` | Tables `documents` and `media` (created automatically); images served from `/media/[id]` |
| `file-store.ts`, `supabase-store.ts` | Alternative stores |
| `api.ts` | Read helpers used by the pages (`getHome`, `getJourney`, `getEvents`, …) |

Collections: `home`, `pages`, `team`, `exams`, `journey`, `events`, `benefits`, `badges`, `news`, `settings`. System collection: `members`.
Built-in content is copied into the database the first time a collection is edited, so later edits are never overwritten by the seed.

## 4. Content admin (`app/(admin)/admin/…`)

Separate layout and host (`admin.<domain>`; in development `admin.localhost:3000` or `/admin`). On the public host `/admin` returns 404 in production.

| Screen | Purpose |
|---|---|
| Login | Email + password (scrypt hash in `ADMIN_USERS`), rate limited, signed session cookie |
| Dashboard | Count of members, and shortcuts |
| Content lists and editors (`c/[collection]`) | Schema-driven forms: bilingual fields, lists with reorder, image upload, delete |
| Members & badges | List members, award or remove badges with an optional note, delete an account |

Server actions (`actions.ts`): `saveDoc`, `deleteDoc`, `uploadImage`, `setMemberBadges`, `deleteMember`, `loginAction`, `logoutAction`. Each one re-checks the admin session.

## 5. Member accounts (`lib/members.ts`, `app/(site)/member-actions.ts`)

Register (name, email, date of birth, country, password, acceptance) → profile with badges. Actions: `registerMember`, `loginMember`, `logoutMember`, `updateProfile`.
Passwords are hashed with scrypt; the session is an HMAC-signed 14-day cookie; honeypot and rate limits on all forms. Badges are awarded only from the admin.

## 6. Security and infrastructure

- `proxy.ts`: locale redirect, admin host rewrite, 404 for admin on the public host.
- `next.config.ts`: security headers, long cache for images and flags.
- `lib/auth.ts`: admin password check, session signing, throttling. A development-only default login exists when not in production.
- Environment variables: see `.env.example` (`DATABASE_URL`, `SESSION_SECRET`, `ADMIN_USERS`, `ADMIN_HOST`, `NEXT_PUBLIC_SITE_URL`, SMTP (required for the contact form) and optional Supabase).
- `docker-compose.yml` and `db/schema.sql` for local PostgreSQL. `scripts/hash-password.mjs` creates admin password hashes.

## 7. Assets (`public/`)

Official logos (colour and white), favicon (the two red arrows), Project Connect logo and episode posters, team photos (4:5), Saudi imagery, flags.

## 8. Testing performed

End-to-end checks with Playwright against PostgreSQL: member register, duplicate email, sign in/out, wrong password, profile edit; admin sign in, create / edit / delete for every content type, image upload and serving, badge award shown on the profile, contact form email, admin hidden on the public host; page width audit at 320–1440 px in Arabic and English with no horizontal overflow.

## 9. Known gaps

- No email verification or password reset yet (needs an email service).
- Hosting not chosen yet (the repo is ready for any Node host with PostgreSQL).
- Replace the placeholder Zoom registration link on Episode 2, add the team LinkedIn links and the final membership benefits.

## SEO and GEO

- Per page: unique title and description, canonical URL, hreflang (ar, en, x-default), Open Graph and Twitter cards (`lib/seo.ts`, `pageMeta`).
- Structured data (JSON-LD): Organization + WebSite on every page, FAQPage on the FAQ blocks, Event on Project Connect, NewsArticle + BreadcrumbList on news articles.
- `/robots.txt` allows search and AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) and blocks admin, login, register and profile.
- `/sitemap.xml` with priorities, change frequency and language alternates.
- `/llms.txt` and `/llms-full.txt`: plain-text summaries for AI assistants, generated from live content (pages, news, exams, FAQ).
- Social links (LinkedIn, X, Instagram, WhatsApp channel) are in Settings, the footer and the Organization `sameAs`.

## Member emails and password reset

- Needs SMTP in `.env` (Microsoft 365: `smtp.office365.com`, port 587, sender `care@ipmaksa.world`; Authenticated SMTP must be enabled for that mailbox).
- Emails (Arabic or English, site-branded): welcome on sign-up, password reset link, "password was changed" notice.
- Reset flow: `/forgot-password` -> email with one-time link (valid 30 minutes, only its hash is stored in the `resets` collection) -> `/reset-password?token=...`. The answer never reveals whether an email is registered; requests are rate-limited.
- Code: `lib/mailer.ts`, `lib/member-mail.ts`, `lib/reset.ts`, actions `requestReset` and `resetPassword` in `app/(site)/member-actions.ts`.
