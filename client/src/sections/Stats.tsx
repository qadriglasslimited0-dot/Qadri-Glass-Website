import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { STATS } from '../lib/content'
import { useMotion } from '../hooks/useMotion'
import Counter from '../components/Counter'

export default function Stats() {
  const root = useRef<HTMLElement>(null)
  useMotion(root, ({ reduced }) => {
    if (reduced) return
    const q = gsap.utils.selector(root.current!)
    q('[data-stat]').forEach((s, i) => {
      gsap.fromTo(s, { y: 24 + i * 12 }, { y: -24 - i * 12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    })
  })

  return (
    <section ref={root} data-section="Legacy" className="theme-green relative overflow-hidden bg-ink section">
      <div className="wrap relative grid gap-y-16 md:grid-cols-3">
        {STATS.map((s, i) => (
          <div key={s.label} data-stat className={`relative px-0 md:px-8 ${i > 0 ? 'md:border-l md:border-white/30' : ''}`}>
            <div className="relative">
              <Counter to={s.value} suffix={s.suffix} className="block text-[clamp(3.4rem,min(7.2vw,16svh),8rem)] font-extrabold leading-[0.95] tracking-tighter tabular-nums" />
              <p className="mt-5 font-wide text-[clamp(11px,1.1vw,15px)] uppercase tracking-[0.3em]">{s.label}</p>
              <p className="eyebrow mt-2">{s.sub}</p>
              {s.note && <p className="mt-4 max-w-[26ch] text-xs text-mist">{s.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
