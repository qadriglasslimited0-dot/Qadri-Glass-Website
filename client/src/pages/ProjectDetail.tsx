import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { useSite } from '../lib/api'
import { useMotion } from '../hooks/useMotion'
import Seo, { breadcrumbLd } from '../components/Seo'
import Split from '../components/Split'
import GlassPlaceholder from '../components/GlassPlaceholder'
import Lightbox from '../components/Lightbox'
import NotFound from './NotFound'
import CTA from '../sections/CTA'

export default function ProjectDetail() {
  const { slug } = useParams()
  const { projects } = useSite()
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<number | null>(null)
  const i = projects.findIndex((p) => p.slug === slug)
  const p = projects[i]

  useMotion(
    root,
    ({ reduced }) => {
      if (reduced || !p) return
      const q = gsap.utils.selector(root.current!)
      q('[data-fade]').forEach((el) => gsap.from(el, { opacity: 0, y: 36, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }))
    },
    [slug],
  )

  if (!p) return <NotFound />
  const next = projects[(i + 1) % projects.length]
  const hasPhotos = p.images.length > 0
  const photoBtn = 'group relative block w-full bg-[rgb(var(--bg3)/0.55)] text-left'

  return (
    <>
      <Seo title={p.name} description={p.description.slice(0, 155)} path={`/projects/${p.slug}`} image={p.images[0]} type="article" jsonLd={breadcrumbLd([{ name: 'Projects', path: '/projects' }, { name: p.name, path: `/projects/${p.slug}` }])} />
      <article ref={root}>
        <header className="bg-coal pb-12 pt-[clamp(120px,16vw,200px)]">
          <div className="wrap">
            <Link to="/projects" className="ulink mb-8 !inline-flex items-center gap-2 text-sm font-medium">
              <ArrowLeft size={16} /> All projects
            </Link>
            <p className="eyebrow mb-5 !text-azure">
              {p.category} · {p.location}
            </p>
            <h1 className="display max-w-[16ch] text-[clamp(2.4rem,7vw,7rem)]">
              <Split text={p.name} when="ready" delay={0.15} />
            </h1>
          </div>
        </header>

        <section className="bg-coal pb-[var(--section)]">
          <div className="wrap">
            {hasPhotos ? (
              <button type="button" onClick={() => setOpen(0)} className={photoBtn} aria-label="Open photograph full size">
                <img src={p.images[0]} alt={p.name} decoding="async" className="mx-auto max-h-[86svh] w-auto max-w-full" />
                <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-md">
                  <Maximize2 size={15} /> View full size
                </span>
              </button>
            ) : (
              <div className="aspect-[16/9]">
                <GlassPlaceholder label="Photography pending" />
              </div>
            )}
          </div>
        </section>

        <section className="bg-ink section">
          <div className="wrap grid gap-12 lg:grid-cols-12">
            <div data-fade className="lg:col-span-6">
              <p className="eyebrow mb-4">The project</p>
              <p className="lead text-[1.1rem] text-silver">{p.description}</p>
              {p.pending && <p className="mt-4 text-xs text-mist">Placeholder entry — not a real project.</p>}
            </div>
            <div className="grid content-start gap-10 lg:col-span-5 lg:col-start-8">
              <dl data-fade className="border-t hairline">
                {[['Location', p.location], ['Category', p.category], ...(p.year ? [['Year', p.year]] : []), ...p.details.map((d) => [d.k, d.v])].map(([k, v]) => (
                  <div key={k + v} className="grid grid-cols-2 gap-4 border-b hairline py-4">
                    <dt className="text-mist">{k}</dt>
                    <dd className="font-normal">{v}</dd>
                  </div>
                ))}
              </dl>
              {p.applications.length > 0 && (
                <div data-fade>
                  <p className="eyebrow mb-4">Glass applications</p>
                  <ul className="flex flex-wrap gap-2">
                    {p.applications.map((a) => (
                      <li key={a} className="border border-[rgb(var(--fg)/0.2)] px-4 py-2 text-sm text-silver">{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {p.images.length > 1 && (
          <section className="bg-coal section">
            <div className="wrap">
              <p className="eyebrow mb-8">More photographs</p>
              <div className="columns-1 gap-6 md:columns-2">
                {p.images.slice(1).map((s, n) => (
                  <button key={s} type="button" onClick={() => setOpen(n + 1)} className={`${photoBtn} mb-6 break-inside-avoid`} aria-label={`Open photograph ${n + 2} full size`}>
                    <img src={s} alt={`${p.name} — photograph ${n + 2}`} loading="lazy" decoding="async" className="h-auto w-full" />
                    <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center bg-white text-ink opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                      <Maximize2 size={15} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {projects.length > 1 && (
          <Link to={`/projects/${next.slug}`} className="group block border-y hairline bg-ink section">
            <div className="wrap flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow mb-4">Next project</p>
                <p className="display text-[clamp(2rem,5vw,5rem)] transition-transform duration-700 group-hover:translate-x-4">{next.name}</p>
              </div>
              <ArrowRight size={42} className="shrink-0 transition-transform duration-500 group-hover:translate-x-3" />
            </div>
          </Link>
        )}
      </article>
      {open !== null && hasPhotos && <Lightbox images={p.images} index={open} onIndex={setOpen} onClose={() => setOpen(null)} title={p.name} />}
      <CTA />
    </>
  )
}
