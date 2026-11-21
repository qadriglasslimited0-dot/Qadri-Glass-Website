import { Router } from 'express'
import { supabase } from '../lib/supabase.js'

export const content = Router()

let cache: { at: number; body: unknown } | null = null

/** Public, published-only content. 204 when Supabase is not configured, so the site falls back to its seed content. */
content.get('/', async (_req, res) => {
  if (!supabase) return res.status(204).end()
  if (cache && Date.now() - cache.at < 30_000) return res.json(cache.body)
  const [services, products, projects, certificates, site] = await Promise.all([
    supabase.from('services').select('*').eq('published', true).order('sort'),
    supabase.from('products').select('*').eq('published', true).order('sort'),
    supabase.from('projects').select('*').eq('published', true).order('sort'),
    supabase.from('certificates').select('*').eq('verified', true).order('sort'),
    supabase.from('site_content').select('*'),
  ])
  const err = services.error ?? products.error ?? projects.error ?? certificates.error ?? site.error
  if (err) {
    console.error('content error', err.message)
    return res.status(502).json({ message: 'Content unavailable' })
  }
  const body = {
    services: services.data,
    products: products.data,
    projects: projects.data,
    certificates: certificates.data,
    site: Object.fromEntries((site.data ?? []).map((r: { key: string; value: string }) => [r.key, r.value])),
  }
  cache = { at: Date.now(), body }
  res.set('Cache-Control', 'public, max-age=30').json(body)
})
