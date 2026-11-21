import os, re
os.chdir(r'C:\Users\Dell\Desktop\AGENT\qadri-glass\client\src')
miss = []
def rd(p): return open(p, encoding='utf8').read()
def wr(p, s): open(p, 'w', encoding='utf8').write(s)
def rw(p, pairs):
    s = rd(p)
    for a, b in pairs:
        if a not in s: miss.append((p, a[:70]))
        s = s.replace(a, b, 1)
    wr(p, s)

# ---------- 1. site reads straight from Supabase (RLS exposes only published rows) ----------
rw('lib/api.ts', [
    ("import { COMPANY,", "import { supabase } from './supabase'\nimport { COMPANY,"),
    ("/** Public content from the Express API. Falls back silently to seed content if unavailable. */\nexport async function fetchSiteData(): Promise<SiteData> {\n  try {",
     """/** Public content. Reads Supabase directly (row-level security only exposes published rows), then the Express API, then seed content. */
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
  try {"""),
])

# ---------- 2. Hero uses an uploaded photo when set ----------
rw('sections/Hero.tsx', [
    ("import { scrollToTarget } from '../lib/lenis'", "import { scrollToTarget } from '../lib/lenis'\nimport { useSite } from '../lib/api'"),
    ("export default function Hero() {\n  const root = useRef<HTMLElement>(null)\n", "export default function Hero() {\n  const root = useRef<HTMLElement>(null)\n  const { site } = useSite()\n  const heroImage = site['image.hero']\n"),
    ("        {webglAvailable() ? (", "        {heroImage ? (\n          <img src={heroImage} alt=\"\" fetchPriority=\"high\" decoding=\"async\" className=\"kenburns absolute inset-0 h-full w-full object-cover\" />\n        ) : webglAvailable() ? ("),
])
open('index.css', 'a', encoding='utf8').write("""
@keyframes kenburns { from { transform: scale(1.02); } to { transform: scale(1.1); } }
.kenburns { animation: kenburns 24s ease-in-out infinite alternate; will-change: transform; }
@media (prefers-reduced-motion: reduce) { .kenburns { animation: none; } }
""")

# ---------- 3. Service visuals + CTA ----------
rw('components/ServiceVisual.tsx', [
    ("import GlassScene,", "import { useSite } from '../lib/api'\nimport GlassScene,"),
    ("  const [photo, setPhoto] = useState<'loading' | 'ok' | 'none'>('loading')\n", "  const [photo, setPhoto] = useState<'loading' | 'ok' | 'none'>('loading')\n  const { site } = useSite()\n  const src = site[`image.service.${slug}`] || `/images/services/${slug}.jpg`\n"),
    ("          src={`/images/services/${slug}.jpg`}\n", "          key={src}\n          src={src}\n"),
])
rw('sections/CTA.tsx', [
    ("import { useCompany } from '../lib/api'", "import { useCompany, useSite } from '../lib/api'"),
    ("  const C = useCompany()\n", "  const C = useCompany()\n  const { site } = useSite()\n"),
    ("          <GlassScene variant=\"facade\" seed={2} />", "          {site['image.cta'] ? <img src={site['image.cta']} alt=\"\" loading=\"lazy\" decoding=\"async\" className=\"h-full w-full object-cover\" /> : <GlassScene variant=\"facade\" seed={2} />}"),
])

