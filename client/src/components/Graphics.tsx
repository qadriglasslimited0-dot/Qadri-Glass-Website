import { useRef, type ReactNode } from 'react'
import { gsap, EASE } from '../lib/gsap'
import { useMotion } from '../hooks/useMotion'

/**
 * Original Qadri Glass illustration set.
 * Every drawing is built from stroked SVG paths (class "draw", pathLength=1) so one helper can
 * draw them on scroll, plus translucent fills (class "fade"). Colour comes from currentColor and
 * the CSS variables, so each drawing adapts to light, deep and brand sections.
 * Nothing here depicts real equipment or processes: they are diagrams of glass itself.
 */

/** Draws every `.draw` path inside when scrolled into view (and again on hover of the nearest [data-hover-draw]). */
export function DrawSVG({ children, viewBox, className = '', title }: { children: ReactNode; viewBox: string; className?: string; title?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  useMotion(ref, ({ reduced }) => {
    const svg = ref.current
    if (!svg) return
    const paths = svg.querySelectorAll<SVGElement>('.draw')
    const fills = svg.querySelectorAll<SVGElement>('.fade')
    if (reduced) {
      gsap.set(paths, { strokeDashoffset: 0 })
      return
    }
    gsap.set(fills, { opacity: 0 })
    const play = () => {
      gsap.fromTo(paths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.7, stagger: 0.09, ease: 'power2.inOut', overwrite: true })
      gsap.fromTo(fills, { opacity: 0 }, { opacity: 1, duration: 1.2, delay: 0.7, stagger: 0.08, ease: 'power1.out', overwrite: true })
    }
    gsap.set(paths, { strokeDashoffset: 1 })
    const st = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 88%', once: true } })
    st.add(play)
    const host = svg.closest('[data-hover-draw]')
    if (host) {
      const on = () => play()
      host.addEventListener('pointerenter', on)
      return () => host.removeEventListener('pointerenter', on)
    }
  })
  return (
    <svg ref={ref} viewBox={viewBox} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

const D = (d: string, extra: Record<string, string | number> = {}) => <path className="draw" pathLength={1} d={d} {...extra} />

/* ---------------- Services ---------------- */

/** Architectural glass: a curtain-wall façade with reflected light. */
export function FacadeArt({ className = '' }: { className?: string }) {
  return (
    <DrawSVG viewBox="0 0 400 320" className={className}>
      <rect className="fade" x="60" y="40" width="280" height="250" fill="rgb(var(--mintc) / 0.2)" stroke="none" />
      <rect className="fade" x="106" y="102" width="47" height="62" fill="rgb(var(--amber) / 0.28)" stroke="none" />
      <rect className="fade" x="247" y="164" width="47" height="62" fill="rgb(var(--amber) / 0.2)" stroke="none" />
      {D('M60 290 V40 H340 V290 Z')}
      {D('M106 40 V290')}
      {D('M153 40 V290')}
      {D('M200 40 V290')}
      {D('M247 40 V290')}
      {D('M294 40 V290')}
      {D('M60 102 H340')}
      {D('M60 164 H340')}
      {D('M60 226 H340')}
      {D('M20 290 H380')}
      {D('M72 128 L140 56', { strokeOpacity: 0.55, strokeDasharray: 'none' })}
      {D('M72 190 L202 60', { strokeOpacity: 0.4 })}
      {D('M160 290 L300 150', { strokeOpacity: 0.35 })}
      {D('M60 40 L200 12 L340 40', { strokeOpacity: 0.6 })}
    </DrawSVG>
  )
}

/** Custom fabrication: a sheet with its cut line and dimension marks (no machinery shown). */
export function FabricationArt({ className = '' }: { className?: string }) {
  return (
    <DrawSVG viewBox="0 0 400 320" className={className}>
      <path className="fade" d="M50 80 H300 Q350 80 350 130 V250 H50 Z" fill="rgb(var(--mintc) / 0.22)" stroke="none" />
      {D('M50 80 H300 Q350 80 350 130 V250 H50 Z')}
      {D('M82 112 H292 Q318 112 318 138 V218 H82 Z', { strokeDasharray: '0.012 0.02', strokeOpacity: 0.95, stroke: 'rgb(var(--amber))', strokeWidth: 2.4 })}
      {D('M50 52 H350')}
      {D('M50 44 V60')}
      {D('M350 44 V60')}
      {D('M22 80 V250')}
      {D('M14 80 H30')}
      {D('M14 250 H30')}
      {D('M200 150 V190 M180 170 H220', { stroke: 'rgb(var(--amber))' })}
      {D('M58 238 L98 198', { strokeOpacity: 0.5 })}
      {D('M70 240 L110 200', { strokeOpacity: 0.35 })}
    </DrawSVG>
  )
}

/** Professional installation: a pane being set true into its frame, with level and plumb marks. */
export function InstallArt({ className = '' }: { className?: string }) {
  return (
    <DrawSVG viewBox="0 0 400 320" className={className}>
      <rect className="fade" x="134" y="34" width="168" height="190" fill="rgb(var(--mintc) / 0.26)" stroke="none" />
      {D('M90 290 V40 H310 V290 Z')}
      {D('M116 264 V66 H284 V264 Z', { strokeOpacity: 0.7 })}
      {D('M134 224 V34 H302 V224 Z', { stroke: 'rgb(var(--amber))', strokeWidth: 2.2 })}
      {D('M170 142 H230 Q238 142 238 150 Q238 158 230 158 H170 Q162 158 162 150 Q162 142 170 142 Z')}
      {D('M200 142 V158', { strokeOpacity: 0.5 })}
      <circle className="fade" cx="212" cy="150" r="5" fill="rgb(var(--amber))" stroke="none" />
      {D('M218 8 V282', { strokeDasharray: 'none', strokeOpacity: 0.5 })}
      {D('M218 282 L210 298 H226 Z')}
      {D('M60 290 H340')}
      {D('M72 56 L90 40 M310 40 L328 56', { strokeOpacity: 0.5 })}
    </DrawSVG>
  )
}

/** Decorative solutions: fluted / reeded glass with a flowing pattern line. */
export function FlutedArt({ className = '' }: { className?: string }) {
  const reeds = Array.from({ length: 10 }, (_, i) => 52 + i * 31)
  return (
    <DrawSVG viewBox="0 0 400 320" className={className}>
      <rect className="fade" x="46" y="38" width="310" height="244" fill="rgb(var(--mintc) / 0.18)" stroke="none" />
      {reeds.map((x) => (
        <g key={x}>
          {D(`M${x} 52 H${x + 24} V268 H${x} Z`)}
          {D(`M${x + 7} 64 V256`, { strokeOpacity: 0.35 })}
        </g>
      ))}
      {D('M30 190 C90 90, 150 90, 200 160 S310 240, 372 110', { stroke: 'rgb(var(--amber))', strokeWidth: 2.4 })}
      {D('M30 214 C90 114, 150 114, 200 184 S310 264, 372 134', { strokeOpacity: 0.4 })}
    </DrawSVG>
  )
}

export const SERVICE_ART: Record<string, (p: { className?: string }) => ReactNode> = {
  'architectural-glass': FacadeArt,
  'custom-fabrication': FabricationArt,
  'professional-installation': InstallArt,
  'decorative-solutions': FlutedArt,
}

/* ---------------- Mission / Vision / Heritage ---------------- */

/** Mission: layered panes with a beam of light bending through each one. */
export function MissionArt({ className = '' }: { className?: string }) {
  const panes = [
    'M110 120 L250 90 L250 400 L110 430 Z',
    'M190 112 L330 82 L330 392 L190 422 Z',
    'M270 104 L410 74 L410 384 L270 414 Z',
    'M350 96 L490 66 L490 376 L350 406 Z',
  ]
  return (
    <DrawSVG viewBox="0 0 600 500" className={className}>
      {panes.map((d, i) => (
        <g key={i}>
          <path className="fade" d={d} fill={`rgb(var(--mintc) / ${0.1 + i * 0.04})`} stroke="none" />
          {D(d)}
        </g>
      ))}
      {D('M8 238 L110 244 L190 252 L270 256 L350 262 L490 268 L592 266', { stroke: 'rgb(var(--amber))', strokeWidth: 3 })}
      {D('M250 250 L276 150', { strokeOpacity: 0.55, stroke: 'rgb(var(--amber))' })}
      {D('M410 262 L440 360', { strokeOpacity: 0.55, stroke: 'rgb(var(--amber))' })}
      {D('M40 450 H560', { strokeOpacity: 0.4 })}
    </DrawSVG>
  )
}

/** Vision: towers of glass rising to a rising sun. */
export function VisionArt({ className = '' }: { className?: string }) {
  const tower = (x: number, w: number, top: number, key: number) => (
    <g key={key}>
      <rect className="fade" x={x} y={top} width={w} height={420 - top} fill="rgb(var(--mintc) / 0.16)" stroke="none" />
      {D(`M${x} 420 V${top} H${x + w} V420`)}
      {D(`M${x + w / 3} ${top} V420`, { strokeOpacity: 0.45 })}
      {D(`M${x + (2 * w) / 3} ${top} V420`, { strokeOpacity: 0.45 })}
      {Array.from({ length: Math.floor((420 - top) / 46) }, (_, r) => <g key={r}>{D(`M${x} ${top + 46 * (r + 1)} H${x + w}`, { strokeOpacity: 0.3 })}</g>)}
    </g>
  )
  return (
    <DrawSVG viewBox="0 0 600 500" className={className}>
      <circle className="fade" cx="440" cy="150" r="62" fill="rgb(var(--amber) / 0.4)" stroke="none" />
      {D('M440 88 A62 62 0 1 1 439.9 88', { stroke: 'rgb(var(--amber))', strokeWidth: 2.4 })}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <g key={i}>{D(`M${440 + Math.cos(Math.PI * (0.05 + i * 0.15)) * -84} ${150 - Math.sin(Math.PI * (0.05 + i * 0.15)) * 84} L${440 + Math.cos(Math.PI * (0.05 + i * 0.15)) * -118} ${150 - Math.sin(Math.PI * (0.05 + i * 0.15)) * 118}`, { stroke: 'rgb(var(--amber))', strokeOpacity: 0.6 })}</g>)}
      {tower(70, 110, 190, 0)}
      {tower(210, 130, 90, 1)}
      {tower(370, 100, 250, 2)}
      {D('M20 420 H580')}
      {D('M20 440 H580', { strokeOpacity: 0.3 })}
    </DrawSVG>
  )
}

