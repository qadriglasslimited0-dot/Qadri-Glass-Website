// Generates client/public/sitemap.xml + robots.txt. Set VITE_SITE_URL (or SITE_URL) before building for production.
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const site = (process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://www.example.com').replace(/\/$/, '')
const paths = ['/', '/about', '/products', '/projects', '/services', '/services/architectural-glass', '/services/custom-fabrication', '/services/professional-installation', '/services/decorative-solutions', '/quality', '/contact']
const today = new Date().toISOString().slice(0, 10)

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
  .map((p) => `  <url><loc>${site}${p}</loc><lastmod>${today}</lastmod><priority>${p === '/' ? '1.0' : '0.7'}</priority></url>`)
  .join('\n')}\n</urlset>\n`

mkdirSync(resolve(root, 'client/public'), { recursive: true })
writeFileSync(resolve(root, 'client/public/sitemap.xml'), xml)
writeFileSync(resolve(root, 'client/public/robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${site}/sitemap.xml\n`)
writeFileSync(resolve(root, 'client/public/_redirects'), '/*    /index.html   200\n')
console.log(`sitemap for ${site}`)
