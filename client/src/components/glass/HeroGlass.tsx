import { useRef } from 'react'
import { gsap, finePointer, whenReady, EASE } from '../../lib/gsap'
import { useMotion } from '../../hooks/useMotion'
import { Slab, Stage, WorldCopy, WORLD_W, WORLD_H } from './kit'

/**
 * The hero composition: five sheets of real-thickness glass standing in front of a glass city elevation.
 * Each pane shows the elevation through itself, displaced and magnified a little - that offset reads as refraction.
 * Always alive (slow breathing, light travelling across the panes, panes catching the sun, a measuring line),
 * reacts to the pointer on desktop, and turns away as you scroll.
 */
const SLABS = [
  { k: 'a', x: 18, y: 150, w: 172, h: 470, t: 16, z: -50, dx: -26, dy: -10, d: 0 },
  { k: 'b', x: 196, y: 64, w: 238, h: 562, t: 20, z: 30, dx: 16, dy: 12, d: 1.4 },
  { k: 'c', x: 404, y: 192, w: 190, h: 430, t: 16, z: -16, dx: -14, dy: -16, d: 2.8 },
  { k: 'd', x: 70, y: 482, w: 300, h: 168, t: 14, z: 135, dx: 34, dy: -22, d: 4.2 },
  { k: 'e', x: 470, y: 412, w: 116, h: 250, t: 14, z: 165, dx: -30, dy: 14, d: 5.6 },
]

