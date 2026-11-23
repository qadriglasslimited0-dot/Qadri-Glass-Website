// Writes client/public/sitemap.xml, robots.txt and _redirects. Runs before every build.
// Pages come from the shared route table plus the services, projects and products published in Supabase.
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { root, SITE, buildPages } from './seo-data.mjs'

const { pages } = await buildPages()
const today = new Date().toISOString().slice(0, 10)
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
  .map((p) => `  <url><loc>${esc(SITE + (p.path === '/' ? '/' : p.path))}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`)
  .join('\n')}\n</urlset>\n`

const robots = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`

mkdirSync(resolve(root, 'client/public'), { recursive: true })
writeFileSync(resolve(root, 'client/public/sitemap.xml'), xml)
writeFileSync(resolve(root, 'client/public/robots.txt'), robots)
writeFileSync(resolve(root, 'client/public/_redirects'), '/*    /index.html   200\n')
console.log(`sitemap: ${pages.length} pages for ${SITE}`)
