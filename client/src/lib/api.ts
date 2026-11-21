import { createContext, useContext } from 'react'
import { supabase } from './supabase'
import { COMPANY, CERTIFICATES, PRODUCTS, PROJECTS, SERVICES, type Certificate, type Product, type Project, type Service } from './content'

export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

export type SiteData = {
  services: Service[]
  products: Product[]
  projects: Project[]
  certificates: Certificate[]
  site: Record<string, string>
  live: boolean
}

export const SEED: SiteData = {
  services: SERVICES,
  products: PRODUCTS,
  projects: PROJECTS,
  certificates: CERTIFICATES,
  site: {},
  live: false,
}

export const SiteDataContext = createContext<SiteData>(SEED)
export const useSite = () => useContext(SiteDataContext)

/** Company details with optional overrides from the admin dashboard (site_content keys `company.*`). */
export function useCompany() {
  const { site } = useSite()
  const pick = (k: string, d: string) => site[`company.${k}`] || d
  return {
    ...COMPANY,
    phone: pick('phone', COMPANY.phone),
    phoneHref: pick('phoneHref', COMPANY.phoneHref),
    email: pick('email', COMPANY.email),
    whatsapp: pick('whatsapp', COMPANY.whatsapp),
    address: pick('address', COMPANY.address),
    addressLines: site['company.address'] ? site['company.address'].split(',').map((l) => l.trim()) : COMPANY.addressLines,
  }
}

/** Public content. Reads Supabase directly (row-level security only exposes published rows), then the Express API, then seed content. */
export async function fetchSiteData(): Promise<SiteData> {
  if (supabase) {
    try {
      const [s, p, pr, c, sc] = await Promise.all([
        supabase.from('services').select('*').eq('published', true).order('sort'),
        supabase.from('products').select('*').eq('published', true).order('sort'),
        supabase.from('projects').select('*').eq('published', true).order('sort'),
        supabase.from('certificates').select('*').eq('verified', true).order('sort'),
        supabase.from('site_content').select('key,value'),
      ])
      if (!s.error && !p.error && !pr.error && !c.error && !sc.error) {
        const pick = <T,>(live: T[] | null, seed: T[]) => (live && live.length ? live : seed)
        return {
          services: pick(s.data as Service[] | null, SEED.services),
          products: pick(p.data as Product[] | null, SEED.products),
          projects: pick(pr.data as Project[] | null, SEED.projects),
          certificates: (c.data as Certificate[] | null) ?? [],
          site: Object.fromEntries((sc.data ?? []).map((r: { key: string; value: string }) => [r.key, r.value])),
          live: true,
        }
      }
    } catch {
      /* fall through to the API */
    }
  }
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 4000)
    const res = await fetch(`${API_URL}/api/content`, { signal: ctrl.signal })
    clearTimeout(timer)
    if (!res.ok) return SEED
    const j = await res.json()
    const pick = <T,>(live: T[] | undefined, seed: T[]) => (Array.isArray(live) && live.length ? live : seed)
    return {
      services: pick(j.services, SEED.services),
      products: pick(j.products, SEED.products),
      projects: pick(j.projects, SEED.projects),
      certificates: Array.isArray(j.certificates) ? j.certificates : [],
      site: j.site ?? {},
      live: true,
    }
  } catch {
    return SEED
  }
}

export async function submitEnquiry(form: FormData): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/enquiries`, { method: 'POST', body: form })
    const j = await res.json().catch(() => ({}))
    if (!res.ok) return { ok: false, message: j.message ?? 'We could not send your enquiry. Please try again or use WhatsApp.' }
    return { ok: true }
  } catch {
    return { ok: false, message: 'We could not reach the server. Please try again, or contact us on WhatsApp or by email.' }
  }
}
