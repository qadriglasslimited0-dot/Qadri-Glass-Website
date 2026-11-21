import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { useMotion } from '../hooks/useMotion'
import type { Service } from '../lib/content'
import ServiceVisual from './ServiceVisual'
import Split from './Split'
import Magnetic from './Magnetic'

function Apps({ s, dark }: { s: Service; dark?: boolean }) {
  return (
    <div data-r>
      <p className="eyebrow mb-4">Applications{s.draft ? ' · indicative' : ''}</p>
      <ul className="flex flex-wrap gap-2">
        {s.applications.map((a) => (
          <li key={a} className={`border px-4 py-2 text-sm ${dark ? 'border-white/20 bg-ink/50' : 'border-white/15'} text-silver`}>{a}</li>
        ))}
      </ul>
    </div>
  )
}

function Steps({ s, horizontal }: { s: Service; horizontal?: boolean }) {
  return (
    <div data-r>
      <p className="eyebrow mb-5">Process</p>
      <ol className={horizontal ? 'grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4' : 'grid gap-0 border-t border-white/10'}>
        {s.process.map((p, i) => (
          <li key={p.t} className={horizontal ? 'bg-coal p-6' : 'grid grid-cols-[3rem_1fr] gap-4 border-b border-white/10 py-5'}>
            <span className="font-wide text-[10px] tracking-[0.3em] text-azure">0{i + 1}</span>
            <div>
              <h4 className="mb-1 font-normal uppercase tracking-wide">{p.t}</h4>
              <p className="text-sm text-silver/70">{p.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Projects() {
  return (
    <div data-r>
      <p className="eyebrow mb-3">Relevant projects</p>
      <p className="max-w-[44ch] text-sm text-mist">
        Verified Qadri Glass projects relating to this service will be listed here. <Link to="/projects" className="ulink text-silver">View the portfolio</Link>
      </p>
    </div>
  )
}

function Consult({ s }: { s: Service }) {
  return (
    <div data-r>
      <Magnetic>
        <Link to={`/contact?category=${encodeURIComponent(s.title)}`} className="btn btn-solid" data-cursor="">
          Book a consultation <ArrowRight size={14} className="arrow" />
        </Link>
      </Magnetic>
    </div>
  )
}

export default function ServiceBlock({ s, index, detail = false }: { s: Service; index: number; detail?: boolean }) {
  const root = useRef<HTMLElement>(null)
  const v = index % 4

  useMotion(root, ({ reduced, desktop }) => {
    if (reduced) return
    const el = root.current!
    const q = gsap.utils.selector(el)
    gsap.from(q('[data-r]'), { opacity: 0, y: 44, stagger: 0.12, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 62%', once: true } })
    // Each variant gets its own treatment
    if (v === 0) gsap.fromTo(q('[data-art]'), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 60%', once: true } })
    if (v === 1) gsap.fromTo(q('[data-art]'), { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 20%', scrub: true } })
    if (v === 2 && desktop) gsap.fromTo(q('[data-art]'), { rotate: -3, scale: 0.9 }, { rotate: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'center 50%', scrub: true } })
    if (v === 3) gsap.fromTo(q('[data-art]'), { scale: 1.25, opacity: 0.2 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'center center', scrub: true } })
  })

  const title = (
    <>
      <p data-r className="eyebrow mb-5">{s.kicker}</p>
      {(() => {
        const H = detail ? 'h1' : 'h2'
        return (
          <H className="display text-[clamp(2.1rem,4.4vw,4.6rem)]">
            <Split text={s.title} when={detail ? 'ready' : 'scroll'} />
          </H>
        )
      })()}
      <p data-r className="lead mt-6 max-w-[48ch]">{s.body}</p>
      {s.draft && <p data-r className="mt-4 text-xs text-mist">Draft description — to be confirmed with Qadri Glass.</p>}
    </>
  )
  const more = !detail && (
    <div data-r>
      <Link to={`/services/${s.slug}`} className="ulink inline-flex items-center gap-2 font-wide text-[10px] uppercase tracking-[0.3em]">
        Full service page <ArrowUpRight size={14} />
      </Link>
    </div>
  )

  const artPanel = (cls: string) => (
    <div data-art className={`glass relative overflow-hidden ${cls}`}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 60% at 30% 10%, rgb(var(--accent) / 0.18), transparent 70%)' }} />
      <ServiceVisual slug={s.slug} alt={s.title} className="relative" />
    </div>
  )

  return (
    <section ref={root} id={s.slug} data-section={s.title} className={`relative overflow-hidden section ${index % 2 ? 'bg-coal' : 'bg-ink'}`}>
      <div className="wrap relative">
        {v === 0 && (
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="grid gap-12 lg:col-span-6">
              <div>{title}</div>
              <Apps s={s} />
              <Projects />
              <div className="flex flex-wrap items-center gap-6"><Consult s={s} />{more}</div>
            </div>
            {artPanel('aspect-[4/3] lg:col-span-6')}
          </div>
        )}
        {v === 1 && (
          <div className="grid gap-16">
            {artPanel('aspect-[16/9] sm:aspect-[21/9] ')}
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">{title}</div>
              <div className="grid content-start gap-12 lg:col-span-5"><Apps s={s} /><Projects /></div>
            </div>
            <Steps s={s} horizontal />
            <div className="flex flex-wrap items-center gap-6"><Consult s={s} />{more}</div>
          </div>
        )}
        {v === 2 && (
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5 lg:order-2">
              <div className="lg:sticky lg:top-28">{artPanel('aspect-square')}</div>
            </div>
            <div className="grid gap-14 lg:col-span-7 lg:order-1">
              <div>{title}</div>
              <Steps s={s} />
              <Apps s={s} />
              <Projects />
              <div className="flex flex-wrap items-center gap-6"><Consult s={s} />{more}</div>
            </div>
          </div>
        )}
        {v === 3 && (
          <div className="relative grid gap-12">
            <div className="relative overflow-hidden border border-white/10">
              {artPanel('aspect-[4/3] sm:aspect-[16/8] !border-0')}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-12">
                <Apps s={s} dark />
              </div>
            </div>
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">{title}</div>
              <div className="grid content-start gap-12 lg:col-span-5"><Steps s={s} /></div>
            </div>
            <Projects />
            <div className="flex flex-wrap items-center gap-6"><Consult s={s} />{more}</div>
          </div>
        )}
      </div>
    </section>
  )
}
