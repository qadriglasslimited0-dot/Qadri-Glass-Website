import { useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useMotion } from '../hooks/useMotion'

/**
 * Bespoke animated SVG diagrams. Each loops only while on screen and renders a calm static
 * end-state under prefers-reduced-motion.
 */
function useLoop(build: (el: SVGSVGElement, q: (s: string) => Element[]) => gsap.core.Timeline) {
  const ref = useRef<SVGSVGElement>(null)
  useMotion(ref, ({ reduced }) => {
    const el = ref.current
    if (!el) return
    const q = gsap.utils.selector(el)
    const tl = build(el, q)
    tl.pause(0)
    if (reduced) {
      tl.progress(1).pause()
      return
    }
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      end: 'bottom 5%',
      onToggle: (s) => (s.isActive ? tl.play() : tl.pause()),
    })
  })
  return ref
}

const stroke = 'rgb(var(--fg) / 0.55)'
const faint = 'rgb(var(--fg) / 0.14)'
const azure = 'rgb(var(--accent))'

/* ----------------------------- SERVICES ----------------------------- */

export function ArtArchitectural({ className = '' }: { className?: string }) {
  const ref = useLoop((_, q) => {
    const tl = gsap.timeline({ repeat: -1 })
    tl.fromTo(q('.pane'), { fillOpacity: 0.03 }, { fillOpacity: 0.34, duration: 1.4, stagger: { each: 0.09, from: 'random', repeat: 1, yoyo: true }, ease: 'sine.inOut' }, 0)
    tl.fromTo(q('.sweep'), { x: -260 }, { x: 460, duration: 3.4, ease: 'power2.inOut' }, 0.3)
    return tl
  })
  const cols = 6
  const rows = 5
  return (
    <svg ref={ref} viewBox="0 0 400 300" className={className} role="img" aria-label="Animated glass façade grid catching light">
      <defs>
        <clipPath id="facade-clip"><rect x="40" y="24" width="320" height="252" /></clipPath>
        <linearGradient id="sweepg" x1="0" x2="1"><stop offset="0" stopColor="rgb(var(--fg))" stopOpacity="0" /><stop offset=".5" stopColor="rgb(var(--fg))" stopOpacity=".5" /><stop offset="1" stopColor="rgb(var(--fg))" stopOpacity="0" /></linearGradient>
      </defs>
      <g clipPath="url(#facade-clip)">
        {Array.from({ length: rows * cols }).map((_, i) => {
          const c = i % cols
          const r = Math.floor(i / cols)
          return <rect key={i} className="pane" x={40 + c * 53.3 + 1.5} y={24 + r * 50.4 + 1.5} width="50.3" height="47.4" fill={azure} fillOpacity="0.05" stroke={stroke} strokeWidth="0.6" />
        })}
        <polygon className="sweep" points="0,0 40,0 -10,300 -50,300" fill="url(#sweepg)" opacity="0.55" />
      </g>
      <rect x="40" y="24" width="320" height="252" fill="none" stroke="rgb(var(--fg) / .7)" strokeWidth="1" />
    </svg>
  )
}

