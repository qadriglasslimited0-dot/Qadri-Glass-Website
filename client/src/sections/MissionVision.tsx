import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { HERITAGE, MISSION, VISION } from '../lib/content'
import { useSite } from '../lib/api'
import { useMotion } from '../hooks/useMotion'

/** Kinetic editorial typography: words light up as the reader scrolls. */
export default function MissionVision() {
  const root = useRef<HTMLElement>(null)
  const { site } = useSite()
  const mission = site.mission || MISSION
  const vision = site.vision || VISION
  const heritage = site.heritage || HERITAGE

  useMotion(root, ({ reduced, desktop }) => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    if (reduced) {
      gsap.set(q('[data-w]'), { opacity: 1 })
      return
    }
    gsap.fromTo(q('[data-w]'), { opacity: 0.12 }, { opacity: 1, stagger: 0.5, ease: 'none', scrollTrigger: { trigger: q('[data-mission]')[0], start: 'top 78%', end: 'bottom 55%', scrub: true } })
    gsap.fromTo(q('[data-vision] .v'), { yPercent: 105 }, { yPercent: 0, stagger: 0.12, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: q('[data-vision]')[0], start: 'top 75%', once: true } })
    if (desktop) gsap.fromTo(q('[data-vlabel]'), { y: 80 }, { y: -80, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
  }, [mission, vision])

  const visionLines = [vision]
  return (
    <section ref={root} data-section="Mission" className="theme-green relative overflow-hidden bg-ink section">
      <div className="wrap relative">
        <div className="grid gap-8 lg:grid-cols-12">
          <p data-vlabel className="eyebrow lg:col-span-2 lg:[writing-mode:vertical-rl] lg:rotate-180">01 — Mission</p>
          <p data-mission className="text-[clamp(1.5rem,2.9vw,3rem)] font-semibold leading-[1.18] tracking-tight tracking-tight lg:col-span-10">
            {mission.split(' ').map((w, i) => (
              <span key={i} data-w className="inline-block pr-[0.28em]">
                {w}
              </span>
            ))}
          </p>
        </div>

        <div className="mt-[var(--section)] grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-2">
            <p className="eyebrow">02 — Vision</p>
          </div>
          <blockquote data-vision className="lg:col-span-9 lg:col-start-4">
            <p className="serif-em text-[clamp(2.2rem,5vw,5.2rem)] leading-[1.05]">
              {visionLines.map((l, i) => (
                <span key={i} className="block overflow-hidden pb-[0.12em]">
                  <span className="v block">{l}</span>
                </span>
              ))}
            </p>
          </blockquote>
        </div>

        <div className="mt-[var(--section)] grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-2">
            <p className="eyebrow">03 — Heritage</p>
          </div>
          <p className="text-[clamp(1.1rem,1.6vw,1.6rem)] font-light leading-[1.55] text-[rgb(var(--fg)/0.88)] lg:col-span-7 lg:col-start-4">{heritage}</p>
        </div>
      </div>
    </section>
  )
}
