import { useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useMotion } from '../../hooks/useMotion'

/**
 * Mission: precision, shown rather than described.
 * Five panes begin slightly out of true, so a beam of light bends as it passes through each one.
 * As you read, the panes settle into perfect alignment and the beam straightens: calibration marks and
 * dimension lines draw in as it does. The whole drawing is driven by scroll progress through the section.
 */
const N = 5
const X0 = 70
const STEP = 100
const W = 70
const H = 300
const Y0 = 130
const OFF = [-74, 58, -42, 82, -60] // vertical error of each pane at the start
const ROT = [-13, 9, -7, 12, -10] // rotation error at the start

export default function MissionGlass({ className = '' }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useMotion(root, ({ reduced, desktop }) => {
    const el = root.current
    if (!el) return
    const track = el.closest('[data-track]')
    const q = gsap.utils.selector(el)
    const panes = q('[data-pane]')
    const beam = q('[data-beam]')[0]
    const beamGlow = q('[data-beam-glow]')[0]
    const marks = q('[data-mark]')
    const draws = q('.draw')

    const apply = (p: number) => {
      const k = 1 - p
      let d = `M0 ${Y0 + H / 2}`
      panes.forEach((g, i) => {
        gsap.set(g, { y: OFF[i] * k, rotation: ROT[i] * k, svgOrigin: `${X0 + i * STEP + W / 2} ${Y0 + H / 2}` })
        // the beam is deflected by however far this pane is out of true
        d += ` L${X0 + i * STEP + W / 2} ${Y0 + H / 2 + OFF[i] * k * 0.42}`
      })
      d += ` L620 ${Y0 + H / 2}`
      beam.setAttribute('d', d)
      beamGlow.setAttribute('d', d)
      marks.forEach((m) => ((m as unknown as SVGElement).style.opacity = String(Math.max(0, (p - 0.55) / 0.45))))
    }

    if (reduced || !desktop || !track) {
      apply(1)
      gsap.set(draws, { strokeDashoffset: 0 })
      return
    }
    apply(0)
    gsap.set(draws, { strokeDashoffset: 1 })
    const o = { p: 0 }
    const t1 = gsap.to(o, { p: 1, ease: 'none', onUpdate: () => apply(o.p), scrollTrigger: { trigger: track, start: 'top 55%', end: 'bottom bottom', scrub: true } })
    const t2 = gsap.to(draws, { strokeDashoffset: 0, duration: 1.6, stagger: 0.07, ease: 'power2.inOut', scrollTrigger: { trigger: track, start: 'top 60%', once: true } })
    // ambient: the light breathes
    const t3 = gsap.to(beamGlow, { opacity: 0.25, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    return () => {
      t1.kill()
      t2.kill()
      t3.kill()
    }
  })

  return (
    <div ref={root} className={className} aria-hidden="true">
      <svg viewBox="0 0 620 560" className="h-auto w-full overflow-visible" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="mg-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="0.12" stopColor="#8CD6B2" />
            <stop offset="1" stopColor="#48A6C7" />
          </linearGradient>
          <linearGradient id="mg-pane" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="0.5" stopColor="#B9E6D0" stopOpacity="0.22" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.34" />
          </linearGradient>
        </defs>

        {/* datum + dimensions */}
        <path className="draw" pathLength={1} d={`M20 ${Y0 + H / 2} H600`} stroke="rgb(255 255 255 / 0.35)" strokeDasharray="none" />
        <path className="draw" pathLength={1} d={`M${X0} 500 H${X0 + (N - 1) * STEP + W}`} stroke="rgb(255 255 255 / 0.6)" strokeWidth="1.5" />
        {Array.from({ length: N }, (_, i) => (
          <path key={'t' + i} data-mark d={`M${X0 + i * STEP + W / 2} 492 V508`} stroke="rgb(255 255 255 / 0.7)" strokeWidth="1.5" />
        ))}
        <path className="draw" pathLength={1} d={`M${X0 - 24} ${Y0} V${Y0 + H} M${X0 - 32} ${Y0} H${X0 - 16} M${X0 - 32} ${Y0 + H} H${X0 - 16}`} stroke="rgb(255 255 255 / 0.55)" strokeWidth="1.5" />

        {/* panes: front face, thickness, edge highlight */}
        {Array.from({ length: N }, (_, i) => {
          const x = X0 + i * STEP
          return (
            <g key={i} data-pane>
              <path d={`M${x + W} ${Y0 - 18} L${x + W + 13} ${Y0 - 13} V${Y0 + H - 13} L${x + W} ${Y0 + H - 18}Z`} fill="rgb(54 150 100)" stroke="rgb(255 255 255 / 0.5)" strokeWidth="1" />
              <path d={`M${x} ${Y0} L${x + W} ${Y0 - 18} V${Y0 + H - 18} L${x} ${Y0 + H}Z`} fill="url(#mg-pane)" stroke="rgb(255 255 255 / 0.85)" strokeWidth="1.4" />
              <path d={`M${x + 12} ${Y0 + 40} L${x + 44} ${Y0 + 22} M${x + 12} ${Y0 + 86} L${x + 58} ${Y0 + 60}`} stroke="rgb(255 255 255 / 0.55)" strokeWidth="1.4" />
            </g>
          )
        })}

        {/* the beam: thick soft underlay + crisp line */}
        <path data-beam-glow d="M0 280 L620 280" stroke="url(#mg-beam)" strokeWidth="14" opacity="0.35" />
        <path data-beam d="M0 280 L620 280" stroke="url(#mg-beam)" strokeWidth="3.2" />

        {/* calibration marks (appear as the panes come into line) */}
        <g data-mark stroke="rgb(255 255 255 / 0.85)" strokeWidth="1.5">
          <circle cx="590" cy={Y0 + H / 2} r="22" />
          <path d={`M590 ${Y0 + H / 2 - 34} V${Y0 + H / 2 + 34} M556 ${Y0 + H / 2} H624`} strokeOpacity="0.6" />
        </g>
      </svg>
    </div>
  )
}
