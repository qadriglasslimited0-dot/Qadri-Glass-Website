import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowDown } from 'lucide-react'
import { gsap, finePointer, whenReady, EASE } from '../lib/gsap'
import { scrollToTarget } from '../lib/lenis'
import { useSite } from '../lib/api'
import { useMotion } from '../hooks/useMotion'
import Split from '../components/Split'
import Magnetic from '../components/Magnetic'
import RotatingWord from '../components/RotatingWord'

const WORDS = ['Transparency', 'Precision', 'Craftsmanship', 'Innovation', 'Architecture']

/** One sheet of glass in the hero composition: real photograph behind a translucent, edge-lit pane. */
function Pane({ src, alt, className = '', fit = 'center', dim = 0 }: { src?: string; alt: string; className?: string; fit?: string; dim?: number }) {
  return (
    <div className={`glass-pane glass-edge pane-glint ${className}`}>
      {src && <img src={src} alt={alt} decoding="async" fetchPriority="high" style={{ objectPosition: fit, opacity: 1 - dim }} className="absolute inset-0 h-full w-full object-cover" />}
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-[rgb(var(--mintc)/0.22)]" />
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-white/70" />
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-white/70" />
    </div>
  )
}

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const { site, projects } = useSite()

  // Real photography only: first project photo leads, the uploaded hero photo and next projects flank it.
  const shots = Array.from(new Set([projects[0]?.images[0], site['image.hero'], projects[1]?.images[0], projects[2]?.images[0]].filter(Boolean) as string[]))
  const [center, left, right] = shots

  useMotion(root, ({ reduced, desktop }) => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    if (reduced) return

    gsap.set(q('[data-in]'), { opacity: 0, y: 28 })
    gsap.set(q('[data-pane]'), { opacity: 0, y: 70 })
    gsap.set(q('[data-tech] .draw'), { strokeDashoffset: 1 })
    const intro = gsap.timeline({ paused: true, defaults: { ease: EASE } })
    intro
      .to(q('[data-in]'), { opacity: 1, y: 0, duration: 1.2, stagger: 0.11 }, 0.5)
      .to(q('[data-pane]'), { opacity: 1, y: 0, duration: 1.7, stagger: 0.16 }, 0.35)
      .to(q('[data-tech] .draw'), { strokeDashoffset: 0, duration: 1.6, stagger: 0.08, ease: 'power2.inOut' }, 1.5)
    const off = whenReady(() => intro.play())

    // scroll: glass layers separate at different speeds, copy drifts away (desktop only)
    if (desktop) {
      gsap.to(q('[data-pane="a"]'), { yPercent: -14, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to(q('[data-pane="b"]'), { yPercent: -7, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to(q('[data-pane="c"]'), { yPercent: -22, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
    }

    // pointer depth: each pane drifts a little, front pane the most
    let cleanup = () => {}
    if (finePointer() && desktop) {
      const depth: Record<string, number> = { a: 12, b: 26, c: 18 }
      const movers = Object.entries(depth).map(([k, d]) => {
        const t = q(`[data-depth="${k}"]`)[0]
        return { d, x: gsap.quickTo(t, 'x', { duration: 1.2, ease: 'power3.out' }), y: gsap.quickTo(t, 'y', { duration: 1.2, ease: 'power3.out' }) }
      })
      const move = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        movers.forEach((m) => {
          m.x(nx * -m.d)
          m.y(ny * -m.d * 0.6)
        })
      }
      window.addEventListener('pointermove', move, { passive: true })
      cleanup = () => window.removeEventListener('pointermove', move)
    }
    return () => {
      off()
      cleanup()
    }
  })

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToTarget(id, -20)
  }

  return (
    <section ref={root} data-section="Intro" id="top" className="relative overflow-hidden bg-ink pb-20 pt-[104px] lg:flex lg:min-h-[100svh] lg:items-center lg:pb-16">
      {/* soft light wash */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-[12%] top-[6%] h-[60vmax] w-[60vmax] rounded-full" style={{ background: 'radial-gradient(circle, rgb(var(--mintc) / 0.32), transparent 62%)' }} />

      <div className="wrap relative grid items-center gap-12 lg:grid-cols-12 lg:gap-6">
        {/* ---------- copy ---------- */}
        <div className="relative z-10 lg:col-span-7">
          <p data-in className="eyebrow mb-7">Qadri Glass · Lahore · Est. 1960</p>
          <h1 className="display text-[clamp(2.7rem,6.6vw,7.4rem)]">
            <span className="block font-light">
              <Split text="The art of" when="ready" delay={0.15} />
            </span>
            <span className="rw-glow block text-[rgb(var(--brand))]" style={{ minHeight: '1em' }}>
              <RotatingWord words={WORDS} suffix={<span className="text-[rgb(var(--amber))]">.</span>} />
            </span>
          </h1>
          <p data-in className="lead mt-8 max-w-[46ch]">
            Over 65 years of transforming spaces through glass craftsmanship, precision and innovation.
          </p>
          <div data-in className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link to="/contact" className="btn btn-solid">
                Start an enquiry <ArrowRight size={16} className="arrow" />
              </Link>
            </Magnetic>
            <Magnetic>
              <a href="#world" onClick={go('#world')} className="btn">
                Explore our work <ArrowDown size={16} />
              </a>
            </Magnetic>
          </div>
          <dl data-in className="mt-14 hidden max-w-[560px] grid-cols-3 gap-6 border-t border-[rgb(var(--fg)/0.14)] pt-6 sm:grid">
            {[
              ['Established', '1960'],
              ['Based in', 'Lahore, Pakistan'],
              ['Generations', 'Three'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow !gap-0 before:hidden">{k}</dt>
                <dd className="mt-1.5 font-display text-lg font-bold leading-tight">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---------- the glass ---------- */}
        <div className="relative lg:col-span-5">
          <div className="theme-deep relative mx-auto w-full max-w-[560px] overflow-visible rounded-[28px] bg-[linear-gradient(160deg,#0f3a24_0%,#0a2116_70%)] px-[7%] pb-[9%] pt-[9%] shadow-[0_50px_90px_-40px_rgba(8,30,20,0.7)] lg:max-w-none">
            {/* fine technical grid + light */}
            <div aria-hidden="true" className="absolute inset-0 rounded-[28px] opacity-[0.35]" style={{ backgroundImage: 'linear-gradient(rgb(255 255 255 / 0.07) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.07) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
            <div aria-hidden="true" className="absolute -right-10 -top-10 h-[70%] w-[70%] rounded-full" style={{ background: 'radial-gradient(circle, rgb(var(--amber) / 0.28), transparent 65%)' }} />

            <div className="relative mx-auto aspect-[5/6] w-full">
              <div data-depth="a" className="absolute left-0 top-[14%] h-[60%] w-[38%]">
                <div data-pane="a" className="h-full w-full">
                  <Pane src={left} alt="Qadri Glass work" fit="42% 50%" dim={0.08} className="h-full w-full" />
                </div>
              </div>
              <div data-depth="c" className="absolute right-0 top-[26%] h-[58%] w-[36%]">
                <div data-pane="c" className="h-full w-full">
                  <Pane src={right} alt="Qadri Glass work" fit="50% 40%" dim={0.1} className="h-full w-full" />
                </div>
              </div>
              <div data-depth="b" className="absolute left-[20%] top-0 h-[90%] w-[54%]">
                <div data-pane="b" className="relative h-full w-full">
                  <Pane src={center} alt={projects[0]?.name ?? 'Architectural glass by Qadri Glass'} fit="50% 35%" className="h-full w-full" />
                  {/* technical overlay: brackets and dimension lines */}
                  <svg data-tech aria-hidden="true" viewBox="-3 -3 106 112" preserveAspectRatio="none" className="pointer-events-none absolute -inset-[3%] h-[106%] w-[106%] overflow-visible text-[rgb(var(--amber))]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path className="draw" pathLength={1} vectorEffect="non-scaling-stroke" d="M0 9 V0 H9" />
                    <path className="draw" pathLength={1} vectorEffect="non-scaling-stroke" d="M91 0 H100 V9" />
                    <path className="draw" pathLength={1} vectorEffect="non-scaling-stroke" d="M100 91 V100 H91" />
                    <path className="draw" pathLength={1} vectorEffect="non-scaling-stroke" d="M9 100 H0 V91" />
                    <path className="draw" pathLength={1} vectorEffect="non-scaling-stroke" d="M0 108 H100 M0 105 V111 M100 105 V111" strokeOpacity="0.8" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button type="button" onClick={go('#story')} aria-label="Scroll to our story" data-in className="absolute inset-x-0 bottom-6 mx-auto hidden w-fit flex-col items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-mist lg:flex">
        Scroll
        <span className="relative block h-9 w-px overflow-hidden bg-[rgb(var(--fg)/0.15)]">
          <span className="scrollcue absolute inset-0" />
        </span>
      </button>
    </section>
  )
}
