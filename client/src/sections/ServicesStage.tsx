import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { useSite } from '../lib/api'
import { useMotion } from '../hooks/useMotion'
import ServiceVisual from '../components/ServiceVisual'
import Split from '../components/Split'

/**
 * Full-screen pinned showcase.
 * Motion budget: transform + opacity only (compositor-friendly) — no clip-path, blur, or filter animation.
 * Desktop: each service slides its glass visual up over the previous one while the copy swaps.
 * Mobile: plain stacked cards.
 */
export default function ServicesStage() {
  const root = useRef<HTMLElement>(null)
  const { services } = useSite()

  useMotion(
    root,
    ({ reduced, desktop }) => {
      const el = root.current!
      const q = gsap.utils.selector(el)
      const texts = q('[data-s]')
      const visuals = q('[data-v]')
      if (reduced) return

      if (!desktop) {
        texts.forEach((t, i) => gsap.from([t, visuals[i]], { opacity: 0, y: 40, duration: 1, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: t, start: 'top 88%', once: true } }))
        return
      }
      gsap.set(texts.slice(1), { autoAlpha: 0, y: 40 })
      gsap.set(visuals.slice(1), { yPercent: 200, force3D: true })
      gsap.set(q('[data-fill]'), { scaleY: 0 })

      const steps = services.length - 1
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: q('[data-pin]')[0], start: 'top top', end: () => `+=${services.length * 85}%`, scrub: true, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
      })
      tl.to(q('[data-fill]'), { scaleY: 1, duration: steps }, 0)
      texts.forEach((_, i) => {
        if (i === 0) return
        const at = i - 0.7
        tl.to(texts[i - 1], { autoAlpha: 0, y: -40, duration: 0.3 }, at)
          .to(visuals[i], { yPercent: 0, duration: 0.7, ease: 'power2.inOut' }, at)
          .to(visuals[i - 1], { yPercent: -6, duration: 0.7, ease: 'power2.inOut' }, at)
          .to(texts[i], { autoAlpha: 1, y: 0, duration: 0.3 }, at + 0.45)
      })
      tl.to({}, { duration: 0.3 })
    },
    [services.length],
  )

  return (
    <section ref={root} data-section="Services" className="relative bg-ink">
      <div data-pin className="relative lg:flex lg:h-[100svh] lg:min-h-[640px] lg:flex-col lg:justify-center lg:overflow-hidden">
        <div className="wrap pt-[var(--section)] lg:pt-0">
          <p className="eyebrow mb-5">What we do</p>
          <h2 className="display max-w-[18ch] text-[clamp(2rem,min(5.2vw,8.5svh),5rem)]">
            <Split text={'Four ways we work _with glass._'} when="ready" />
          </h2>
        </div>

        <div className="wrap relative mt-14 grid gap-y-20 pb-[var(--section)] lg:mt-[4svh] lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0 lg:pb-0">
          {services.map((s, i) => (
            <article key={s.slug} className="contents">
              <div data-v className="aspect-[4/3] shadow-[0_30px_70px_-40px_rgba(29,92,56,0.5)] lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:aspect-auto lg:h-[56svh]" style={{ zIndex: i + 1 }}>
                <ServiceVisual slug={s.slug} alt={s.title} seed={i} lite />
              </div>
              <div data-s className="flex flex-col justify-center lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:h-[56svh]">
                <span className="font-wide text-[11px] tracking-[0.3em] text-azure">0{i + 1} / 0{services.length}</span>
                <h3 className="mt-5 text-[clamp(2rem,min(3.9vw,7svh),4.2rem)] font-extrabold uppercase leading-[1] tracking-tighter">{s.title}</h3>
                <p className="eyebrow mt-4">{s.kicker}</p>
                <p className="lead mt-6 max-w-[40ch]">{s.summary}</p>
                <Link to={`/services/${s.slug}`} data-cursor="" className="btn mt-9 w-fit">
                  Explore <ArrowUpRight size={14} className="arrow" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="absolute bottom-10 left-[var(--gutter)] hidden h-24 w-px bg-[rgb(var(--fg)/0.15)] lg:block" aria-hidden="true">
          <div data-fill className="h-full w-full origin-top bg-azure" />
        </div>
      </div>
    </section>
  )
}
