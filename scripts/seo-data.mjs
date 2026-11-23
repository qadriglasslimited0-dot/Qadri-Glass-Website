// Shared by sitemap.mjs and prerender-meta.mjs: the public address, the page list, and the published content.
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// Fixed on purpose (see client/src/lib/site.ts): qadriglass.com redirects to www, so www is the canonical host.
export const SITE = 'https://www.qadriglass.com'

/** Reads a value from the environment, falling back to client/.env (local builds). */
function env(key) {
  if (process.env[key]) return process.env[key]
  const f = resolve(root, 'client/.env')
  if (existsSync(f)) {
    const m = readFileSync(f, 'utf8').match(new RegExp(`^${key}=(.*)$`, 'm'))
    if (m) return m[1].trim()
  }
  return ''
}

export const ROUTES = JSON.parse(readFileSync(resolve(root, 'client/src/lib/seoRoutes.json'), 'utf8'))

// Used if Supabase is unreachable at build time (mirrors client/src/lib/content.ts).
export const FALLBACK_SERVICES = [
  { slug: 'architectural-glass', title: 'Architectural Glass', summary: 'Glass for the built environment, sourced and supplied to architects, interior designers and developers.' },
  { slug: 'custom-fabrication', title: 'Custom Fabrication', summary: 'Glass cut, finished and processed to the dimensions and details of each project.' },
  { slug: 'professional-installation', title: 'Professional Installation', summary: 'Careful on-site installation so the finished glass performs and looks as the design intended.' },
  { slug: 'decorative-solutions', title: 'Decorative Solutions', summary: 'Decorative glass that gives interiors character, privacy and light.' },
]

async function rest(table, select) {
  const url = env('VITE_SUPABASE_URL')
  const key = env('VITE_SUPABASE_ANON_KEY')
  if (!url || !key) return null
  try {
    const res = await fetch(`${url}/rest/v1/${table}?select=${select}&published=eq.true&order=sort.asc`, { headers: { apikey: key, Authorization: `Bearer ${key}` } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/** Published services, projects and products (what the public site shows). Empty lists on any failure. */
export async function loadContent() {
  const [services, projects, products] = await Promise.all([rest('services', 'slug,title,summary'), rest('projects', 'slug,name,description,images,location,category'), rest('products', 'slug,name,description,image')])
  return {
    services: services && services.length ? services : FALLBACK_SERVICES,
    projects: projects ?? [],
    products: products ?? [],
  }
}

const clip = (s, n = 155) => (s ?? '').replace(/\s+/g, ' ').trim().slice(0, n)
const abs = (u) => (!u ? `${SITE}/brand/og-image.png` : u.startsWith('http') ? u : SITE + u)

/** Every indexable page with its title, description and share image. */
export async function buildPages() {
  const c = await loadContent()
  const pages = Object.entries(ROUTES).map(([path, m]) => ({ path, title: m.title, description: m.description, image: abs(), priority: path === '/' ? '1.0' : '0.8' }))
  c.services.forEach((s) => pages.push({ path: `/services/${s.slug}`, title: `${s.title} | Qadri Glass`, description: clip(s.summary), image: abs(), priority: '0.7' }))
  c.projects.forEach((p) => pages.push({ path: `/projects/${p.slug}`, title: `${p.name} — Qadri Glass`, description: clip(p.description) || `${p.name}, ${p.location ?? ''}`, image: abs(p.images?.[0]), priority: '0.7' }))
  c.products.forEach((p) => pages.push({ path: `/products/${p.slug}`, title: `${p.name} — Qadri Glass`, description: clip(p.description), image: abs(p.image), priority: '0.6' }))
  return { pages, content: c }
}
