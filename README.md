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