export function ArtFabrication({ className = '' }: { className?: string }) {
  const ref = useLoop((_, q) => {
    const pts = [[110, 90], [290, 90], [290, 210], [110, 210], [110, 90]]
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 })
    const lines = q('.cut')
    gsap.set(lines, { strokeDasharray: 200, strokeDashoffset: 200 })
    gsap.set(q('.head'), { attr: { cx: pts[0][0], cy: pts[0][1] } })
    gsap.set([q('.piece'), q('.dim')], { opacity: 0 })
    gsap.set(q('.piece'), { x: 0 })
    lines.forEach((l, i) => {
      tl.to(l, { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, i === 0 ? 0.4 : '>')
      tl.to(q('.head'), { attr: { cx: pts[i + 1][0], cy: pts[i + 1][1] }, duration: 0.7, ease: 'none' }, '<')
    })
    tl.to(q('.head'), { opacity: 0, duration: 0.2 })
    tl.to(q('.piece'), { opacity: 1, duration: 0.3 }, '<')
    tl.to(q('.piece'), { x: 12, duration: 0.8, ease: 'power3.out' })
    tl.to(q('.dim'), { opacity: 1, duration: 0.5, stagger: 0.15 }, '<0.2')
    tl.to([q('.piece'), q('.dim'), lines], { opacity: 0, duration: 0.5 }, '+=1.4')
    tl.set(q('.head'), { opacity: 1 })
    tl.set(lines, { strokeDashoffset: 200 })
    return tl
  })
  return (
    <svg ref={ref} viewBox="0 0 400 300" className={className} role="img" aria-label="Animated cutting path across a glass sheet">
      <rect x="50" y="50" width="300" height="200" fill="rgb(var(--accent) / 0.06)" stroke={stroke} strokeWidth="0.8" />
      <path d="M50 120 L350 70 M50 200 L350 150" stroke={faint} strokeWidth="0.8" />
      <rect className="piece" x="110" y="90" width="180" height="120" fill={azure} fillOpacity="0.18" stroke="rgb(var(--fg))" strokeWidth="1" />
      {[0, 1, 2, 3].map((i) => {
        const a = [[110, 90], [290, 90], [290, 210], [110, 210]]
        const b = [[290, 90], [290, 210], [110, 210], [110, 90]]
        return <line key={i} className="cut" x1={a[i][0]} y1={a[i][1]} x2={b[i][0]} y2={b[i][1]} stroke={azure} strokeWidth="1.6" />
      })}
      <g className="dim" stroke={stroke} strokeWidth="0.8" fill="none">
        <path d="M110 232 H290 M110 227 V237 M290 227 V237" />
        <path d="M320 90 V210 M315 90 H325 M315 210 H325" />
      </g>
      <circle className="head" cx="110" cy="90" r="5" fill="rgb(var(--fg))" />
      <circle className="head" cx="110" cy="90" r="12" fill="none" stroke={azure} strokeWidth="0.8" />
    </svg>
  )
}

export function ArtInstallation({ className = '' }: { className?: string }) {
  const ref = useLoop((_, q) => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 })
    gsap.set(q('.slab'), { y: -130, opacity: 0 })
    gsap.set(q('.lvl'), { opacity: 0 })
    gsap.set(q('.tick'), { strokeDasharray: 60, strokeDashoffset: 60 })
    tl.to(q('.slab'), { y: 0, opacity: 1, duration: 1.6, ease: 'power3.out' })
    tl.to(q('.slab'), { y: -3, duration: 0.18, yoyo: true, repeat: 1, ease: 'sine.inOut' })
    tl.to(q('.lvl'), { opacity: 1, duration: 0.4 }, '-=0.2')
    tl.to(q('.bubble'), { x: 14, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' })
    tl.to(q('.tick'), { strokeDashoffset: 0, duration: 0.6 }, '<0.3')
    tl.to([q('.slab'), q('.lvl'), q('.tick')], { opacity: 0, duration: 0.6 }, '+=1.5')
    tl.set(q('.tick'), { strokeDashoffset: 60, opacity: 1 })
    return tl
  })
  return (
    <svg ref={ref} viewBox="0 0 400 300" className={className} role="img" aria-label="Animated glass panel being fitted into a frame">
      <rect x="95" y="40" width="210" height="230" fill="none" stroke="rgb(var(--fg) / .7)" strokeWidth="6" />
      <rect x="95" y="40" width="210" height="230" fill="none" stroke="rgb(var(--bg2))" strokeWidth="2" />
      <g className="slab">
        <rect x="103" y="48" width="194" height="214" fill={azure} fillOpacity="0.16" stroke="rgb(var(--fg))" strokeWidth="1" />
        <path d="M120 262 L210 48 M170 262 L260 48" stroke="rgb(var(--fg) / .28)" strokeWidth="6" />
      </g>
      <g className="lvl">
        <line x1="40" y1="155" x2="360" y2="155" stroke={azure} strokeWidth="0.8" strokeDasharray="4 5" />
        <rect x="170" y="144" width="60" height="22" rx="11" fill="rgba(4,6,10,.8)" stroke={stroke} />
        <circle className="bubble" cx="193" cy="155" r="6" fill={azure} />
      </g>
      <path className="tick" d="M180 205 L200 228 L240 180" fill="none" stroke="rgb(var(--accent2))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ArtDecorative({ className = '' }: { className?: string }) {
  const ref = useLoop((_, q) => {
    const tl = gsap.timeline({ repeat: -1 })
    tl.fromTo(q('.flute'), { fillOpacity: 0.04 }, { fillOpacity: 0.3, duration: 1.2, stagger: { each: 0.12, repeat: 1, yoyo: true }, ease: 'sine.inOut' }, 0)
    tl.fromTo(q('.ripple'), { scale: 0.2, opacity: 0.8 }, { scale: 1.6, opacity: 0, duration: 3, stagger: 0.9, ease: 'power1.out', transformOrigin: '50% 50%' }, 0)
    return tl
  })
  return (
    <svg ref={ref} viewBox="0 0 400 300" className={className} role="img" aria-label="Animated fluted and patterned decorative glass">
      <defs><clipPath id="deco-clip"><rect x="60" y="30" width="280" height="240" /></clipPath></defs>
      <g clipPath="url(#deco-clip)">
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={i} className="flute" x={60 + i * 20} y="30" width="19" height="240" fill="rgb(var(--fg))" fillOpacity="0.05" stroke={faint} strokeWidth="0.5" />
        ))}
        {[0, 1, 2].map((i) => (
          <circle key={i} className="ripple" cx="200" cy="150" r="90" fill="none" stroke={azure} strokeWidth="1" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
        ))}
      </g>
      <rect x="60" y="30" width="280" height="240" fill="none" stroke="rgb(var(--fg) / .7)" />
    </svg>
  )
}

