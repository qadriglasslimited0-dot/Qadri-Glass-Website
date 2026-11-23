import { useLayoutEffect } from 'react'
import { SITE_URL } from '../lib/site'

type Crumb = { name: string; path: string }
type Props = {
  title: string
  description: string
  path?: string
  image?: string
  /** structured data for this page (one object or a list) */
  jsonLd?: object | object[]
  /** keep the page out of search results (404, staff area) */
  noindex?: boolean
  type?: 'website' | 'article'
}

/** BreadcrumbList structured data: Home > ... > current page. */
export function breadcrumbLd(items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...items].map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: SITE_URL + (c.path === '/' ? '/' : c.path) })),
  }
}

/** Keep exactly one tag for a selector: update the first, drop duplicates, create it if missing. */
function setTag(selector: string, tag: 'meta' | 'link', attrs: Record<string, string>, valueAttr: 'content' | 'href', value: string | null) {
  const found = Array.from(document.head.querySelectorAll(selector))
  found.slice(1).forEach((n) => n.remove())
  if (value === null) {
    found[0]?.remove()
    return
  }
  const el = found[0] ?? document.head.appendChild(Object.assign(document.createElement(tag), {}))
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
  el.setAttribute(valueAttr, value)
}

/**
 * Per-page head tags. They update the tags already in index.html in place (no duplicates when you move between
 * pages), and every page also ships its own copy in the built HTML (see scripts/prerender-meta.mjs).
 */
export default function Seo({ title, description, path = '', image = '/brand/og-image.png', jsonLd, noindex = false, type = 'website' }: Props) {
  const full = title.includes('Qadri Glass') ? title : `${title} — Qadri Glass`
  const clean = description.replace(/\s+/g, ' ').trim()
  const url = SITE_URL + (path === '/' ? '/' : path)
  const img = image.startsWith('http') ? image : SITE_URL + image
  const ld = JSON.stringify(jsonLd ?? null)

  useLayoutEffect(() => {
    document.title = full
    setTag('meta[name="description"]', 'meta', { name: 'description' }, 'content', clean)
    setTag('meta[name="robots"]', 'meta', { name: 'robots' }, 'content', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')
    setTag('link[rel="canonical"]', 'link', { rel: 'canonical' }, 'href', noindex ? null : url)
    const og: [string, string][] = [
      ['og:type', type],
      ['og:site_name', 'Qadri Glass'],
      ['og:locale', 'en_PK'],
      ['og:title', full],
      ['og:description', clean],
      ['og:url', url],
      ['og:image', img],
    ]
    og.forEach(([k, v]) => setTag(`meta[property="${k}"]`, 'meta', { property: k }, 'content', v))
    const tw: [string, string][] = [
      ['twitter:card', 'summary_large_image'],
      ['twitter:title', full],
      ['twitter:description', clean],
      ['twitter:image', img],
    ]
    tw.forEach(([k, v]) => setTag(`meta[name="${k}"]`, 'meta', { name: k }, 'content', v))

    // page-level structured data (the business and website data in index.html stays)
    document.head.querySelectorAll('script[data-seo-ld]').forEach((n) => n.remove())
    const parsed = JSON.parse(ld) as object | object[] | null
    ;(parsed ? (Array.isArray(parsed) ? parsed : [parsed]) : []).forEach((b) => {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.setAttribute('data-seo-ld', '')
      s.text = JSON.stringify(b)
      document.head.appendChild(s)
    })
    return () => {
      document.head.querySelectorAll('script[data-seo-ld]').forEach((n) => n.remove())
    }
  }, [full, clean, url, img, noindex, type, ld])

  return null
}