export default function HeroGlass({ className = '' }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useMotion(root, ({ reduced, desktop }) => {
    const el = root.current
    if (!el) return
    const q = gsap.utils.selector(el)
    const slabs = q('.slab') as HTMLElement[]
    const copies = q('[data-refract]') as unknown as SVGElement[]
    const wins = gsap.utils.toArray<SVGElement>('[data-win]')
    const sway = q('[data-sway]')[0]
    const mouse = q('[data-mouse]')[0]
    const scroll = q('[data-scroll]')[0]
    const bg = q('[data-bg]')[0]
    const tech = q('[data-tech]')[0]

    gsap.set(mouse, { rotationX: 4, rotationY: -16 })
    if (reduced) return

    // base offsets of each refracted copy, so the pointer can nudge them
    const base = copies.map((c) => ({ x: Number(c.dataset.bx), y: Number(c.dataset.by) }))
    gsap.set(copies, { x: (i) => base[i].x, y: (i) => base[i].y })

    // ---- entrance ----
    gsap.set(slabs, { opacity: 0, z: (i) => SLABS[i].z - 420, rotationY: 58, transformOrigin: '50% 50%' })
    gsap.set(bg, { opacity: 0 })
    gsap.set(q('[data-tech] .draw'), { strokeDashoffset: 1 })
    const intro = gsap.timeline({ paused: true, defaults: { ease: EASE } })
    intro
      .to(bg, { opacity: 1, duration: 2 }, 0)
      .to(slabs, { opacity: 1, z: (i) => SLABS[i].z, rotationY: 0, duration: 2.2, stagger: 0.16 }, 0.1)
      .to(q('[data-tech] .draw'), { strokeDashoffset: 0, duration: 1.8, stagger: 0.07, ease: 'power2.inOut' }, 1.2)
    const off = whenReady(() => intro.play())

    // ---- always-on ambient motion ----
    const ambient: gsap.core.Animation[] = []
    slabs.slice(0, desktop ? slabs.length : 3).forEach((s, i) => {
      ambient.push(gsap.to(s, { y: i % 2 ? '+=9' : '-=9', duration: 3.2 + i * 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: intro.duration() }))
    })
    ambient.push(gsap.to(sway, { rotationY: 4, rotationX: -1.5, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1 }))
    wins.slice(0, desktop ? wins.length : 5).forEach((w, i) => {
      ambient.push(gsap.to(w, { opacity: 0.55, duration: 1.6 + (i % 4) * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: (i * 0.37) % 4 }))
    })
    const scan = q('[data-scan]')[0]
    ambient.push(
      gsap
        .timeline({ repeat: -1, repeatDelay: 2.4 })
        .fromTo(scan, { x: 30, opacity: 0 }, { x: WORLD_W - 40, duration: 6.5, ease: 'sine.inOut' }, 0)
        .to(scan, { opacity: 0.85, duration: 1.2 }, 0)
        .to(scan, { opacity: 0, duration: 1.2 }, 5.3),
    )

    // ---- scroll: the whole composition turns away and lifts ----
    const st = gsap.timeline({ scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top top', end: 'bottom top', scrub: true } })
    st.to(scroll, { rotationY: -26, y: -70, z: 60, ease: 'none' }, 0).to(bg, { y: 40, ease: 'none' }, 0)

    // ---- pointer (desktop) ----
    let cleanup = () => {}
    if (finePointer() && desktop) {
      const mx = gsap.quickTo(mouse, 'rotationY', { duration: 1.2, ease: 'power3.out' })
      const my = gsap.quickTo(mouse, 'rotationX', { duration: 1.2, ease: 'power3.out' })
      const bgx = gsap.quickTo(bg, 'x', { duration: 1.6, ease: 'power3.out' })
      const tx = gsap.quickTo(tech, 'x', { duration: 1.3, ease: 'power3.out' })
      const cx = copies.map((c, i) => gsap.quickTo(c, 'x', { duration: 1.1, ease: 'power3.out' }))
      const cy = copies.map((c, i) => gsap.quickTo(c, 'y', { duration: 1.1, ease: 'power3.out' }))
      const move = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        mx(-16 + nx * 20)
        my(4 - ny * 12)
        bgx(-nx * 30)
        tx(nx * 22)
        copies.forEach((_, i) => {
          cx[i](base[i].x + nx * (10 + i * 3))
          cy[i](base[i].y + ny * (6 + i * 2))
        })
      }
      window.addEventListener('pointermove', move, { passive: true })
      cleanup = () => window.removeEventListener('pointermove', move)
    }

    // touch: drag sideways across the glass to turn it (vertical swipes still scroll the page)
    if (!finePointer()) {
      const mx = gsap.quickTo(mouse, 'rotationY', { duration: 0.9, ease: 'power3.out' })
      const my = gsap.quickTo(mouse, 'rotationX', { duration: 0.9, ease: 'power3.out' })
      const tv = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const nx = (e.clientX - r.left) / r.width - 0.5
        const ny = (e.clientY - r.top) / r.height - 0.5
        mx(-16 + nx * 40)
        my(4 - ny * 16)
      }
      el.addEventListener('pointermove', tv)
      el.addEventListener('pointerdown', tv)
      cleanup = () => {
        el.removeEventListener('pointermove', tv)
        el.removeEventListener('pointerdown', tv)
      }
    }

    return () => {
      off()
      cleanup()
      ambient.forEach((t) => t.kill())
      st.kill()
    }
  })

  return (
    <div ref={root} className={className} style={{ touchAction: 'pan-y' }}>
      <Stage w={WORLD_W} h={WORLD_H} perspective={1700}>
        <div data-scroll className="glass-scene absolute inset-0">
          <div data-sway className="glass-scene absolute inset-0">
            <div data-mouse className="glass-scene absolute inset-0">
              {/* soft floor shadow */}
              <div aria-hidden="true" className="absolute" style={{ left: 40, top: 636, width: 560, height: 96, background: 'radial-gradient(ellipse at center, rgb(16 22 20 / 0.22), transparent 68%)', transform: 'translateZ(-30px)' }} />

              {/* the world behind the glass (soft-edged so it never looks like a rectangle) */}
              <div
                data-bg
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  transform: 'translateZ(-170px) scale(1.1)',
                  WebkitMaskImage: 'radial-gradient(ellipse 74% 70% at 50% 52%, #000 58%, transparent 100%)',
                  maskImage: 'radial-gradient(ellipse 74% 70% at 50% 52%, #000 58%, transparent 100%)',
                }}
              >
                <svg width={WORLD_W} height={WORLD_H} viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} aria-hidden="true">
                  <use href="#qg-world" />
                </svg>
              </div>

              {SLABS.map((s) => (
                <Slab key={s.k} x={s.x} y={s.y} w={s.w} h={s.h} t={s.t} z={s.z} delay={s.d}>
                  <WorldCopy ox={s.x} oy={s.y} dx={s.dx} dy={s.dy} scale={1} />
                </Slab>
              ))}

              {/* measuring line travelling across the composition */}
              <div data-scan aria-hidden="true" className="absolute" style={{ left: 0, top: 70, width: 2, height: 600, opacity: 0, background: 'linear-gradient(180deg, transparent, rgb(72 166 199 / 0.9), transparent)', transform: 'translateZ(170px)' }} />

              {/* technical overlay */}
              <svg data-tech aria-hidden="true" width={WORLD_W} height={WORLD_H} viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} className="absolute inset-0 overflow-visible" fill="none" stroke="rgb(31 116 152)" strokeWidth="1.6" strokeLinecap="round" style={{ transform: 'translateZ(200px)' }}>
                <path className="draw" pathLength={1} d="M176 90 V50 H216" />
                <path className="draw" pathLength={1} d="M414 50 H454 V90" />
                <path className="draw" pathLength={1} d="M454 600 V640 H414" />
                <path className="draw" pathLength={1} d="M216 640 H176 V600" />
                <path className="draw" pathLength={1} d="M196 676 H434 M196 668 V684 M434 668 V684" strokeOpacity="0.85" />
                <path className="draw" pathLength={1} d="M150 64 V626 M142 64 H158 M142 626 H158" strokeOpacity="0.85" />
                <circle className="draw" pathLength={1} cx="560" cy="120" r="24" />
                <path className="draw" pathLength={1} d="M560 84 V156 M524 120 H596" strokeOpacity="0.6" />
                <path className="draw" pathLength={1} d="M596 330 H628 M596 338 H620 M596 346 H628 M596 354 H620" strokeOpacity="0.55" />
              </svg>
            </div>
          </div>
        </div>
      </Stage>
    </div>
  )
}