/** Heritage: three laminated layers, one added by each generation. */
export function HeritageArt({ className = '' }: { className?: string }) {
  const slab = (y: number, i: number) => (
    <g key={i} data-layer>
      <path className="fade" d={`M70 ${y} L300 ${y - 70} L530 ${y} L300 ${y + 70} Z`} fill={`rgb(var(--mintc) / ${0.18 + i * 0.1})`} stroke="none" />
      {D(`M70 ${y} L300 ${y - 70} L530 ${y} L300 ${y + 70} Z`)}
      {D(`M70 ${y} V${y + 26} L300 ${y + 96} L530 ${y + 26} V${y}`)}
      {D(`M300 ${y + 70} V${y + 96}`, { strokeOpacity: 0.5 })}
    </g>
  )
  return (
    <DrawSVG viewBox="0 0 600 460" className={className}>
      {slab(350, 0)}
      {slab(250, 1)}
      {slab(150, 2)}
      {D('M300 80 V20 M284 36 L300 20 L316 36', { stroke: 'rgb(var(--amber))', strokeWidth: 2.2 })}
    </DrawSVG>
  )
}

/** Closing section: a glass arch window, drawn in concentric lines. */
export function ArchArt({ className = '' }: { className?: string }) {
  return (
    <DrawSVG viewBox="0 0 420 520" className={className}>
      <path className="fade" d="M70 480 V210 A140 140 0 0 1 350 210 V480 Z" fill="rgb(var(--mintc) / 0.14)" stroke="none" />
      {D('M70 480 V210 A140 140 0 0 1 350 210 V480 Z', { strokeWidth: 2 })}
      {D('M98 480 V210 A112 112 0 0 1 322 210 V480', { strokeOpacity: 0.7 })}
      {D('M126 480 V210 A84 84 0 0 1 294 210 V480', { strokeOpacity: 0.5 })}
      {D('M210 70 V480', { strokeOpacity: 0.55 })}
      {D('M70 290 H350', { strokeOpacity: 0.55 })}
      {D('M30 480 H390')}
      {D('M150 150 L190 100', { stroke: 'rgb(var(--amber))', strokeWidth: 2.4 })}
      {D('M164 176 L214 112', { stroke: 'rgb(var(--amber))', strokeOpacity: 0.55 })}
    </DrawSVG>
  )
}
