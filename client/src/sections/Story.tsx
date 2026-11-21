import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { TIMELINE } from '../lib/content'
import { useMotion } from '../hooks/useMotion'
import Split from '../components/Split'

/**
 * Pinned cinematic timeline on desktop (scrubbed, one chapter at a time).
 * On tablet / mobile it becomes a vertical story with per-chapter reveals — no pin.
 */
export default function Story() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ reduced, desktop }) => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    const chapters = q('[data-ch]')
    const marks = q('[data-mark]')
    const ticks = q('[data-tick]')
    if (reduced) return

    if (desktop) {
      gsap.set(chapters.slice(1), { opacity: 0, y: 50, pointerEvents: 'none' })
      gsap.set(marks.slice(1), { yPercent: 100 })
      gsap.set(q('[data-fill]'), { scaleX: 0 })
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: q('[data-pin]')[0],
          start: 'top top',
          end: '+=320%',
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      tl.to(q('[data-fill]'), { scaleX: 1, duration: chapters.length - 1, ease: 'none' }, 0)
      chapters.forEach((_, i) => {
        if (i === 0) {
          tl.to(ticks[0], { opacity: 1, duration: 0.01 }, 0)
          return
        }
        const at = i - 0.65
        tl.to(chapters[i - 1], { opacity: 0, y: -40, duration: 0.25, pointerEvents: 'none' }, at)
          .to(marks[i - 1], { yPercent: -100, duration: 0.3 }, at)
          .fromTo(marks[i], { yPercent: 100 }, { yPercent: 0, duration: 0.3 }, at + 0.25)
          .to(chapters[i], { opacity: 1, y: 0, duration: 0.3, pointerEvents: 'auto' }, at + 0.3)
          .to(ticks[i], { opacity: 1, duration: 0.2 }, at + 0.3)
      })
      tl.to({}, { duration: 0.5 }) // hold the final chapter
    } else {
      chapters.forEach((c) => {
        gsap.from(c, { opacity: 0, y: 48, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 85%', once: true } })
      })
      gsap.from(q('[data-vline]'), { scaleY: 0, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: q('[data-chapters]')[0], start: 'top 70%', end: 'bottom 70%', scrub: true } })
    }
  })

  return (
    <section ref={root} id="story" data-section="Story" className="relative bg-coal">
      <div data-pin className="relative flex flex-col overflow-hidden py-24 lg:h-[100svh] lg:min-h-[640px] lg:py-0">
        <div className="wrap pt-0 lg:pt-[clamp(88px,13svh,130px)]">
          <p className="eyebrow mb-5">Our story — since 1960</p>
          <h2 className="display max-w-[18ch] text-[clamp(1.8rem,min(4vw,7svh),4rem)]">
            <Split text={'THREE GENERATIONS.\nONE STANDARD OF _EXCELLENCE._'} when="ready" />
          </h2>
        </div>

        <div className="wrap relative mt-14 flex-1 lg:mt-0" data-chapters>
          <span data-vline className="absolute bottom-0 left-[var(--gutter)] top-0 ml-0 w-px bg-white/15 lg:hidden" aria-hidden="true" />
          <div className="relative grid grid-cols-[minmax(0,1fr)] gap-16 pl-8 lg:block lg:h-full lg:pl-0">
            {TIMELINE.map((c, i) => (
              <article key={c.title} data-ch className="min-w-0 lg:absolute lg:inset-0 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10">
                <div className="mb-5 flex items-baseline gap-4 lg:col-span-7 lg:mb-0 lg:block">
                  {/* Large mark — masked reveal on desktop */}
                  <div className="overflow-hidden lg:h-[clamp(4rem,min(8vw,22svh),9rem)]">
                    <div
                      data-mark
                      className="text-gradient font-extrabold uppercase leading-[0.9] tracking-tighter text-[clamp(2rem,10.5vw,4rem)] lg:text-[clamp(3rem,min(5.8vw,18svh),7rem)]"
                      aria-hidden="true"
                    >
                      {c.mark}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <p className="eyebrow mb-4 !text-azure">
                    0{i + 1} / 0{TIMELINE.length}
                  </p>
                  <h3 className="text-[clamp(1.6rem,2.6vw,2.6rem)] font-light leading-tight">{c.title}</h3>
                  <p className="lead mt-4 max-w-[42ch]">{c.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* progress rail (desktop) */}
        <div className="wrap hidden pb-10 pt-6 lg:block">
          <div className="relative h-px bg-white/15">
            <div data-fill className="absolute inset-0 origin-left bg-gradient-to-r from-azure to-white" />
            <div className="absolute inset-x-0 -top-1 flex justify-between">
              {TIMELINE.map((c, i) => (
                <span key={c.title} data-tick className={`font-wide text-[8px] uppercase tracking-[0.3em] ${i === 0 ? '' : 'opacity-40'}`} style={{ transform: 'translateY(14px)' }}>
                  {c.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
