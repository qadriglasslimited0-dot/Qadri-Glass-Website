import { useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useMotion } from '../../hooks/useMotion'
import { Slab, Stage } from './kit'

/**
 * Vision: a glass rotunda assembling as you read.
 * Eleven tall panes are lowered into a ring one after another, seven shorter ones follow inside, then the
 * roof closes. The whole structure turns slowly as you scroll and each pane's shading follows its angle to the
 * light, so reflections really do travel across the surfaces. The pointer tilts it on desktop.
 */
const OUT = 11
const IN = 7
const R_OUT = 232
const R_IN = 108
const CX = 280
const BASE = 470

const ring = (n: number) => Array.from({ length: n }, (_, i) => (360 / n) * i)

export default function VisionGlass({ className = '' }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useMotion(root, ({ reduced, desktop }) => {
    const el = root.current
    if (!el) return
    const track = el.closest('[data-track]')
    const q = gsap.utils.selector(el)
    const tilt = q('[data-tilt]')[0]
    const turn = q('[data-turn]')[0]
    const outer = q('[data-out] [data-drop]')
    const inner = q('[data-in] [data-drop]')
    const roof = q('[data-roof]')[0]
    const shades = q('[data-shade]') as HTMLElement[]
    const wraps = q('[data-wrap]') as HTMLElement[]
    const angles = wraps.map((w) => Number(w.dataset.angle))

    gsap.set(tilt, { rotationX: 18 })
    const shade = (rot: number) => {
      shades.forEach((s, i) => {
        const a = ((angles[i] + rot) * Math.PI) / 180
        const facing = (Math.cos(a) + 1) / 2 // 1 = facing the viewer / light
        s.style.opacity = String(0.42 * (1 - facing))
      })
    }
    gsap.set(turn, { rotationY: 20 })
    shade(20)
    if (reduced || !track) return

    gsap.set([...outer, ...inner], { y: -380, opacity: 0 })
    gsap.set(roof, { opacity: 0, scale: 0.6 })
    const o = { r: 20 }
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: track, start: 'top 60%', end: 'bottom bottom', scrub: true } })
    tl.to(outer, { y: 0, opacity: 1, duration: 0.2, stagger: 0.05 }, 0)
    tl.to(inner, { y: 0, opacity: 1, duration: 0.2, stagger: 0.05 }, 0.5)
    tl.to(roof, { opacity: 1, scale: 1, duration: 0.18 }, 0.88)
    tl.to(o, { r: 140, duration: 1, onUpdate: () => { gsap.set(turn, { rotationY: o.r }); shade(o.r) } }, 0)

    // ambient: gentle breathing of the whole structure
    const amb = gsap.to(tilt, { rotationX: 22, duration: 6, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    let off = () => {}
    if (desktop && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const ty = gsap.quickTo(el, 'rotationZ', { duration: 1.4, ease: 'power3.out' })
      const mv = (e: PointerEvent) => ty((e.clientX / window.innerWidth - 0.5) * 4)
      window.addEventListener('pointermove', mv, { passive: true })
      off = () => window.removeEventListener('pointermove', mv)
    }
    return () => {
      tl.kill()
      amb.kill()
      off()
    }
  })

  const shadeFace = <span data-shade aria-hidden="true" className="absolute inset-0" style={{ background: 'rgb(24 44 60)', opacity: 0 }} />
  return (
    <div ref={root} className={className} aria-hidden="true">
      <Stage w={560} h={600} perspective={2600}>
        <div data-tilt className="glass-scene absolute inset-0">
          <div data-turn className="glass-scene absolute inset-0">
            {/* floor reflection */}
            <div className="absolute" style={{ left: CX - 300, top: BASE - 300, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgb(150 185 210 / 0.5), rgb(150 185 210 / 0.12) 55%, transparent 70%)', transform: 'rotateX(90deg)' }} />

            <div aria-hidden="true" className="absolute" style={{ left: CX - R_OUT - 14, top: BASE - R_OUT - 14, width: (R_OUT + 14) * 2, height: (R_OUT + 14) * 2, borderRadius: '50%', border: '2px solid rgb(var(--fg) / 0.32)', transform: 'rotateX(90deg)' }} />
            <div aria-hidden="true" className="absolute" style={{ left: CX - R_IN - 10, top: BASE - R_IN - 10, width: (R_IN + 10) * 2, height: (R_IN + 10) * 2, borderRadius: '50%', border: '1.5px dashed rgb(var(--fg) / 0.3)', transform: 'rotateX(90deg)' }} />
            <div data-in>
              {ring(IN).map((a) => (
                <div key={'i' + a} data-wrap data-angle={a} className="glass-scene absolute" style={{ left: CX - 45, top: BASE - 230, width: 90, height: 230, transform: `rotateY(${a}deg) translateZ(${R_IN}px)` }}>
                  <Slab data={{ drop: 1 }} w={90} h={230} t={9} delay={a / 90}>
                    {shadeFace}
                  </Slab>
                </div>
              ))}
            </div>
            <div data-out>
              {ring(OUT).map((a) => (
                <div key={'o' + a} data-wrap data-angle={a} className="glass-scene absolute" style={{ left: CX - 65, top: BASE - 360, width: 130, height: 360, transform: `rotateY(${a}deg) translateZ(${R_OUT}px)` }}>
                  <Slab data={{ drop: 1 }} w={130} h={360} t={16} delay={a / 60}>
                    {shadeFace}
                  </Slab>
                </div>
              ))}
            </div>

            {/* roof */}
            <div data-roof className="absolute" style={{ left: CX - R_OUT - 8, top: BASE - 360 - R_OUT - 8, width: (R_OUT + 8) * 2, height: (R_OUT + 8) * 2, borderRadius: '50%', background: 'radial-gradient(circle, rgb(255 255 255 / 0.55), rgb(205 224 238 / 0.4) 60%, rgb(140 175 200 / 0.45))', boxShadow: 'inset 0 0 0 2px rgb(255 255 255 / 0.7)', transform: 'rotateX(90deg)' }} />
          </div>
        </div>
      </Stage>
    </div>
  )
}
