import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { STATS } from '../lib/content'
import { useMotion } from '../hooks/useMotion'
import Counter from '../components/Counter'
import { Reveal } from '../components/Reveal'
import StatsGlass from '../components/glass/StatsGlass'

/**
 * The three confirmed figures as oversized type. On desktop a glass composition stays in view behind them and
 * transforms as you move from one figure to the next (see StatsGlass); on phones the figures simply stack.
 */
export default function Stats() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ reduced, desktop }) => {
    if (reduced || !desktop) return
    const q = gsap.utils.selector(root.current!)
    q('[data-rule]').forEach((r) => {
      gsap.fromTo(r, { scaleX: 0 }, { scaleX: 1, ease: 'expo.out', duration: 1.6, scrollTrigger: { trigger: r, start: 'top 88%', once: true } })
    })
  })

  return (
    <section ref={root} data-section="Legacy" className="theme-deep relative overflow-x-clip bg-ink">
      <div data-stats-wrap className="relative">
        {/* sticky stage: stays in view for the whole length of the figures */}
        <div className="sticky top-0 hidden h-screen overflow-hidden md:block">
          <StatsGlass />
        </div>

        <div className="wrap relative z-10 py-[var(--section)] md:-mt-[100vh]">
          <div className="mb-[clamp(40px,6vw,88px)] flex flex-wrap items-end justify-between gap-6">
            <p className="eyebrow">Experience in numbers</p>
            <p className="max-w-[34ch] text-sm text-mist">The figures below are as stated by Qadri Glass.</p>
          </div>

          <div>
            {STATS.map((s, i) => {
              const flip = i % 2 === 1
              return (
                <div key={s.label}>
                  <div data-rule className="h-px origin-left bg-[rgb(var(--fg)/0.28)]" />
                  <Reveal className={`flex flex-col gap-4 py-[clamp(28px,4.5vw,64px)] md:min-h-[58vh] md:items-center md:gap-12 ${flip ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                    <Counter
                      to={s.value}
                      suffix={s.suffix}
                      className={`block font-display text-[clamp(5.2rem,17vw,17rem)] font-extrabold leading-[0.82] tracking-[-0.06em] tabular-nums ${i === 1 ? 'text-[rgb(var(--accent))]' : ''}`}
                    />
                    <div className={`pb-2 md:max-w-[30ch] ${flip ? 'md:text-right' : ''}`}>
                      <p className="font-display text-[clamp(1.6rem,3vw,2.8rem)] font-bold leading-none">{s.label}</p>
                      <p className="eyebrow mt-3 !text-[rgb(var(--support))] before:hidden">{s.sub}</p>
                      {s.note && <p className="mt-4 text-xs text-mist">{s.note}</p>}
                    </div>
                  </Reveal>
                </div>
              )
            })}
            <div data-rule className="h-px origin-left bg-[rgb(var(--fg)/0.28)]" />
          </div>
        </div>
      </div>
    </section>
  )
}
