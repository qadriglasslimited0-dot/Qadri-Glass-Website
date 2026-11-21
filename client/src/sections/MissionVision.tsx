import { useRef } from 'react'
import { gsap, EASE } from '../lib/gsap'
import { HERITAGE, MISSION, VISION } from '../lib/content'
import { useSite } from '../lib/api'
import { useMotion } from '../hooks/useMotion'
import ScrollPath from '../components/ScrollPath'
import { Reveal } from '../components/Reveal'
import { MissionArt, VisionArt, HeritageArt } from '../components/Graphics'

/**
 * Three chapters of the same story, each with its own ground, drawing and motion:
 *  01 Mission  - deep green, words light up as you read, panes with a bending beam of light
 *  02 Vision   - pale glass, one large statement with its key phrases picked out, towers and a rising sun
 *  03 Heritage - warm paper, three laminated layers (one per generation) joined by the signature line
 */

const KEYWORDS = new Set(['most', 'trusted', 'name', 'precision', 'innovation', 'craftsmanship'])

function Mission({ text }: { text: string }) {
  const root = useRef<HTMLElement>(null)
  useMotion(root, ({ reduced }) => {
    if (reduced) return
    const q = gsap.utils.selector(root.current!)
    gsap.fromTo(q('[data-w]'), { opacity: 0.16 }, { opacity: 1, stagger: 0.5, ease: 'none', scrollTrigger: { trigger: q('[data-mission]')[0], start: 'top 80%', end: 'bottom 55%', scrub: true } })
  }, [text])
  return (
    <section ref={root} data-section="Mission" className="theme-deep relative overflow-hidden bg-ink section">
      <div aria-hidden="true" className="pointer-events-none absolute -right-[10%] top-[-10%] h-[60vmax] w-[60vmax] rounded-full" style={{ background: 'radial-gradient(circle, rgb(var(--mintc) / 0.14), transparent 62%)' }} />
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-8">01 — Our mission</p>
          <p data-mission className="font-display text-[clamp(1.6rem,3.1vw,3.2rem)] font-semibold leading-[1.16] tracking-[-0.025em]">
            {text.split(' ').map((w, i) => (
              <span key={i} data-w className="inline-block pr-[0.26em]">
                {w}
              </span>
            ))}
          </p>
        </div>
        <Reveal className="lg:col-span-5" y={60}>
          <MissionArt className="mx-auto h-auto w-full max-w-[520px] text-[rgb(var(--accent))]" />
        </Reveal>
      </div>
    </section>
  )
}

function Vision({ text }: { text: string }) {
  const root = useRef<HTMLElement>(null)
  useMotion(root, ({ reduced }) => {
    if (reduced) return
    const q = gsap.utils.selector(root.current!)
    gsap.fromTo(q('[data-vw] > span'), { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.045, ease: EASE, scrollTrigger: { trigger: q('[data-vision]')[0], start: 'top 78%', once: true } })
  }, [text])
  const words = text.split(' ').filter(Boolean)
  return (
    <section ref={root} data-section="Vision" className="theme-dark relative overflow-hidden bg-coal section">
      <div className="wrap relative">
        <p className="eyebrow mb-8">02 — Our vision</p>
        <blockquote data-vision className="max-w-[24ch] font-display text-[clamp(2.3rem,6.4vw,6.6rem)] font-light leading-[1.02] tracking-[-0.04em] sm:max-w-[22ch]">
          {words.map((w, i) => {
            const key = KEYWORDS.has(w.toLowerCase().replace(/[^a-z]/g, ''))
            return (
              <span key={i} data-vw className="mr-[0.22em] inline-block overflow-hidden align-bottom pb-[0.08em]">
                <span className={`inline-block ${key ? 'font-extrabold text-[rgb(var(--brand))]' : ''}`}>{w}</span>
              </span>
            )
          })}
        </blockquote>
        <Reveal className="mt-12 flex justify-end" y={60}>
          <VisionArt className="h-auto w-full max-w-[640px] text-[rgb(var(--brand))]" />
        </Reveal>
      </div>
    </section>
  )
}

const GENERATIONS = [
  { n: 'I', t: 'A single retail counter', d: 'Where the company began, in 1960.' },
  { n: 'II', t: 'Decades of hands-on craftsmanship', d: 'Standards passed down through the work itself.' },
  { n: 'III', t: 'A full-service glass house', d: 'Import, supply, fabrication and installation.' },
]

function Heritage({ text }: { text: string }) {
  const track = useRef<HTMLOListElement>(null)
  return (
    <section data-section="Heritage" className="theme-sand relative overflow-hidden bg-ink section">
      <div className="wrap relative grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p className="eyebrow mb-8">03 — Our heritage</p>
          <h2 className="display text-[clamp(2.4rem,5.6vw,5.6rem)]">
            Three generations, <em>one standard.</em>
          </h2>
          <Reveal as="p" className="lead mt-8 max-w-[52ch]">
            {text}
          </Reveal>

          <div ref={track as never} className="relative mt-14">
            <ScrollPath container={track as never} width={3} sway={26} start="top 80%" end="bottom 65%" />
            <ol className="relative z-10 grid gap-9">
              {GENERATIONS.map((g, i) => (
                <li key={g.n} className="grid grid-cols-[44px_1fr] items-start gap-x-5">
                  <span data-node data-on="false" className="grid h-11 w-11 place-items-center rounded-full border-2 border-[rgb(var(--brand))] bg-ink font-display text-sm font-extrabold transition-[background,transform,box-shadow] duration-500 data-[on=true]:scale-110 data-[on=true]:border-[rgb(var(--amber-deep))] data-[on=true]:bg-[rgb(var(--amber))] data-[on=true]:shadow-[0_0_0_7px_rgb(var(--amber)/0.25)]">
                    {g.n}
                  </span>
                  <Reveal delay={i * 0.05}>
                    <p className="font-display text-xl font-bold sm:text-2xl">{g.t}</p>
                    <p className="mt-1 text-[15px] text-mist">{g.d}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <Reveal className="lg:col-span-6 lg:self-center" y={60}>
          <HeritageArt className="mx-auto h-auto w-full max-w-[600px] text-[rgb(var(--brand))]" />
          <p className="mx-auto mt-6 max-w-[34ch] text-center font-display text-lg font-semibold leading-snug sm:text-xl">
            “Each generation inherited not just a business, but a standard: that the work must speak for itself.”
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export default function MissionVision() {
  const { site } = useSite()
  return (
    <>
      <Mission text={site.mission || MISSION} />
      <Vision text={site.vision || VISION} />
      <Heritage text={site.heritage || HERITAGE} />
    </>
  )
}