/* ----------------------------- QUALITY ----------------------------- */

export function ArtPrecision({ className = '' }: { className?: string }) {
  const ref = useLoop((_, q) => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 })
    gsap.set(q('.arrow'), { scaleX: 0, transformOrigin: 'left center', transformBox: 'fill-box' })
    tl.fromTo(q('.edge'), { strokeDashoffset: 320 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' })
    tl.to(q('.arrow'), { scaleX: 1, duration: 0.7, stagger: 0.2, ease: 'expo.out' }, '-=0.3')
    tl.fromTo(q('.mt'), { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.03 }, '<')
    tl.to([q('.arrow'), q('.mt')], { opacity: 0, duration: 0.5 }, '+=1.5')
    tl.set(q('.arrow'), { opacity: 1, scaleX: 0 })
    return tl
  })
  return (
    <svg ref={ref} viewBox="0 0 400 300" className={className} role="img" aria-label="Animated measurement of a glass edge">
      <rect x="70" y="60" width="260" height="170" fill="rgb(var(--accent) / .07)" />
      <rect className="edge" x="70" y="60" width="260" height="170" fill="none" stroke="rgb(var(--fg))" strokeWidth="1.2" strokeDasharray="320 800" />
      {Array.from({ length: 27 }).map((_, i) => (
        <line key={i} className="mt" x1={70 + i * 10} y1="250" x2={70 + i * 10} y2={i % 5 === 0 ? 266 : 258} stroke={stroke} strokeWidth="0.8" />
      ))}
      <line className="arrow" x1="70" y1="40" x2="330" y2="40" stroke={azure} strokeWidth="1" />
      <line className="arrow" x1="350" y1="60" x2="350" y2="230" stroke={azure} strokeWidth="1" style={{ transformOrigin: 'top' }} />
    </svg>
  )
}

export function ArtTraceability({ className = '' }: { className?: string }) {
  const ref = useLoop((_, q) => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 })
    gsap.set(q('.link'), { strokeDasharray: 100, strokeDashoffset: 100 })
    gsap.set(q('.node'), { scale: 0.4, opacity: 0.25, transformOrigin: 'center', transformBox: 'fill-box' })
    q('.node').forEach((n, i) => {
      tl.to(n, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, i * 0.7)
      if (q('.link')[i]) tl.to(q('.link')[i], { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, i * 0.7 + 0.3)
    })
    tl.to(q('.node'), { opacity: 0.3, duration: 0.6 }, '+=1.4')
    tl.set(q('.link'), { strokeDashoffset: 100 })
    return tl
  })
  const xs = [60, 160, 260, 350]
  return (
    <svg ref={ref} viewBox="0 0 400 300" className={className} role="img" aria-label="Animated chain linking material source to finished glass">
      {[0, 1, 2].map((i) => (
        <line key={i} className="link" x1={xs[i]} y1="150" x2={xs[i + 1]} y2="150" stroke={azure} strokeWidth="1.4" pathLength={100} />
      ))}
      {xs.map((x, i) => (
        <g key={i} className="node">
          <circle cx={x} cy="150" r="22" fill="rgb(var(--bg2))" stroke="rgb(var(--fg))" strokeWidth="1" />
          <circle cx={x} cy="150" r="6" fill={i === 3 ? 'rgb(var(--accent2))' : azure} />
          <line x1={x} y1="182" x2={x} y2="204" stroke={faint} />
        </g>
      ))}
    </svg>
  )
}

