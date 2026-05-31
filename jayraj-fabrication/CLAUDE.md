# Jayraj Fabrication — Digital Ecosystem

**Developer:** Aryan Rajendra Suthar (`aryanrajendrasuthar@gmail.com`)
**Business:** Jayraj Fabrication, founded 2008 — Vadodara & Surat, India
**Owner/Director:** Rajendra Suthar (`jayrajfab09@gmail.com`, +91 9825098819)
**GST:** 24ALNPS3233M1ZP

This is a private, full-stack monorepo — a complete digital ecosystem for a family fabrication business. The brand tone is "Rolls-Royce drove into a steel factory": premium, luxury-industrial, intentional.

---

## Repo Structure

```
/Users/aryansuthar/Desktop/JF/Jayraj Fabrication/
├── jayraj-fabrication/          ← Next.js 14 app (this repo)
├── Smart-Quotation-Estimator-main/  ← Original Vite/React SmartQuote app (source reference)
└── JAYRAJ FABRICATION PROJECT PLAN.pdf
```

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS v3 + CSS custom properties |
| Animation | Framer Motion (whileInView, 0.5s ease-out, 100ms stagger) |
| Icons | Lucide React |
| Database + Auth | Supabase (PostgreSQL + Supabase Auth) |
| Image CDN | Cloudinary (NOT Supabase Storage for images) |
| Email | Resend.com API |
| PDF | pdf-lib via Supabase Edge Functions (Deno) |
| Deployment | Vercel |
| Analytics | Vercel Analytics (free tier) |

