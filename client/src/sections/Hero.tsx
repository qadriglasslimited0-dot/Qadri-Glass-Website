import { lazy, Suspense, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { gsap, heroState, finePointer, whenReady } from '../lib/gsap'
import { scrollToTarget } from '../lib/lenis'
import { useSite } from '../lib/api'
import { useMotion } from '../hooks/useMotion'
import Split from '../components/Split'
import Magnetic from '../components/Magnetic'
import { GlassFallback, WebGLBoundary, webglAvailable } from '../components/WebGL'

const HeroScene = lazy(() => import('../components/HeroScene'))

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const { site } = useSite()
  const heroImage = site['image.hero']

  useMotion(root, ({ reduced, desktop }) => {
    const el = root.current!
    const q = gsap.utils.selector(el)

    // Entrance of supporting elements (headline is handled by <Split when="ready" />)
    if (!reduced) {
      gsap.set(q('[data-in]'), { opacity: 0, y: 24 })
      const off = whenReady(() => {
        gsap.to(q('[data-in]'), { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12, delay: 1.0 })
      })
      // cleanup for the gate listener
      void off
    }

    // Scroll-controlled exit: type drifts up & fades, scene dollies forward through shared state
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          heroState.progress = self.progress
        },
      },
    })
      .to(q('[data-content]'), { yPercent: desktop ? -22 : -12, opacity: 0.0, ease: 'none' }, 0)
      .to(q('[data-cue]'), { opacity: 0, ease: 'none', duration: 0.2 }, 0)

    // Cursor-responsive layers + light sweep
    if (!reduced && finePointer()) {
      const sx = gsap.quickTo(q('[data-spot]'), 'x', { duration: 1.1, ease: 'power3.out' })
      const sy = gsap.quickTo(q('[data-spot]'), 'y', { duration: 1.1, ease: 'power3.out' })
      const cx = gsap.quickTo(q('[data-h1]'), 'x', { duration: 1.4, ease: 'power3.out' })
      const cy = gsap.quickTo(q('[data-h1]'), 'y', { duration: 1.4, ease: 'power3.out' })
      const move = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        heroState.mx = nx
        heroState.my = -ny
        sx(e.clientX - window.innerWidth / 2)
        sy(e.clientY - window.innerHeight / 2)
        cx(nx * -16)
        cy(ny * -10)
      }
      window.addEventListener('pointermove', move, { passive: true })
      return () => {
        window.removeEventListener('pointermove', move)
        heroState.mx = 0
        heroState.my = 0
        heroState.progress = 0
      }
    }
    return () => {
      heroState.progress = 0
    }
  })

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToTarget(id, -20)
  }

  return (
    <section ref={root} data-section="Intro" id="top" className="theme-dark relative h-[100svh] min-h-[620px] overflow-hidden bg-ink grain">
      <div data-canvas className="absolute inset-0">
        {heroImage ? (
          <img src={heroImage} alt="" fetchPriority="high" decoding="async" className="kenburns absolute inset-0 h-full w-full object-cover" />
        ) : webglAvailable() ? (
          <WebGLBoundary fallback={<GlassFallback />}>
            <Suspense fallback={<GlassFallback />}>
              <HeroScene />
            </Suspense>
          </WebGLBoundary>
        ) : (
          <GlassFallback />
        )}
      </div>
      {/* vignettes */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/90" />
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${heroImage ? 'from-ink/95 via-ink/70 via-[55%] to-ink/10' : 'from-ink/85 via-ink/25 to-transparent'}`}
      />
      <div data-spot className="pointer-events-none absolute left-1/2 top-1/2 h-[46vmax] w-[46vmax] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.55), transparent 62%)' }} aria-hidden="true" />

      <div data-content className="wrap relative z-10 flex h-full flex-col justify-end pb-[clamp(88px,13vh,150px)] pt-28">
        <div data-in className="mb-8">
          <p className="eyebrow !text-silver">Qadri Glass &nbsp;·&nbsp; Est. 1960</p>
        </div>

        <h1 data-h1 className="display text-[clamp(2.6rem,min(8.8vw,16svh),10rem)] will-change-transform">
          <Split text={'THE _ART_ OF\nTRANSPARENCY.'} by="char" when="ready" delay={0.1} stagger={0.03} />
        </h1>

        <div className="mt-10 grid gap-9 sm:mt-12">
          <p data-in className="lead max-w-[46ch]">
            Over 65 years of transforming spaces through glass craftsmanship, precision and innovation.
          </p>
          <div data-in className="flex flex-wrap gap-4">
            <Magnetic>
              <a href="#world" onClick={go('#world')} className="btn btn-solid" data-cursor="">
                Explore our world <ArrowRight size={14} className="arrow" />
              </a>
            </Magnetic>
            <Magnetic>
              <Link to="/about" onClick={(e) => { if (document.getElementById('story')) { e.preventDefault(); scrollToTarget('#story', -20) } }} className="btn">
                Discover our story <ArrowRight size={14} className="arrow" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>

      <div data-cue className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex" aria-hidden="true">
        <span className="font-wide text-[8px] uppercase tracking-[0.5em] text-mist">Scroll</span>
        <span className="relative block h-12 w-px overflow-hidden bg-[rgb(var(--fg)/0.15)]">
          <span className="scrollcue absolute inset-0" />
        </span>
      </div>
    </section>
  )
}