# ---------- 4. Admin: Site images tab ----------
s = rd('pages/admin/Admin.tsx')
s = s.replace("{ key: 'overview', label: 'Overview' }, { key: 'enquiries', label: 'Enquiries' },", "{ key: 'overview', label: 'Overview' }, { key: 'enquiries', label: 'Enquiries' }, { key: 'images', label: 'Site images' },")
s = s.replace("tab === 'enquiries' ? <Enquiries /> :", "tab === 'enquiries' ? <Enquiries /> : tab === 'images' ? <SiteImages /> :", 1)
s = s.replace("/* ------------------------------ Enquiries ------------------------------ */", """/* ------------------------------ Site images ------------------------------ */
const SLOTS: { key: string; label: string; hint: string }[] = [
  { key: 'image.hero', label: 'Home hero background', hint: 'Wide landscape photo, at least 2000px wide. Replaces the 3D glass wall.' },
  { key: 'image.service.architectural-glass', label: 'Service: Architectural Glass', hint: 'Landscape, about 1800px wide.' },
  { key: 'image.service.custom-fabrication', label: 'Service: Custom Fabrication', hint: 'Landscape, about 1800px wide.' },
  { key: 'image.service.professional-installation', label: 'Service: Professional Installation', hint: 'Landscape, about 1800px wide.' },
  { key: 'image.service.decorative-solutions', label: 'Service: Decorative Solutions', hint: 'Landscape, about 1800px wide.' },
  { key: 'image.cta', label: 'Contact call-to-action', hint: 'Portrait photo, about 4:5.' },
]

function SiteImages() {
  const [vals, setVals] = useState<Record<string, string>>({})
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState('')
  const load = useCallback(async () => {
    const { data } = await supabase!.from('site_content').select('key,value').like('key', 'image.%')
    setVals(Object.fromEntries((data ?? []).map((r: { key: string; value: string }) => [r.key, r.value])))
  }, [])
  useEffect(() => void load(), [load])

  const upload = async (key: string, file: File) => {
    setBusy(key)
    setMsg('')
    const path = `site/${key.replace(/\\W+/g, '-')}-${Date.now()}-${file.name.replace(/[^\\w.-]+/g, '_')}`
    const up = await supabase!.storage.from('media').upload(path, file, { cacheControl: '31536000' })
    if (up.error) {
      setMsg(up.error.message)
      setBusy('')
      return
    }
    const url = supabase!.storage.from('media').getPublicUrl(path).data.publicUrl
    const { error } = await supabase!.from('site_content').upsert({ key, value: url, updated_at: new Date().toISOString() })
    setMsg(error ? error.message : 'Saved. The website shows it right away.')
    setBusy('')
    load()
  }
  const remove = async (key: string) => {
    const { error } = await supabase!.from('site_content').delete().eq('key', key)
    setMsg(error ? error.message : 'Removed. The website falls back to its default visual.')
    load()
  }

  return (
    <>
      <h1 className="display h-md mb-3">Site images</h1>
      <p className="mb-8 max-w-xl text-sm text-mist">Replace the main pictures on the website. Project and product photos are edited inside Projects and Products. Use genuine Qadri Glass photography.</p>
      {msg && <p role="status" className="mb-5 text-sm text-azure">{msg}</p>}
      <ul className="grid gap-5 md:grid-cols-2">
        {SLOTS.map((s) => (
          <li key={s.key} className="border border-[rgb(var(--fg)/0.15)] p-5">
            <p className="font-normal">{s.label}</p>
            <p className="mb-4 mt-1 text-xs text-mist">{s.hint}</p>
            <div className="mb-4 aspect-[16/9] overflow-hidden bg-coal">
              {vals[s.key] ? <img src={vals[s.key]} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-xs text-mist">Default visual in use</div>}
            </div>
            <div className="flex flex-wrap gap-3">
              <label className={`${btn} flex cursor-pointer items-center gap-2`}>
                <ImagePlus size={14} /> {busy === s.key ? 'Uploading…' : vals[s.key] ? 'Replace' : 'Upload'}
                <input type="file" accept="image/*" className="sr-only" disabled={busy === s.key} onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(s.key, f) }} />
              </label>
              {vals[s.key] && <button className={btn} onClick={() => remove(s.key)}>Remove</button>}
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

/* ------------------------------ Enquiries ------------------------------ */""", 1)
wr('pages/admin/Admin.tsx', s)
print('MISSES', miss)
