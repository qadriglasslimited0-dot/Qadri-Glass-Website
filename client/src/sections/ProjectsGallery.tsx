import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useSite } from '../lib/api'
import type { Project } from '../lib/content'
import Split from '../components/Split'
import GlassPlaceholder from '../components/GlassPlaceholder'
import { Reveal, MaskImage } from '../components/Reveal'

/**
 * Selected work, as an editorial run of full-width chapters. Each project gets its own band; backgrounds
 * alternate (bright glass white -> logo green -> mint) and the photograph swaps sides, so the page keeps its
 * rhythm. Photographs are framed to their own proportions (never forced into a wide crop) and drift gently
 * inside the frame as you scroll.
 */

/** The photo's true width/height, clamped so frames stay elegant. Defaults to 3:4 until it is known. */
function useRatio(src?: string) {
  const [r, setR] = useState(0.75)
  useEffect(() => {
    if (!src) return
    const im = new Image()
    im.onload = () => im.naturalHeight && setR(Math.min(0.92, Math.max(0.62, im.naturalWidth / im.naturalHeight)))
    im.src = src
  }, [src])
  return r
}

function Feature({ p, i, total }: { p: Project; i: number; total: number }) {
  const img = p.images[0]
  const ratio = useRatio(img)
  const deep = i % 2 === 1
  const flip = i % 2 === 1
  const to = `/projects/${p.slug}`
  const facts = p.details.slice(0, 3)

  return (
    <article data-card className={`relative overflow-hidden ${deep ? 'theme-deep bg-ink' : i % 4 === 2 ? 'theme-dark bg-ink' : 'bg-ink'} py-[clamp(72px,9vw,150px)]`}>
      {/* oversized chapter number behind everything */}
      <span aria-hidden="true" className={`pointer-events-none absolute -top-[4vw] select-none font-display text-[clamp(14rem,34vw,34rem)] font-extrabold leading-none tracking-[-0.06em] text-[rgb(var(--fg)/0.045)] ${flip ? 'left-[2vw]' : 'right-[2vw]'}`}>
        {String(i + 1).padStart(2, '0')}
      </span>

      <div className={`wrap relative grid items-center gap-10 lg:grid-cols-12 lg:gap-8 ${flip ? '' : ''}`}>
        {/* ---- photograph ---- */}
        <div className={`lg:col-span-5 ${flip ? 'lg:order-2 lg:col-start-8' : 'lg:col-start-1'}`}>
          <Link to={to} aria-label={`View ${p.name}`} data-cursor="VIEW" className="group relative block">
            <div className="relative" style={{ aspectRatio: String(ratio) }}>
              {img ? (
                <div className="absolute inset-0 shadow-[0_50px_90px_-50px_rgba(10,40,25,0.7)]">
                  <MaskImage src={img} alt={p.name} parallax pos="50% 38%" loading={i < 2 ? 'eager' : 'lazy'} className="h-full w-full" imgClassName="transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]" curtain={deep ? 'rgb(246 244 238)' : 'rgb(16 20 18)'} />
                </div>
              ) : (
                <div className="absolute inset-0">
                  <GlassPlaceholder index={i} label={p.pending ? 'Photography pending' : p.name} />
                </div>
              )}
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#0f1311]/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="absolute -bottom-5 right-6 z-30 grid h-[72px] w-[72px] place-items-center rounded-full bg-[rgb(var(--support))] text-[#0e2b3a] shadow-[0_20px_40px_-18px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110">
                <ArrowUpRight size={28} />
              </span>
            </div>
          </Link>
        </div>

        {/* ---- project information ---- */}
        <div className={`lg:col-span-6 ${flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-7'}`}>
          <p className="eyebrow mb-5">
            {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · {p.category}
          </p>
          <h3 className="display text-[clamp(2.4rem,5.2vw,5.4rem)]">
            <Split text={p.name} />
          </h3>
          <p className="mt-5 text-lg font-semibold text-silver">
            {p.location}
            {p.year ? ` · ${p.year}` : ''}
          </p>
          {p.description && <p className="lead mt-6 line-clamp-4 max-w-[54ch]">{p.description}</p>}

          {facts.length > 0 && (
            <dl className="mt-8 grid max-w-[560px] gap-x-8 gap-y-4 border-t border-[rgb(var(--fg)/0.2)] pt-6 sm:grid-cols-3">
              {facts.map((d) => (
                <div key={d.k}>
                  <dt className="eyebrow !gap-0 before:hidden">{d.k}</dt>
                  <dd className="mt-1 text-[15px] font-semibold leading-snug">{d.v}</dd>
                </div>
              ))}
            </dl>
          )}

          <Link to={to} className="btn btn-solid group/btn mt-9">
            View project <ArrowRight size={16} className="arrow" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function ProjectsGallery() {
  const { projects } = useSite()
  const list = projects.slice(0, 5)

  return (
    <section id="world" data-section="Portfolio" className="relative">
      <div className="relative overflow-hidden bg-ink pb-[clamp(24px,4vw,60px)] pt-[var(--section)]">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="eyebrow mb-6">Portfolio</p>
              <h2 className="display text-[clamp(3rem,9vw,9.4rem)]">
                <Split text="Selected _work_" />
              </h2>
            </div>
            <Reveal className="flex max-w-[36ch] flex-col items-start gap-5">
              <p className="lead">Glass we have supplied and installed, shown in full.</p>
              <Link to="/projects" className="btn">
                All projects <ArrowRight size={16} className="arrow" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
      {list.map((p, i) => (
        <Feature key={p.slug} p={p} i={i} total={list.length} />
      ))}
    </section>
  )
}
