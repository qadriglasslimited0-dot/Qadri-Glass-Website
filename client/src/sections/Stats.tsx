import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { STATS } from '../lib/content'
import { useMotion } from '../hooks/useMotion'
import Counter from '../components/Counter'
import { Reveal } from '../components/Reveal'

/**
 * The three confirmed figures, set as oversized typography on a deep green ground.
 * Rows alternate sides; translucent glass sheets drift behind at their own pace.
 */
export default function Stats() {
  const root = useRef<HTMLElement>(null)
  useMotion(root, ({ reduced, desktop }) => {
    if (reduced || !desktop) return
    const q = gsap.utils.selector(root.current!)
    q('[data-sheet]').forEach((s, i) => {
      gsap.fromTo(s, { yPercent: 14 * (i + 1) }, { yPercent: -14 * (i + 1), ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    })
    q('[data-rule]').forEach((r) => {
      gsap.fromTo(r, { scaleX: 0 }, { scaleX: 1, ease: 'expo.out', duration: 1.6, scrollTrigger: { trigger: r, start: 'top 88%', once: true } })
    })
  })

  return (
    <section ref={root} data-section="Legacy" className="theme-deep relative overflow-hidden bg-ink section">
      {/* glass sheets behind the numbers */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div data-sheet className="glass-pane absolute -right-[6%] top-[8%] hidden h-[62%] w-[26%] -skew-x-6 opacity-60 md:block" />
        <div data-sheet className="glass-pane absolute -left-[4%] bottom-[4%] hidden h-[48%] w-[18%] skew-x-6 opacity-40 md:block" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>

      <div className="wrap relative">
        <div className="mb-[clamp(40px,6vw,88px)] flex flex-wrap items-end justify-between gap-6">
          <p className="eyebrow">Experience in numbers</p>
          <p className="max-w-[34ch] text-sm text-mist">The figures below are as stated by Qadri Glass.</p>
        </div>

        <div>
          {STATS.map((s, i) => {
            const flip = i % 2 === 1
            return (
              <div key={s.label}>
                <div data-rule className="h-px origin-left bg-[rgb(var(--fg)/0.22)]" />
                <Reveal className={`flex flex-col gap-4 py-[clamp(28px,4.5vw,64px)] md:items-end md:gap-12 ${flip ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                  <Counter
                    to={s.value}
                    suffix={s.suffix}
                    className={`block font-display text-[clamp(5.2rem,17vw,17rem)] font-extrabold leading-[0.82] tracking-[-0.06em] tabular-nums ${i === 1 ? 'text-[rgb(var(--accent))]' : ''}`}
                  />
                  <div className={`pb-2 md:max-w-[30ch] ${flip ? 'md:text-right' : ''}`}>
                    <p className="font-display text-[clamp(1.6rem,3vw,2.8rem)] font-bold leading-none">{s.label}</p>
                    <p className="eyebrow mt-3 !text-[rgb(var(--amber))] before:hidden">{s.sub}</p>
                    {s.note && <p className="mt-4 text-xs text-mist">{s.note}</p>}
                  </div>
                </Reveal>
              </div>
            )
          })}
          <div data-rule className="h-px origin-left bg-[rgb(var(--fg)/0.22)]" />
        </div>
      </div>
    </section>
  )
}