**Never use Supabase Storage for gallery images** — Cloudinary only.
**Never convert Supabase Edge Functions to Next.js API routes** — they use Deno-specific imports.
**Never use pure black (#000)** — minimum is `#0D0D0D`.

---

## Brand System

### Colors (Tailwind + CSS vars)

```css
--jf-lime:         #6BBF3A   /* Primary accent — CTAs, highlights, active states */
--jf-lime-dark:    #4A8A28   /* Lime on light backgrounds */
--jf-lime-glow:    #8FD654   /* Hover state */
--jf-bg-primary:   #0D0D0D   /* Dark theme default */
--jf-bg-secondary: #141414
--jf-bg-tertiary:  #1C1C1C
--jf-bg-section:   #111827   /* Dark blue-tinted sections */
--jf-gold:         #C9A84C   /* Premium accent, use sparingly */
--jf-steel:        #708090
--jf-danger:       #E53E3E
```

Tailwind aliases: `jf-lime`, `jf-lime-dark`, `jf-lime-glow`, `jf-gold`, `jf-steel`, `jf-bg`, `jf-bg-2`, `jf-bg-3`, `jf-bg-section`, `jf-light`, `jf-charcoal`, `jf-danger`.

### Typography (Google Fonts via CDN)

```
font-display  → "Barlow Condensed" 700/800  (section headings, hero, uppercase)
font-heading  → "Barlow" 600                (card titles, admin headings)
font-body     → "Inter" 400/500             (body copy, default)
font-mono-jf  → "Space Mono"               (steel table data, quote numbers, amounts)
```

### CSS Utility Classes (defined in globals.css)

```
.admin-card        — dark panel with border
.admin-input       — dark input with lime focus ring
.admin-label       — small uppercase label
.btn-lime          — lime filled button (primary CTA)
.btn-outline       — ghost border button
.btn-ghost         — text-only button
.btn-danger        — red tinted danger button
.status-draft/sent/approved/rejected/ordered   — quote status pills
.status-new/in_progress/converted/closed       — inquiry status pills
.section-label     — mono uppercase lime eyebrow text
.section-heading   — large display heading
.section-subheading — muted body under headings
.lime-link         — animated lime underline on hover
.glass             — frosted glass panel
.lime-glow         — lime box-shadow glow
.gradient-lime     — gradient text (lime to glow)
```

---

## Route Structure

```
app/
├── (site)/            ← Public website (Navbar + Footer layout)
│   ├── page.tsx       ← Home (Hero, StatsBar, ServicesGrid, WhyJayraj, Testimonials, ClientMarquee, InquiryCTA)
│   ├── about/         ← About Jayraj Fabrication
│   ├── services/      ← Services overview
│   ├── gallery/       ← Cloudinary gallery (filterable by category)
│   ├── clients/       ← Client logos / marquee
│   └── contact/       ← Contact form (submits to /api/inquiry)
│
├── admin/             ← Admin panel (Supabase Auth protected via middleware)
│   ├── login/         ← Login page (public)
│   ├── reset-password/← Password reset (public)
│   ├── page.tsx       ← Dashboard (stats: inquiries, quotes, gallery count)
│   ├── inquiries/     ← Inquiry list + detail ([id])
│   ├── smartquote/    ← SmartQuote ERP
│   │   ├── page.tsx        ← Quotes list
│   │   ├── new/            ← New quote (auto-increments quote_no F-NNN)
│   │   ├── [id]/           ← Quote detail editor
│   │   ├── clients/        ← Clients manager
│   │   └── company/        ← Company profile (used in PDF)
│   ├── gallery/       ← Gallery manager (Cloudinary upload + manage)
│   ├── steel-table/   ← ISS Steel Table calculator (7 section types)
│   ├── holidays/      ← Holiday Card Generator (Canvas API, 17 festivals)
│   └── settings/      ← System info + links
│
└── api/
    └── inquiry/route.ts  ← POST: saves inquiry to Supabase + sends Resend emails
```

### Admin Auth (middleware.ts)

All `/admin/*` routes (except `/admin/login` and `/admin/reset-password`) require Supabase session. Unauthenticated requests redirect to `/admin/login?redirectTo=<path>`. Already-authenticated users visiting `/admin/login` redirect to `/admin`.

---

## Database Schema (supabase/migrations/001_initial.sql)

Run in Supabase SQL editor. All tables have RLS enabled.

### Tables

| Table | Purpose |
|---|---|
| `inquiries` | Public contact form submissions (status: new/in_progress/converted/closed) |
| `gallery_images` | Cloudinary metadata — public_url, category, is_featured, sort_order |
| `app_settings` | SmartQuote admin email |
| `company_profile` | Company info used in PDF quotations |
| `clients` | Client directory for SmartQuote |
| `quotes` | Quotations (status: DRAFT/SENT/APPROVED/REJECTED/ORDERED) |
| `quote_items` | Line items per quote |
| `quote_extras` | GST/transport/extra amounts per quote |
| `quote_exports` | PDF export log (Supabase Storage path + public URL) |
| `generated_cards` | Log of holiday cards generated |
| `settings` | Key-value app settings (theme_default, whatsapp_number, gst_number) |

**Schema rule:** Only ADD columns, never remove. The SmartQuote schema was originally from a production Vite app and must stay backward-compatible.

### RLS Policies

- `inquiries`: public INSERT (contact form), authenticated full access
- `gallery_images`: public SELECT (active only), authenticated full access
- `quotes`, `quote_items`, `quote_extras`, `quote_exports`, `clients`, `company_profile`, `generated_cards`, `settings`: authenticated full access
- `app_settings`: restricted to `is_admin()` (email matches admin_email in app_settings)

### Seed Data (supabase/seed.sql)

Run after migration. Seeds: admin email (`aryanrajendrasuthar@gmail.com`), company profile (Vadodara HQ address), and settings defaults.

---

## Environment Variables (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
EMAIL_FROM=noreply@jayrajfabrication.com
EMAIL_TO_ADMIN=aryanrajendrasuthar@gmail.com
NEXT_PUBLIC_SITE_URL=https://jayrajfabrication.com
NEXT_PUBLIC_WHATSAPP_NUMBER=919825098819
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Modules Built

### 1. Public Website (app/(site)/)

Five pages — Home, About, Services, Gallery, Contact. Dark theme default.

**Home page components** (in render order):
- `Hero` — full-viewport with background video slot (Pexels PEB b-roll), animated headline, CTA
- `StatsBar` — animated count-up stats (17yr, 500+ projects, 8 states, etc.)
- `ServicesGrid` — 6 service cards (Industrial PEB, Tensile, Elevation, Commercial, Residential, Roofing)
- `WhyJayraj` — differentiators section
- `Testimonials` — client testimonials
- `ClientMarquee` — scrolling client logo strip (bi-directional)
- `InquiryCTA` — contact form (submits to `POST /api/inquiry`)

**Site layout components:**
- `Navbar` — sticky, lime-accent active links, mobile drawer
- `Footer` — addresses, contact, links, GST
- `WhatsAppFloat` — fixed WhatsApp bubble (`wa.me/919825098819`)

### 2. Admin Panel (app/admin/)

Auth-protected. Shell: `AdminShell` (sidebar + topbar wrapper).

**AdminSidebar** sections (in order):
1. Dashboard (`/admin`)
2. Inquiries (`/admin/inquiries`)
3. SmartQuote ERP (`/admin/smartquote`)
4. Gallery Manager (`/admin/gallery`)
5. Steel Table (`/admin/steel-table`)
6. Holiday Cards (`/admin/holidays`)
7. Settings (`/admin/settings`)

**Admin users:**
- Aryan Rajendra Suthar — `aryanrajendrasuthar@gmail.com` — role: super_admin
- Rajendra Suthar — `jayrajfab09@gmail.com` — role: owner
- Manager — TBD — role: manager

Users are managed via Supabase Authentication dashboard, not in-app.

### 3. SmartQuote ERP (app/admin/smartquote/)

Ported from `Smart-Quotation-Estimator-main/` (Vite + React + react-router). Now runs in Next.js with `next/navigation`.

**Pages:**
- `page.tsx` — Quotes list with status filters and search
- `new/page.tsx` — New quote (auto-increments quote_no as `F-NNN`); accepts `?from_inquiry={id}` to prefill from inquiry
- `[id]/page.tsx` — Quote detail editor (items, extras, PDF export, email-to-client)
- `clients/page.tsx` — Clients directory (name, address, city, contact_person, phone, email)
- `company/page.tsx` — Company profile editor (used in PDF header)

**Quote number format:** `F-001`, `F-002`, ... `F-031`. Parse last quote_no and auto-increment.

**Quote statuses:** DRAFT (gray) → SENT (blue) → APPROVED (lime) → REJECTED (red) → ORDERED (purple)

**PDF export:** Calls Supabase Edge Function `pdf-export` (Deno/pdf-lib). Saves to `exports` bucket, logs in `quote_exports`.

**Send to client:** After PDF export, calls `email-quote` Edge Function with `{ to, subject, pdfUrl, message }`.

**Migration rules from Vite source:**
- `react-router <Link to>` → `next/link <Link href>`
- `useParams()` from react-router → `useParams()` from `next/navigation`
- `import.meta.env.VITE_SUPABASE_*` → `process.env.NEXT_PUBLIC_SUPABASE_*`
- Auth context → Supabase SSR client from `lib/supabase/client.ts`

### 4. ISS Steel Table (app/admin/steel-table/)

Web rebuild of an Android steel weight calculator. 7 section types with tabbed interface.

**Tabs:** Angle | Beam | Channel | Pipe | Rec Tube | Sqr Tube | Bar/Flats

**Data source:** `lib/steelData.ts` — static lookup tables (IS section weights per metre, kg/m)

**Features:** Select section from dropdown, enter length + rate per kg → calculates total weight and cost. Copy-to-clipboard button. Space Mono font for all numeric output.

### 5. Holiday Card Generator (app/admin/holidays/)

Canvas API in-browser card generator. 17 festival templates + 1 generic brand card.

**Festivals:** Makar Sankranti, Republic Day, Mahashivratri, Holi, Eid, Independence Day, Raksha Bandhan, Janmashtami, Ganesh Chaturthi, Navratri, Dussehra, Diwali, Gujarati New Year, Labh Pancham, Christmas, New Year 2026, Generic Brand.

**Formats:** Square (1080×1080) | Story (1080×1920)

**Actions:** Preview on canvas, Download PNG, Share (Web Share API), logs to `generated_cards` table.

---

## Supabase Edge Functions

Located in original repo at `Smart-Quotation-Estimator-main/supabase/functions/`.

| Function | Purpose |
|---|---|
| `pdf-export` | Generates A4 PDF via pdf-lib (esm.sh), uploads to `exports` bucket |
| `email-quote` | Sends PDF link via Resend API |
| `_shared/adminGuard.ts` | Auth guard for edge functions |

**Deploy (MANUAL-SQ-01):**
```bash
supabase functions deploy pdf-export
supabase functions deploy email-quote
```

**Secrets to set:** `RESEND_API_KEY`, `EMAIL_FROM`, `ASSETS_BUCKET=assets`, `EXPORTS_BUCKET=exports`

**Storage buckets to create:** `assets` (public, upload logo.jpg), `exports` (public, PDFs)

---

## Development

```bash
cd jayraj-fabrication
npm run dev      # localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

**Image remote patterns** (next.config.mjs): `res.cloudinary.com` and `*.supabase.co`.

**Package tree-shaking** (optimizePackageImports): `lucide-react`, `@supabase/supabase-js`, `@supabase/ssr`.

---

## Deployment (Vercel)

- Single Vercel project, all routes
- vercel.json: custom `X-Powered-By: Jayraj Fabrication` and `X-Developer: Aryan Rajendra Suthar` headers on all routes
- Target domain: `jayrajfabrication.com` (not yet purchased as of initial build)

---

## Business Info (hardcoded reference)

```
GST: 24ALNPS3233M1ZP
Vadodara HQ: 513, Bakor Patel Chambers, Opp. Karelibaug Police Station,
             Bhutdizampa, Vadodara – 390001
Surat Office: 207, Richmond Plaza, Nr. Swastik Milestone,
              Above Dhiraj Sons, Vesu, Surat – 395007
Phone: +91 9825098819 | +91 7069536308
Email: jayrajfab09@gmail.com
WhatsApp: wa.me/919825098819
```

---

## Pre-Launch Checklist

- [ ] **MANUAL-01** — Create Supabase project, run `001_initial.sql`, run `seed.sql`
- [ ] **MANUAL-02** — Create Resend account, verify `jayrajfabrication.com` domain
- [ ] **MANUAL-03** — Create Cloudinary account, set env vars
- [ ] **MANUAL-SQ-01** — Deploy Supabase Edge Functions (`pdf-export`, `email-quote`)
- [ ] **MANUAL-SQ-02** — Create storage buckets: `assets` (public), `exports` (public); upload `logo.jpg` to `assets/`
- [ ] **MANUAL-04** — Add admin users in Supabase Auth dashboard
- [ ] **MANUAL-05** — Source hero background video from Pexels (industrial/PEB b-roll)
- [ ] **MANUAL-06** — Add `public/images/team/rajendra-suthar.jpg`
- [ ] **MANUAL-07** — Purchase domain `jayrajfabrication.com`, connect to Vercel
- [ ] **MANUAL-08** — Upload gallery photos via Gallery Manager after deploy (7GB batch)
- [ ] **MANUAL-09** — Change default admin passwords after first login

---

## What NOT to Do

- Do not use Supabase Storage for gallery images — use Cloudinary
- Do not convert Supabase Edge Functions to Next.js API routes (Deno imports)
- Do not use pure black `#000` — minimum `#0D0D0D`
- Do not remove or rename columns from the SmartQuote schema — only add
- Do not rebuild SmartQuote ERP logic — port the existing Vite source
