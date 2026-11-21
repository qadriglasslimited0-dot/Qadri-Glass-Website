import { useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useMotion } from '../../hooks/useMotion'
import { Slab, Stage, WorldCopy } from './kit'

/**
 * A glass composition that stays in view while the three statistics scroll past and TRANSFORMS with them:
 *   65+    one sheet of glass stands up and turns to face you
 *   1,000+ the sheet breaks into a field of panes that assemble into a curtain wall
 *   3      the wall gives way to three laminated layers that separate to show their depth
 * It swings to the side opposite each number, a façade grid draws itself behind, and a band of light crosses
 * the whole stage as you scroll. Scroll-linked (scrubbed), with slow ambient sway on top.
 */
const rnd = (i: number, k: number) => (Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1

export default function StatsGlass() {
  const root = useRef<HTMLDivElement>(null)

  useMotion(root, ({ reduced, desktop }) => {
    const el = root.current
    // the wrapper is the nearest [data-stats-wrap]; looked up from the DOM because a parent's ref is not attached yet
    const trigger = el?.closest('[data-stats-wrap]')
    if (!el || !trigger || !desktop) return
    const q = gsap.utils.selector(el)
    const obj = q('[data-obj]')[0]
    const A = q('[data-cfg="a"]')[0]
    const B = q('[data-cfg="b"]')[0]
    const C = q('[data-cfg="c"]')[0]
    const tiles = q('[data-cfg="b"] .slab')
    const layers = q('[data-cfg="c"] .slab')
    const lines = q('[data-line]')
    const band = q('[data-band]')[0]
    const glow = q('[data-glow]')[0]

    gsap.set(obj, { xPercent: -50, yPercent: -50, x: '30vw' })
    gsap.set([A, B, C], { rotationX: 6 })
    gsap.set(B, { rotationY: -12 })
    gsap.set(C, { rotationY: -30 })
    if (reduced) {
      gsap.set([B, C], { opacity: 0 })
      gsap.set(A, { rotationY: -18 })
      gsap.set(lines, { strokeDashoffset: 0 })
      return
    }
    gsap.set([B, C], { opacity: 0 })
    gsap.set(lines, { strokeDashoffset: 1 })

    // ambient sway on top of the scroll-driven transformation
    const ambient = [
      gsap.to(q('[data-sway]'), { rotationY: 5, duration: 7, yoyo: true, repeat: -1, ease: 'sine.inOut' }),
      gsap.to(glow, { opacity: 0.55, duration: 5, yoyo: true, repeat: -1, ease: 'sine.inOut' }),
    ]

    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger, start: 'top 70%', end: 'bottom 40%', scrub: true } })
    // façade grid draws and the light band crosses the whole stage
    tl.to(lines, { strokeDashoffset: 0, stagger: 0.012, duration: 0.45 }, 0)
    tl.fromTo(band, { xPercent: -140 }, { xPercent: 260, duration: 1 }, 0)
    // 1. single sheet turns to face you
    tl.fromTo(A, { rotationY: 72, opacity: 0 }, { rotationY: -18, opacity: 1, duration: 0.26 }, 0)
    // 2. swings left, sheet gives way to a field of panes that assemble
    tl.to(obj, { x: '-30vw', duration: 0.16 }, 0.3)
    tl.to(A, { opacity: 0, rotationY: -64, duration: 0.14 }, 0.3)
    tl.to(B, { opacity: 1, duration: 0.06 }, 0.32)
    tl.fromTo(
      tiles,
      { x: (i) => rnd(i, 1) * 320, y: (i) => rnd(i, 2) * 240, z: (i) => -260 - Math.abs(rnd(i, 3)) * 260, rotationY: (i) => rnd(i, 4) * 140, rotationX: (i) => rnd(i, 5) * 70, opacity: 0 },
      { x: 0, y: 0, z: 0, rotationY: 0, rotationX: 0, opacity: 1, duration: 0.24, stagger: 0.008 },
      0.32,
    )
    // 3. swings right, wall gives way to three laminated layers that separate
    tl.to(obj, { x: '30vw', duration: 0.16 }, 0.64)
    tl.to(B, { opacity: 0, rotationY: 40, duration: 0.14 }, 0.64)
    tl.to(C, { opacity: 1, duration: 0.06 }, 0.68)
    tl.fromTo(layers, { z: (i) => (i - 1) * 8 }, { z: (i) => (i - 1) * 120, duration: 0.26, ease: 'power1.inOut' }, 0.68)

    return () => {
      ambient.forEach((a) => a.kill())
      tl.kill()
    }
  })

  const cols = 16
  const rows = 10
  return (
    <div ref={root} aria-hidden="true" className="absolute inset-0">
      {/* façade grid + travelling light */}
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" fill="none" stroke="rgb(255 255 255 / 0.13)" strokeWidth="1">
        {Array.from({ length: cols + 1 }, (_, i) => (
          <path key={'v' + i} data-line pathLength={1} className="draw" d={`M${i * 90} 0 V900`} />
        ))}
        {Array.from({ length: rows + 1 }, (_, i) => (
          <path key={'h' + i} data-line pathLength={1} className="draw" d={`M0 ${i * 90} H1440`} />
        ))}
      </svg>
      <div data-glow className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35" style={{ background: 'radial-gradient(circle, rgb(150 190 215 / 0.26), transparent 65%)' }} />
      <div data-band className="absolute inset-y-0 left-0 w-[22%] -skew-x-12" style={{ background: 'linear-gradient(90deg, transparent, rgb(255 255 255 / 0.1), transparent)' }} />

      <div data-obj className="absolute left-1/2 top-1/2 w-[min(34vw,500px)]">
        <Stage w={560} h={560} perspective={1500}>
          <div data-sway className="glass-scene absolute inset-0">
            {/* A: one sheet */}
            <div data-cfg="a" className="glass-scene absolute inset-0">
              <Slab x={150} y={70} w={260} h={420} t={22} delay={0.4}>
                <WorldCopy ox={150} oy={70} dx={-26} dy={8} />
              </Slab>
            </div>
            {/* B: field of panes */}
            <div data-cfg="b" className="glass-scene absolute inset-0">
              {Array.from({ length: 16 }, (_, n) => {
                const c = n % 4
                const r = Math.floor(n / 4)
                const x = 18 + c * 136
                const y = 18 + r * 136
                return (
                  <Slab key={n} x={x} y={y} w={128} h={128} t={9} delay={(c + r) * 0.5}>
                    <WorldCopy ox={x} oy={y} dx={-12 + c * 4} dy={-8 + r * 4} />
                  </Slab>
                )
              })}
            </div>
            {/* C: three laminated layers */}
            <div data-cfg="c" className="glass-scene absolute inset-0">
              {[0, 1, 2].map((i) => (
                <Slab key={i} x={130} y={90 + i * 14} w={300} h={380} t={16} delay={i * 1.2}>
                  <WorldCopy ox={130} oy={90 + i * 14} dx={-20 + i * 14} dy={6 + i * 6} />
                </Slab>
              ))}
            </div>
          </div>
        </Stage>
      </div>
    </div>
  )
}
