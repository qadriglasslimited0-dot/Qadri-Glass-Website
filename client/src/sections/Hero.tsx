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
const TAGS = ['Est. 1960', 'Architectural glass', 'Lahore, Pakistan']

/** Big hand-drawn-style loops at the edges: a bold single line, in the glass blue. Decorative only. */
function Doodle({ side }: { side: 'l' | 'r' }) {
  const d =
    side === 'l'
      ? 'M-20 210 C120 60 250 110 215 220 C185 315 40 330 36 220 C32 110 190 40 300 120'
      : 'M320 40 C170 -30 40 60 80 170 C118 275 270 250 262 150 C254 52 130 70 100 170 C78 240 150 300 300 290'
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 340"
      data-doodle={side}
      className={`pointer-events-none absolute w-[min(24vw,360px)] overflow-visible ${side === 'l' ? '-left-[3vw] top-[30%] hidden md:block' : '-right-[18vw] top-[26%] w-[56vw] md:-right-[3vw] md:top-[8%] md:w-[min(24vw,360px)]'}`}
      fill="none"
      stroke="rgb(var(--support))"
      strokeWidth="22"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path className="draw" pathLength={1} d={d} />
    </svg>
  )
}

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ reduced }) => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    if (reduced) return
    gsap.set(q('[data-in]'), { opacity: 0, y: 28 })
    gsap.set(q('[data-pill]'), { opacity: 0, scale: 0.7 })
    gsap.set(q('[data-doodle] .draw'), { strokeDashoffset: 1 })
    const intro = gsap.timeline({ paused: true, defaults: { ease: EASE } })
    intro
      .to(q('[data-in]'), { opacity: 1, y: 0, duration: 1.2, stagger: 0.11 }, 0.5)
      .to(q('[data-pill]'), { opacity: 1, scale: 1, duration: 0.9, stagger: 0.12, ease: 'back.out(2)' }, 1.2)
      .to(q('[data-doodle] .draw'), { strokeDashoffset: 0, duration: 2.2, stagger: 0.2, ease: 'power2.inOut' }, 0.4)
    const off = whenReady(() => intro.play())
    // pills and loops keep a very slow drift
    const amb = [
      ...q('[data-pill]').map((p, i) => gsap.to(p, { y: i % 2 ? 7 : -7, rotation: `+=${i % 2 ? -2 : 2}`, duration: 3.4 + i * 0.7, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2 })),
      ...q('[data-doodle]').map((p, i) => gsap.to(p, { y: i ? 18 : -18, rotation: i ? 3 : -3, duration: 7 + i, yoyo: true, repeat: -1, ease: 'sine.inOut' })),
    ]
    return () => {
      off()
      amb.forEach((a) => a.kill())
    }
  })

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToTarget(id, -20)
  }

  return (
    <section
      ref={root}
      data-section="Intro"
      id="top"
      className="relative overflow-hidden bg-ink pb-12 pt-[84px] [--art-w:min(84%,380px)] lg:flex lg:min-h-[100svh] lg:flex-col lg:pb-8 lg:[--art-w:min(600px,calc((100svh-250px)*0.89))]"
    >
      <Doodle side="l" />
      <Doodle side="r" />

      <div className="wrap relative flex w-full flex-1 flex-col lg:justify-between">
        {/* ---------- stage: headline over the glass ---------- */}
        <div className="relative lg:h-[calc(var(--art-w)/0.889)] lg:min-h-[420px]">
          {/* tags: chips on small screens, overlapping the headline on large ones */}
          <ul className="mb-5 flex flex-wrap gap-2 lg:hidden">
            {TAGS.map((t) => (
              <li key={t} data-in className="rounded-full bg-[rgb(var(--fg))] px-3.5 py-1.5 text-[12.5px] font-bold text-[rgb(var(--bg))]">
                {t}
              </li>
            ))}
          </ul>

          <h1 className="display relative z-20 text-[clamp(2.05rem,11vw,4.2rem)] md:text-[clamp(3.6rem,8.6vw,6.4rem)] lg:absolute lg:inset-x-0 lg:top-1/2 lg:-translate-y-[54%] lg:text-center lg:text-[clamp(4.4rem,min(10.4vw,18svh),11.5rem)]">
            <span className="block font-light">
              <Split text="The art of" when="ready" delay={0.15} />
            </span>
            <span className="relative block text-[rgb(var(--brand))]" style={{ minHeight: '1em' }}>
              <RotatingWord words={WORDS} suffix={<span className="text-[rgb(var(--support))]">.</span>} />
            </span>
            {/* overlapping tags (desktop) */}
            <span data-pill className="absolute left-[7%] top-[2%] hidden -rotate-6 rounded-full bg-[rgb(var(--fg))] px-5 py-2.5 font-sans text-[15px] font-bold tracking-normal text-[rgb(var(--bg))] shadow-xl lg:block">
              {TAGS[0]}
            </span>
            <span data-pill className="absolute right-[6%] top-[38%] hidden rotate-3 rounded-full bg-[rgb(var(--fg))] px-5 py-2.5 font-sans text-[15px] font-bold tracking-normal text-[rgb(var(--bg))] shadow-xl lg:block">
              {TAGS[1]}
            </span>
            <span data-pill className="absolute bottom-[-4%] left-[14%] hidden -rotate-2 rounded-full bg-[rgb(var(--fg))] px-5 py-2.5 font-sans text-[15px] font-bold tracking-normal text-[rgb(var(--bg))] shadow-xl lg:block">
              {TAGS[2]}
            </span>
          </h1>

          <div className="relative z-0 mx-auto mb-14 mt-3 w-[var(--art-w)] md:mb-16 lg:absolute lg:inset-x-0 lg:top-0 lg:mb-0 lg:mt-0">
            <HeroGlass />
          </div>
        </div>

        {/* ---------- bottom row ---------- */}
        <div className="mt-8 grid items-end gap-8 lg:mt-0 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p data-in className="lead max-w-[44ch]">
              Over 65 years of transforming spaces through glass craftsmanship, precision and innovation.
            </p>
            <div data-in className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 [&_.btn]:w-full [&_.btn]:justify-center sm:[&_.btn]:w-auto">
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
          </div>
          <dl data-in className="grid grid-cols-3 gap-4 border-t border-[rgb(var(--fg)/0.16)] pt-5 lg:col-span-5 lg:col-start-8">
            {[
              ['Established', '1960'],
              ['Based in', 'Lahore'],
              ['Generations', 'Three'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow !gap-0 text-[9.5px] !tracking-[0.08em] before:hidden sm:text-[11px] sm:!tracking-[0.16em]">{k}</dt>
                <dd className="mt-1.5 font-display text-lg font-bold leading-tight sm:text-xl">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
