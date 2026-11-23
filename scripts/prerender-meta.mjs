// After `vite build`: writes a copy of index.html for every page (dist/about/index.html, dist/projects/<slug>/index.html ...)
// with that page's own title, description, canonical, Open Graph and Twitter tags, plus a plain-HTML summary in <noscript>.
// The app still renders normally in the browser; this makes the page's identity visible to crawlers and link previews
// (WhatsApp, Facebook, LinkedIn) that do not run JavaScript.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { root, SITE, buildPages } from './seo-data.mjs'

const dist = resolve(root, 'client/dist')
const templatePath = resolve(dist, 'index.html')
if (!existsSync(templatePath)) {
  console.error('prerender-meta: dist/index.html not found, run vite build first')
  process.exit(1)
}
const template = readFileSync(templatePath, 'utf8')
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const text = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

/** Replace a tag that matches `re`, or insert `tag` before </head>. */
const put = (html, re, tag) => (re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`))
const meta = (html, kind, key, value) => put(html, new RegExp(`<meta\\s+${kind}="${key}"[\\s\\S]*?>`), `<meta ${kind}="${key}" content="${attr(value)}" />`)

const { pages, content } = await buildPages()

const links = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/products', 'Products'],
  ['/projects', 'Projects'],
  ['/services', 'Services'],
  ['/quality', 'Quality'],
  ['/contact', 'Contact'],
]

const noscript = (p) => `<noscript>
      <main>
        <h1>${text(p.title)}</h1>
        <p>${text(p.description)}</p>
        <p>Qadri Glass Pvt. Ltd. · 278/3 Main Peco Road, Kot Lakhpat, Lahore, Pakistan · Tel 0300 8434320 · qadriglasslimited0@gmail.com</p>
        <nav aria-label="Main">
          <ul>${links.map(([h, n]) => `<li><a href="${h}">${n}</a></li>`).join('')}</ul>
          <ul>${content.services.map((s) => `<li><a href="/services/${s.slug}">${text(s.title)}</a></li>`).join('')}</ul>
          <ul>${content.projects.map((s) => `<li><a href="/projects/${s.slug}">${text(s.name)}</a></li>`).join('')}</ul>
        </nav>
        <p>This website needs JavaScript for its full experience.</p>
      </main>
    </noscript>`

let written = 0
for (const p of pages) {
  const url = SITE + (p.path === '/' ? '/' : p.path)
  let html = template
  html = put(html, /<title>[\s\S]*?<\/title>/, `<title>${text(p.title)}</title>`)
  html = meta(html, 'name', 'description', p.description)
  html = put(html, /<link\s+rel="canonical"[\s\S]*?>/, `<link rel="canonical" href="${attr(url)}" />`)
  html = meta(html, 'property', 'og:title', p.title)
  html = meta(html, 'property', 'og:description', p.description)
  html = meta(html, 'property', 'og:url', url)
  html = meta(html, 'property', 'og:image', p.image)
  html = meta(html, 'name', 'twitter:title', p.title)
  html = meta(html, 'name', 'twitter:description', p.description)
  html = meta(html, 'name', 'twitter:image', p.image)
  html = html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${noscript(p)}`)
  const out = p.path === '/' ? templatePath : resolve(dist, p.path.slice(1), 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
  written++
}
console.log(`prerender-meta: ${written} pages`)
