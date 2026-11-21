import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowDown } from 'lucide-react'
import { gsap, whenReady, EASE } from '../lib/gsap'
import { scrollToTarget } from '../lib/lenis'
import { useMotion } from '../hooks/useMotion'
import Split from '../components/Split'
import Magnetic from '../components/Magnetic'
import RotatingWord from '../components/RotatingWord'
import HeroGlass from '../components/glass/HeroGlass'

const WORDS = ['Transparency', 'Precision', 'Craftsmanship', 'Innovation', 'Architecture']

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ reduced }) => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    if (reduced) return
    gsap.set(q('[data-in]'), { opacity: 0, y: 28 })
    const intro = gsap.timeline({ paused: true, defaults: { ease: EASE } })
    intro.to(q('[data-in]'), { opacity: 1, y: 0, duration: 1.2, stagger: 0.11 }, 0.5)
    const off = whenReady(() => intro.play())
    return () => off()
  })

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToTarget(id, -20)
  }

  return (
    <section ref={root} data-section="Intro" id="top" className="relative overflow-hidden bg-ink pb-16 pt-[104px] lg:flex lg:min-h-[100svh] lg:items-center lg:pb-10">
      {/* bright atmosphere: soft mint light from the glass side */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-[10%] top-[-10%] h-[80vmax] w-[80vmax] rounded-full" style={{ background: 'radial-gradient(circle, rgb(var(--mintc) / 0.42), rgb(var(--mintc) / 0.12) 45%, transparent 68%)' }} />
      <div aria-hidden="true" className="pointer-events-none absolute -left-[16%] bottom-[-30%] h-[60vmax] w-[60vmax] rounded-full" style={{ background: 'radial-gradient(circle, rgb(var(--support) / 0.12), transparent 62%)' }} />

      <div className="wrap relative grid items-center gap-6 lg:grid-cols-12 lg:gap-0">
        <div className="relative z-10 lg:col-span-6">
          <p data-in className="eyebrow mb-7">Qadri Glass · Lahore · Est. 1960</p>
          <h1 className="display text-[clamp(2.7rem,5.9vw,6.8rem)]">
            <span className="block font-light">
              <Split text="The art of" when="ready" delay={0.15} />
            </span>
            <span className="block text-[rgb(var(--brand))]" style={{ minHeight: '1em' }}>
              <RotatingWord words={WORDS} suffix={<span className="text-[rgb(var(--support))]">.</span>} />
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
          <dl data-in className="mt-12 hidden max-w-[560px] grid-cols-3 gap-6 border-t border-[rgb(var(--fg)/0.14)] pt-6 sm:grid">
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

        <div className="relative mx-auto w-full max-w-[560px] lg:col-span-6 lg:-mr-[5vw] lg:max-w-[min(760px,calc((100svh-150px)*0.89))]">
          <HeroGlass />
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
