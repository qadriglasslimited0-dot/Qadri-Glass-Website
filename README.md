# Qadri Glass — The Art of Transparency

Premium corporate website for **Qadri Glass Pvt. Ltd.** (est. 1960, Lahore). Built by FRX Technologies.

```
qadri-glass/
├─ client/     React 19 · TypeScript · Vite 7 · Tailwind 3 · GSAP + ScrollTrigger · Framer Motion · Lenis · three.js / R3F / drei
├─ server/     Node · Express 5 · Zod · Multer · Nodemailer · Supabase (service role)
├─ supabase/   schema.sql — tables, Row Level Security, storage buckets
└─ scripts/    sitemap.mjs — sitemap.xml, robots.txt, SPA redirects (runs on build)
```

## Run it

```bash
npm run install:all
npm run dev          # website  → http://localhost:5200
npm run dev:api      # API      → http://localhost:8787  (second terminal)
```

The site works with **no configuration**: it falls back to clearly-labelled placeholder content, and enquiries are logged by the API. Add credentials to switch on the real features.

### 1 · Supabase (database, auth, storage)
1. Create a project at supabase.com → SQL editor → run [`supabase/schema.sql`](supabase/schema.sql).
2. Authentication → Users → add a staff user. Copy their UUID and run `insert into public.staff (user_id) values ('<uuid>');`
3. `client/.env` (copy from `client/.env.example`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (the **anon** key — safe for browsers; RLS protects the data).
4. `server/.env` (copy from `server/.env.example`): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (**server only — never put in client**).

### 2 · Enquiry notifications
Fill `SMTP_*` in `server/.env` (a Gmail app password works). Notifications go to `NOTIFY_TO`. Optional: set `TURNSTILE_SECRET` for Cloudflare Turnstile verification.

### 3 · Admin dashboard — `/admin`
Staff sign in with Supabase Auth. Manage enquiries (status, attachments), projects, products, services, certificates and website content (mission, vision, company contact details). Uploads go to the `media` storage bucket. Everything is gated by Row Level Security (`public.is_staff()`).

### 4 · Deploy
- Client: `npm run build` (set `VITE_SITE_URL`, `VITE_API_URL` first) → deploy `client/dist` (Netlify/Vercel/Cloudflare Pages; `_redirects` is generated).
- API: any Node host. Set `CORS_ORIGINS` to the live site origin.

## Content integrity
Nothing in this codebase invents certificates, awards, offices, facilities, clients, specs or statistics. The only figures are the client-supplied ones (65+ years, 1,000+ projects *as stated by Qadri Glass*, 3 generations). Products and projects ship as labelled placeholders until the company supplies real material; the quality process and customer-journey wording are flagged for confirmation on the page.

## Motion system
- `lib/gsap.ts` registers ScrollTrigger and holds the shared "ready" gate (hero animates only after the preloader).
- `hooks/useMotion.ts` wraps `gsap.matchMedia`: every tween/trigger is auto-reverted on unmount or breakpoint change; `reduced`, `desktop`, `mobile` flags are passed to each section.
- Pinned storytelling and horizontal galleries run on desktop only; tablet/mobile get native-feeling stacked or snap-scroll layouts.
- `prefers-reduced-motion` disables pins, scrubs, parallax, loops, the curtain transition and smooth-scroll easing.
- 3D (hero + material lab) is code-split, paused off-screen, and lighter on mobile; WebGL failure falls back to a CSS glass gradient.

## Customer reviews (one-time setup)
The website has a review form (stars, animated face, live preview). Submissions are stored as **pending** and only
**approved** reviews are shown. To switch it on, run `supabase/reviews.sql` once in the Supabase SQL editor, then
approve reviews in the admin dashboard (Reviews tab: set Status to "approved"). Until the table exists the form shows an
honest "not switched on yet" message instead of pretending to submit.

## Footer credit
The "Powered by FRX Technologies" link reads `COMPANY.developer` and `COMPANY.developerUrl` in `client/src/lib/content.ts`.
Change the URL there once the official FRX domain is live.

## SEO and Google Search Console
The site's address is `https://www.qadriglass.com` (the domain redirects `qadriglass.com` to `www`, so `www` is the canonical host) (fixed in `client/src/lib/site.ts` and `scripts/seo-data.mjs`; `VITE_SITE_URL` is not used for this).

What the build produces (`npm run build`):
- `sitemap.xml` and `robots.txt` for `www.qadriglass.com`, including every published service, project and product from Supabase.
  **Projects added later appear in the sitemap after the next deploy** (Vercel redeploy, or push a commit).
- A copy of the page for every route (`dist/about/index.html`, `dist/projects/<slug>/index.html`, ...) carrying that page's own
  title, description, canonical and Open Graph tags plus a plain-HTML `<noscript>` summary. Edit the wording in
  `client/src/lib/seoRoutes.json` (single source for the static pages).
- Structured data: business + website (in `client/index.html`), breadcrumbs on detail pages, `Service` on service pages.
- Google ownership: `client/public/google3db125d6f1349098.html` and the `google-site-verification` meta tag in `client/index.html`.
- `/admin` and `/api` are disallowed; 404 and staff pages are `noindex`.

After deploying: add `www.qadriglass.com` and `qadriglass.com` to the Vercel project (keep the redirect from `qadriglass.com` to `www`),
then in Search Console choose **Verify**, submit `https://www.qadriglass.com/sitemap.xml`, and use **URL Inspection → Request indexing** for the home page.
Also set the Supabase Auth Site URL to `https://www.qadriglass.com`.
