/**
 * The public address of the website. Used for canonical links, Open Graph and structured data.
 * It comes from VITE_SITE_URL when that holds the real domain; a placeholder, localhost or a preview host
 * (vercel.app / netlify.app) is ignored so the canonical address is always the real one.
 */
export const DEFAULT_SITE_URL = 'https://qadriglass.com'

export function resolveSiteUrl(value?: string): string {
  const v = (value ?? '').trim().replace(/\/$/, '')
  if (!v || /example\.com|localhost|127\.0\.0\.1|vercel\.app|netlify\.app/i.test(v)) return DEFAULT_SITE_URL
  return v
}

export const SITE_URL = resolveSiteUrl(import.meta.env.VITE_SITE_URL as string | undefined)
