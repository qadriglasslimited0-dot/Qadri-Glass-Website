import { useRef } from 'react'
import { gsap, EASE } from '../../lib/gsap'
import { useMotion } from '../../hooks/useMotion'
import { GlassBox, Slab, Stage, WorldCopy } from './kit'

/**
 * Four large glass compositions for "Our story". Each one assembles as it scrolls into view and keeps a
 * slow ambient movement afterwards (sway, bob, light travelling across the panes).
 *   1. Foundation  - one sheet of glass, measured
 *   2. Evolution   - sheets growing taller, one after another
 *   3. Generations - a curtain wall assembling from separate panes
 *   4. Today       - a glass tower block rising among its neighbours
 */

const trig = (el: Element, start = 'top 88%', end = 'center 52%') => ({ trigger: el, start, end, scrub: true })

const Floor = ({ y = 400, w = 440, h = 70 }: { y?: number; w?: number; h?: number }) => (
  <div aria-hidden="true" className="absolute" style={{ left: (560 - w) / 2, top: y, width: w, height: h, background: 'radial-gradient(ellipse at center, rgb(26 90 51 / 0.28), transparent 68%)', transform: 'translateZ(-20px)' }} />
)

/* ---------------------------------- 1. Foundation ---------------------------------- */
export function FoundationGlass({ className = '' }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)
  useMotion(root, ({ reduced }) => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    const scrub = q('[data-scrub]')[0]
    const sway = q('[data-sway]')[0]
    const slab = q('.slab')[0]
    gsap.set(scrub, { rotationX: 6, rotationY: -24 })
    if (reduced) return
    gsap.set(q('.draw'), { strokeDashoffset: 1 })
    gsap.fromTo(scrub, { rotationY: -74, y: 30 }, { rotationY: -24, y: 0, ease: 'none', scrollTrigger: trig(el) })
    gsap.to(q('.draw'), { strokeDashoffset: 0, stagger: 0.14, duration: 1.7, ease: 'power2.inOut', scrollTrigger: { trigger: el, start: 'top 72%', once: true } })
    gsap.to(slab, { y: '-=10', duration: 3.8, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    gsap.to(sway, { rotationY: 6, duration: 6.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
  })
  return (
    <div ref={root} className={className}>
      <Stage w={560} h={470} perspective={1500}>
        <div data-scrub className="glass-scene absolute inset-0">
          <div data-sway className="glass-scene absolute inset-0">
            <Floor y={392} />
            <Slab x={160} y={26} w={236} h={372} t={20} z={0} delay={0.5}>
              <WorldCopy ox={160} oy={26} dx={-24} dy={8} />
            </Slab>
            <svg aria-hidden="true" width={560} height={470} viewBox="0 0 560 470" className="absolute inset-0 overflow-visible" fill="none" stroke="rgb(31 116 152)" strokeWidth="1.6" strokeLinecap="round" style={{ transform: 'translateZ(60px)' }}>
              <path className="draw" pathLength={1} d="M112 26 V398 M104 26 H120 M104 398 H120" />
              <path className="draw" pathLength={1} d="M160 434 H396 M160 426 V442 M396 426 V442" />
              <path className="draw" pathLength={1} d="M410 200 H432 M410 222 H432 M426 200 V222" strokeOpacity="0.75" />
              <path className="draw" pathLength={1} d="M140 10 H416" strokeOpacity="0.35" strokeDasharray="none" />
            </svg>
          </div>
        </div>
      </Stage>
    </div>
  )
}

/* ---------------------------------- 2. Evolution ---------------------------------- */
const EVO = [160, 220, 282, 346, 410]
export function EvolutionGlass({ className = '' }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)
  useMotion(root, ({ reduced }) => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    const slabs = q('.slab')
    const scrub = q('[data-scrub]')[0]
    const sway = q('[data-sway]')[0]
    gsap.set(scrub, { rotationX: 5, rotationY: -26 })
    if (reduced) return
    gsap.from(slabs, { x: '+=130', z: '-=340', opacity: 0, rotationY: 62, stagger: 0.18, ease: 'none', scrollTrigger: trig(el, 'top 90%', 'center 50%') })
    slabs.forEach((s, i) => gsap.to(s, { y: i % 2 ? '+=8' : '-=8', duration: 3.2 + i * 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut' }))
    gsap.to(sway, { rotationY: 6, duration: 7, yoyo: true, repeat: -1, ease: 'sine.inOut' })
  })
  return (
    <div ref={root} className={className}>
      <Stage w={560} h={470} perspective={1500}>
        <div data-scrub className="glass-scene absolute inset-0">
          <div data-sway className="glass-scene absolute inset-0">
            <Floor y={404} w={500} />
            {EVO.map((h, i) => (
              <Slab key={i} x={12 + i * 108} y={430 - h} w={98} h={h} t={14} z={i * 28 - 40} delay={i * 0.9}>
                <WorldCopy ox={12 + i * 108} oy={430 - h} dx={-18 + i * 9} dy={6 - i * 3} />
              </Slab>
            ))}
          </div>
        </div>
      </Stage>
    </div>
  )
}

/* ---------------------------------- 3. Generations ---------------------------------- */
const COLS = 4
const ROWS = 3
export function CurtainGlass({ className = '' }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)
  useMotion(root, ({ reduced }) => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    const tiles = q('.slab')
    const scrub = q('[data-scrub]')[0]
    const sway = q('[data-sway]')[0]
    gsap.set(scrub, { rotationX: 8, rotationY: -22 })
    if (reduced) return
    const rnd = (i: number, k: number) => Math.sin(i * 12.9898 + k * 78.233) * 43758.5453 % 1
    gsap.from(tiles, {
      x: (i) => rnd(i, 1) * 260,
      y: (i) => rnd(i, 2) * 200,
      z: (i) => -240 - Math.abs(rnd(i, 3)) * 260,
      rotationY: (i) => rnd(i, 4) * 120,
      rotationX: (i) => rnd(i, 5) * 60,
      opacity: 0,
      stagger: { each: 0.05, from: 'start' },
      ease: 'none',
      scrollTrigger: trig(el, 'top 92%', 'center 48%'),
    })
    gsap.to(sway, { rotationY: 5, rotationX: -3, duration: 7, yoyo: true, repeat: -1, ease: 'sine.inOut' })
  })
  return (
    <div ref={root} className={className}>
      <Stage w={560} h={470} perspective={1500}>
        <div data-scrub className="glass-scene absolute inset-0">
          <div data-sway className="glass-scene absolute inset-0">
            <Floor y={410} w={480} />
            {Array.from({ length: COLS * ROWS }, (_, n) => {
              const c = n % COLS
              const r = Math.floor(n / COLS)
              const x = 26 + c * 130
              const y = 30 + r * 132
              return (
                <Slab key={n} x={x} y={y} w={122} h={124} t={9} z={0} delay={(c + r) * 0.55}>
                  <WorldCopy ox={x} oy={y} dx={-10 + c * 4} dy={-6 + r * 4} />
                </Slab>
              )
            })}
          </div>
        </div>
      </Stage>
    </div>
  )
}

/* ---------------------------------- 4. Today ---------------------------------- */
const LIT_FRONT: [number, number, number, number][] = [
  [0, 12, 14, 14], [0, 56, 22, 14], [0, 34, 38, 14], [0, 74, 50, 14], [0, 18, 62, 14], [0, 58, 76, 14], [0, 36, 88, 12],
  [1, 14, 20, 20], [1, 52, 38, 20], [1, 28, 62, 20], [1, 60, 80, 18],
]
const LIT_SIDE: [number, number, number, number][] = [
  [1, 14, 20, 20], [1, 52, 38, 20], [1, 28, 62, 20], [1, 60, 80, 18],
]
export function TodayGlass({ className = '' }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)
  useMotion(root, ({ reduced, desktop }) => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    const scrub = q('[data-scrub]')[0]
    const sway = q('[data-sway]')[0]
    const blocks = q('[data-block]')
    const planes = q('[data-plane]')
    const lits = q('[data-lit]')
    gsap.set(scrub, { rotationX: 9, rotationY: -26 })
    if (reduced) {
      gsap.set(lits, { opacity: 0.4 })
      return
    }
    // the blocks rise from the ground as you scroll, front planes slide in last
    gsap.from(blocks, { scaleY: 0.04, transformOrigin: '50% 100%', stagger: 0.16, ease: 'none', scrollTrigger: trig(el, 'top 92%', 'center 46%') })
    gsap.from(planes, { x: (i) => (i ? 140 : -140), z: '+=120', opacity: 0, stagger: 0.15, ease: 'none', scrollTrigger: trig(el, 'top 70%', 'center 38%') })
    gsap.fromTo(scrub, { rotationY: -46 }, { rotationY: -16, ease: 'none', scrollTrigger: trig(el, 'top 95%', 'bottom 35%') })
    // ambient: slow sway, panes catching the sky in turn
    gsap.to(sway, { rotationY: 5, duration: 8, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    lits.forEach((l, i) => gsap.to(l, { opacity: 0.5, duration: 1.8 + (i % 4) * 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: (i * 0.45) % 3.5 }))
    planes.forEach((p, i) => gsap.to(p, { y: i ? '+=8' : '-=8', duration: 4 + i, yoyo: true, repeat: -1, ease: 'sine.inOut' }))
    void desktop
  })
  return (
    <div ref={root} className={className}>
      <Stage w={560} h={640} perspective={1500}>
        <div data-scrub className="glass-scene absolute inset-0">
          <div data-sway className="glass-scene absolute inset-0">
            <Floor y={540} w={520} h={90} />
            {/* the arch behind: the same window onto the city used in the hero */}
            <div aria-hidden="true" className="absolute" style={{ left: 70, top: 70, width: 420, height: 520, borderRadius: '210px 210px 0 0', background: 'linear-gradient(180deg, #B6E8CE, #5CBB8A 50%, #2F8F5B)', transform: 'translateZ(-150px)', boxShadow: '0 0 0 1px rgb(26 90 51 / 0.3)' }} />
            <GlassBox data-block x={50} y={290} w={92} h={250} d={70} z={-60} lit={LIT_SIDE} data={{ block: 1 }} />
            <GlassBox x={400} y={210} w={104} h={330} d={80} z={-40} lit={LIT_SIDE} data={{ block: 2 }} />
            <GlassBox x={168} y={44} w={196} h={496} d={110} z={10} lit={LIT_FRONT} data={{ block: 3 }} />
            <Slab x={16} y={330} w={196} h={230} t={12} z={150} data={{ plane: 1 }} delay={1}>
              <span aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgb(255 255 255 / 0.25), transparent 50%)' }} />
            </Slab>
            <Slab x={346} y={120} w={176} h={300} t={12} z={120} data={{ plane: 2 }} delay={3.2}>
              <span aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgb(255 255 255 / 0.25), transparent 50%)' }} />
            </Slab>
          </div>
        </div>
      </Stage>
    </div>
  )
}

void EASE
