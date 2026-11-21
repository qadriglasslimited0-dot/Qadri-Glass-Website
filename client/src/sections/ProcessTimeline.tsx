import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { PROCESS } from '../lib/content'
import { useMotion } from '../hooks/useMotion'
import Split from '../components/Split'

export default function ProcessTimeline() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ reduced, desktop }) => {
    if (reduced) return
    const el = root.current!
    const q = gsap.utils.selector(el)
    const list = q('[data-list]')[0]
    gsap.fromTo(q('[data-line]'), { scaleY: 0 }, { scaleY: 1, ease: 'none', transformOrigin: 'top', scrollTrigger: { trigger: list, start: 'top 65%', end: 'bottom 65%', scrub: true } })
    gsap.fromTo(q('[data-dot]'), { top: '0%' }, { top: '100%', ease: 'none', scrollTrigger: { trigger: list, start: 'top 65%', end: 'bottom 65%', scrub: true } })
    q('[data-step]').forEach((s, i) => {
      const side = desktop ? (i % 2 === 0 ? -1 : 1) : 1
      const tl = gsap.timeline({ scrollTrigger: { trigger: s, start: 'top 78%', once: true } })
      tl.from(s.querySelector('[data-n]'), { opacity: 0, scale: 0.6, duration: 0.9, ease: 'back.out(2)' }, 0)
        .from(s.querySelector('[data-body]'), { opacity: 0, x: 50 * side, duration: 1.2, ease: 'expo.out' }, 0.1)
        .from(s.querySelector('[data-rule]'), { scaleX: 0, transformOrigin: side < 0 ? 'right' : 'left', duration: 1.2, ease: 'expo.out' }, 0.2)
    })
  })

  return (
    <section ref={root} data-section="Process" className="relative overflow-hidden bg-ink section">
      <div className="wrap">
        <p className="eyebrow mb-5">The customer journey</p>
        <h2 className="display h-lg max-w-[14ch]">
          <Split text={'From first call to _final fit._'} />
        </h2>

        <div data-list className="relative mt-[clamp(50px,8vw,120px)]">
          <span className="absolute bottom-0 left-4 top-0 w-px bg-white/10 lg:left-1/2" aria-hidden="true" />
          <span data-line className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-azure to-white lg:left-1/2" aria-hidden="true" />
          <span data-dot className="absolute left-4 z-10 -ml-[5px] h-[11px] w-[11px] rounded-full bg-white shadow-[0_0_24px_6px_rgb(var(--accent)/0.55)] lg:left-1/2" aria-hidden="true" />
          <ol className="grid gap-[clamp(40px,7vw,100px)]">
            {PROCESS.map((p, i) => {
              const left = i % 2 === 0
              return (
                <li key={p.n} data-step className="relative grid pl-14 lg:grid-cols-2 lg:pl-0">
                  <span data-n className="absolute left-4 top-0 z-10 -translate-x-1/2 bg-ink px-2 font-wide text-[10px] tracking-[0.3em] text-azure lg:left-1/2">{p.n}</span>
                  <div data-body className={`lg:max-w-[460px] ${left ? 'lg:col-start-1 lg:justify-self-end lg:pr-16 lg:text-right' : 'lg:col-start-2 lg:pl-16'}`}>
                    <h3 className="text-[clamp(1.6rem,3.2vw,3.2rem)] font-extralight uppercase leading-none tracking-tight">{p.t}</h3>
                    <span data-rule className={`my-5 block h-px w-24 bg-azure ${left ? 'lg:ml-auto' : ''}`} />
                    <p className="text-silver/80">{p.d}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
        <p className="mt-16 max-w-[60ch] text-xs text-mist">Indicative workflow. Qadri Glass will confirm the actual process before this section is finalised.</p>
      </div>
    </section>
  )
}