export function ArtInspection({ className = '' }: { className?: string }) {
  const ref = useLoop((_, q) => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 })
    gsap.set(q('.ok'), { strokeDasharray: 30, strokeDashoffset: 30 })
    tl.fromTo(q('.scan'), { y: 0 }, { y: 170, duration: 2.6, ease: 'sine.inOut' })
    q('.ok').forEach((o, i) => tl.to(o, { strokeDashoffset: 0, duration: 0.4 }, 0.5 + i * 0.7))
    tl.to(q('.scan'), { y: 0, duration: 1.2, ease: 'sine.inOut' }, '+=0.4')
    tl.to(q('.ok'), { strokeDashoffset: 30, duration: 0.4 }, '<')
    return tl
  })
  return (
    <svg ref={ref} viewBox="0 0 400 300" className={className} role="img" aria-label="Animated inspection scan across a glass pane">
      <rect x="90" y="55" width="220" height="170" fill="rgb(var(--accent) / .07)" stroke="rgb(var(--fg))" strokeWidth="1" />
      <g className="scan">
        <rect x="90" y="52" width="220" height="6" fill={azure} fillOpacity="0.35" />
        <line x1="70" y1="55" x2="330" y2="55" stroke={azure} strokeWidth="1.4" />
      </g>
      {[[130, 100], [250, 150], [160, 195]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="14" fill="none" stroke={faint} />
          <path className="ok" d={`M${x - 6} ${y} l4 5 l8 -10`} fill="none" stroke="rgb(var(--accent2))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
    </svg>
  )
}

export function ArtStandards({ className = '' }: { className?: string }) {
  const ref = useLoop((_, q) => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 })
    gsap.set(q('.sheet'), { y: 30, opacity: 0 })
    gsap.set(q('.ln'), { scaleX: 0, transformOrigin: 'left center', transformBox: 'fill-box' })
    tl.to(q('.sheet'), { y: 0, opacity: 1, duration: 0.8, stagger: 0.25, ease: 'expo.out' })
    tl.to(q('.ln'), { scaleX: 1, duration: 0.5, stagger: 0.07, ease: 'power3.out' }, '-=0.5')
    tl.to([q('.sheet'), q('.ln')], { opacity: 0, duration: 0.6 }, '+=1.6')
    return tl
  })
  return (
    <svg ref={ref} viewBox="0 0 400 300" className={className} role="img" aria-label="Animated stack of documented specification sheets">
      {[0, 1, 2].map((s) => (
        <g key={s} className="sheet" transform={`translate(${100 + s * 22} ${40 + s * 18})`}>
          <rect width="170" height="200" fill="rgb(var(--bg2))" stroke="rgb(var(--fg) / .6)" />
          <rect width="170" height="26" fill="rgb(var(--accent) / .12)" />
          {[0, 1, 2, 3, 4].map((l) => (
            <line key={l} className={s === 2 ? 'ln' : ''} x1="16" y1={52 + l * 24} x2={l === 4 ? 100 : 154} y2={52 + l * 24} stroke={faint} strokeWidth="2" />
          ))}
        </g>
      ))}
    </svg>
  )
}

export const SERVICE_ART = {
  'architectural-glass': ArtArchitectural,
  'custom-fabrication': ArtFabrication,
  'professional-installation': ArtInstallation,
  'decorative-solutions': ArtDecorative,
} as const

export const QUALITY_ART = {
  precision: ArtPrecision,
  traceability: ArtTraceability,
  inspection: ArtInspection,
  standards: ArtStandards,
} as const
