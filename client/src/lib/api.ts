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

/* ---------------------------------- Reviews ---------------------------------- */
export type Review = { id: string; name: string; company: string | null; rating: number; message: string; created_at: string }
export type ReviewInput = { name: string; company: string; rating: number; message: string }

/** Approved reviews only (row-level security hides everything else). Empty list if reviews are not set up yet. */
export async function fetchReviews(): Promise<Review[]> {
  if (!supabase) return []
  try {
    const { data, error } = await supabase.from('reviews').select('id,name,company,rating,message,created_at').eq('status', 'approved').order('created_at', { ascending: false }).limit(12)
    if (error) return []
    return (data as Review[]) ?? []
  } catch {
    return []
  }
}

/**
 * Stores a review as 'pending' in Supabase (see supabase/reviews.sql). It is never shown publicly until staff approve it.
 * Returns ok:false with an honest message when the backend is not available, rather than pretending to succeed.
 */
export async function submitReview(r: ReviewInput): Promise<{ ok: boolean; message?: string }> {
  if (!supabase) return { ok: false, message: 'Reviews are not connected on this website yet. Please contact us directly.' }
  try {
    const { error } = await supabase.from('reviews').insert({ name: r.name.trim(), company: r.company.trim() || null, rating: r.rating, message: r.message.trim(), status: 'pending' })
    if (!error) return { ok: true }
    if (error.code === '42P01' || error.code === 'PGRST205' || /schema cache|does not exist/i.test(error.message)) {
      return { ok: false, message: 'Reviews have not been switched on for this website yet. Please contact us directly.' }
    }
    return { ok: false, message: 'We could not send your review right now. Please try again in a moment.' }
  } catch {
    return { ok: false, message: 'We could not reach the server. Please check your connection and try again.' }
  }
}
