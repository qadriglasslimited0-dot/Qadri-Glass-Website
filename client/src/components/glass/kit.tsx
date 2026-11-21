import { forwardRef, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/**
 * Glass toolkit used by every large composition on the site.
 *  - <GlassDefs/>  : one hidden SVG holding the shared "world" (a glass city elevation) that glass panes refract.
 *  - <Slab/>       : a real 3D sheet of glass (front, back, four polished edges) built with CSS 3D.
 *  - <WorldCopy/>  : the world seen THROUGH a slab, offset slightly - this is the refraction illusion.
 *  - <Stage/>      : a fixed internal coordinate system that scales to any container width.
 * Everything moves with transform / opacity only, so it stays smooth.
 */

export const WORLD_W = 640
export const WORLD_H = 720

/** Cells of the main tower that "catch the light": [col, row]. */
export const LIT: [number, number][] = [
  [2, 3], [5, 2], [7, 5], [3, 8], [6, 9], [1, 11], [8, 12], [4, 6], [5, 13], [2, 14], [7, 8], [3, 1], [6, 4], [4, 10],
]

export function GlassDefs() {
  const cols = 8
  const rows = 11
  const tx = 150
  const ty = 112
  const tw = 330
  const th = 548
  const cw = tw / cols
  const ch = th / rows
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
      <defs>
        <linearGradient id="qg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F8FAFB" />
          <stop offset="0.55" stopColor="#E4ECF1" />
          <stop offset="1" stopColor="#CBD9E3" />
        </linearGradient>
        <linearGradient id="qg-tower" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#DDE8EF" />
          <stop offset="1" stopColor="#AFC5D4" />
        </linearGradient>
        <linearGradient id="qg-tower2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EEF3F7" />
          <stop offset="1" stopColor="#AAC1D0" />
        </linearGradient>
        <linearGradient id="qg-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CAD9E3" />
          <stop offset="1" stopColor="#F4F7F9" />
        </linearGradient>
        <radialGradient id="qg-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#EAF3F9" stopOpacity="0.55" />
          <stop offset="1" stopColor="#EAF3F9" stopOpacity="0" />
        </radialGradient>
        <clipPath id="qg-arch-clip">
          <path d="M104 690 V245 A221 221 0 0 1 546 245 V690 Z" />
        </clipPath>
        <linearGradient id="qg-arch" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#CFDFEA" />
          <stop offset="0.36" stopColor="#86A9C3" />
          <stop offset="1" stopColor="#35637F" />
        </linearGradient>
        <g id="qg-world">
          <rect width={WORLD_W} height={WORLD_H} fill="url(#qg-sky)" />
          {/* the arch: a window onto the city, in the logo greens */}
          <path d="M104 690 V245 A221 221 0 0 1 546 245 V690 Z" fill="url(#qg-arch)" />
          <g clipPath="url(#qg-arch-clip)">
            <circle cx="470" cy="130" r="150" fill="url(#qg-sun)" />
            {/* low blocks either side */}
            <rect x="112" y="470" width="44" height="220" fill="#F3F7FA" fillOpacity="0.8" />
            <rect x="476" y="420" width="62" height="270" fill="#F3F7FA" fillOpacity="0.8" />
            {Array.from({ length: 5 }, (_, i) => (
              <path key={'bl' + i} d={`M112 ${500 + 38 * i} H156 M476 ${450 + 40 * i} H538`} stroke="#27495E" strokeOpacity="0.2" />
            ))}
            {/* main tower with set-back crown */}
            <rect x={tx + 70} y={ty - 52} width={tw - 140} height="52" fill="url(#qg-tower)" />
            <rect x={tx} y={ty} width={tw} height={th} fill="url(#qg-tower)" />
            {Array.from({ length: cols - 1 }, (_, i) => (
              <path key={'m' + i} d={`M${tx + cw * (i + 1)} ${ty - 52} V${ty + th}`} stroke="#27495E" strokeOpacity="0.22" />
            ))}
            {Array.from({ length: rows - 1 }, (_, i) => (
              <path key={'mh' + i} d={`M${tx} ${ty + ch * (i + 1)} H${tx + tw}`} stroke="#27495E" strokeOpacity="0.2" />
            ))}
            <path d={`M${tx} ${ty} H${tx + tw}`} stroke="#27495E" strokeOpacity="0.5" strokeWidth="1.6" />
            <path d={`M${tx + 70} ${ty - 52} H${tx + tw - 70}`} stroke="#27495E" strokeOpacity="0.45" strokeWidth="1.4" />
            {/* panes catching the sky (animated opacity) */}
            {LIT.map(([c, r], i) => (
              <rect key={i} data-win={i} x={tx + cw * c - cw + 1} y={ty + ch * r - ch + 1} width={cw - 2} height={ch - 2} fill="#7FC0E4" opacity="0.06" />
            ))}
            {/* reflections across the façade */}
            <path d={`M${tx} ${ty + 90} L${tx + 120} ${ty} H${tx + 190} L${tx} ${ty + 230}Z`} fill="#fff" opacity="0.34" />
            <path d={`M${tx + 110} ${ty + th} L${tx + tw} ${ty + 160} V${ty + 270} L${tx + 220} ${ty + th}Z`} fill="#fff" opacity="0.26" />
            <path d={`M${tx + 250} ${ty} H${tx + 305} L${tx + 90} ${ty + th} H${tx + 35}Z`} fill="#fff" opacity="0.16" />
          </g>
          {/* arch outline + ground */}
          <path d="M104 690 V245 A221 221 0 0 1 546 245 V690" stroke="#27495E" strokeOpacity="0.55" strokeWidth="2" fill="none" />
          <rect y="672" width={WORLD_W} height="48" fill="url(#qg-floor)" />
          <path d="M40 690 H600" stroke="#27495E" strokeOpacity="0.4" strokeWidth="1.5" />
        </g>
      </defs>
    </svg>
  )
}

/** The world as seen through glass. dx/dy displace it a little: that offset is the refraction. */
export function WorldCopy({ ox = 0, oy = 0, dx = 0, dy = 0, scale = 1 }: { ox?: number; oy?: number; dx?: number; dy?: number; scale?: number }) {
  return (
    <svg
      data-refract
      data-bx={-ox + dx}
      data-by={-oy + dy}
      aria-hidden="true"
      width={WORLD_W}
      height={WORLD_H}
      viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
      className="slab-inner"
      style={{ transform: `translate(${-ox + dx}px, ${-oy + dy}px) scale(${scale})`, transformOrigin: `${ox}px ${oy}px` }}
    >
      <use href="#qg-world" />
    </svg>
  )
}

type SlabProps = {
  w: number
  h: number
  t?: number
  x?: number
  y?: number
  z?: number
  ry?: number
  rx?: number
  delay?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
  sheen?: boolean
  data?: Record<string, string | number>
}

/** A sheet of glass with real thickness. Front face content (e.g. a WorldCopy) is clipped to the pane. */
export const Slab = forwardRef<HTMLDivElement, SlabProps>(function Slab({ w, h, t = 16, x = 0, y = 0, z = 0, ry = 0, rx = 0, delay = 0, className = '', style, children, sheen = true, data }, ref) {
  const dataAttrs = Object.fromEntries(Object.entries(data ?? {}).map(([k, v]) => [`data-${k}`, v]))
  return (
    <div ref={ref} className={`slab ${className}`} style={{ left: x, top: y, width: w, height: h, transform: `translate3d(0,0,${z}px) rotateY(${ry}deg) rotateX(${rx}deg)`, ...style }} {...dataAttrs}>
      <div className="slab-face slab-back" style={{ transform: `translateZ(${-t / 2}px)` }} />
      <div className="slab-face slab-edge" style={{ width: t, height: h, left: -t / 2, top: 0, transform: 'rotateY(90deg)' }} />
      <div className="slab-face slab-edge" style={{ width: t, height: h, left: w - t / 2, top: 0, transform: 'rotateY(90deg)' }} />
      <div className="slab-face slab-edge slab-edge-h" style={{ width: w, height: t, left: 0, top: -t / 2, transform: 'rotateX(90deg)' }} />
      <div className="slab-face slab-edge slab-edge-h" style={{ width: w, height: t, left: 0, top: h - t / 2, transform: 'rotateX(90deg)' }} />
      <div className="slab-face slab-front" style={{ transform: `translateZ(${t / 2}px)` }}>
        {children}
        <span aria-hidden="true" className="slab-tint" />
        {sheen && <span aria-hidden="true" className="slab-sheen" style={{ ['--d' as string]: `${delay}s` }} />}
      </div>
    </div>
  )
})

/** Fixed internal coordinates (w x h) scaled to the container width, with a shared perspective. */
export function Stage({ w, h, children, className = '', perspective = 1500, style }: { w: number; h: number; children: ReactNode; className?: string; perspective?: number; style?: CSSProperties }) {
  const outer = useRef<HTMLDivElement>(null)
  const [s, setS] = useState(0.6)
  useEffect(() => {
    const el = outer.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setS(e.contentRect.width / w))
    ro.observe(el)
    setS(el.getBoundingClientRect().width / w)
    return () => ro.disconnect()
  }, [w])
  return (
    <div ref={outer} className={`relative w-full ${className}`} style={{ aspectRatio: `${w} / ${h}`, perspective: perspective * s, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transform: `scale(${s})`, transformOrigin: '0 0', transformStyle: 'preserve-3d' }}>{children}</div>
    </div>
  )
}

type BoxProps = { w: number; h: number; d: number; x?: number; y?: number; z?: number; className?: string; style?: CSSProperties; lit?: [number, number, number, number][]; data?: Record<string, string | number> }

/**
 * A glass tower block: lit front, shaded side, roof, with a curtain-wall grid and panes that catch the light.
 * `lit` lists [face(0=front,1=side), left%, top%, size%] of sky-catching panes (animated by the parent via [data-lit]).
 */
export const GlassBox = forwardRef<HTMLDivElement, BoxProps>(function GlassBox({ w, h, d, x = 0, y = 0, z = 0, className = '', style, lit = [], data }, ref) {
  const dataAttrs = Object.fromEntries(Object.entries(data ?? {}).map(([k, v]) => [`data-${k}`, v]))
  const win = (face: number) =>
    lit
      .filter((l) => l[0] === face)
      .map((l, i) => <i key={i} data-lit className="box-lit" style={{ left: `${l[1]}%`, top: `${l[2]}%`, width: `${l[3]}%`, height: `${l[3] * 0.78}%` }} />)
  return (
    <div ref={ref} className={`slab ${className}`} style={{ left: x, top: y, width: w, height: h, transform: `translate3d(0,0,${z}px)`, ...style }} {...dataAttrs}>
      <div className="slab-face box-side" style={{ width: d, height: h, left: -d / 2, top: 0, transform: 'rotateY(-90deg)' }} />
      <div className="slab-face box-side" style={{ width: d, height: h, left: w - d / 2, top: 0, transform: 'rotateY(90deg)' }}>
        {win(1)}
        <span aria-hidden="true" className="slab-sheen" style={{ ['--d' as string]: '2s' }} />
      </div>
      <div className="slab-face box-top" style={{ width: w, height: d, left: 0, top: -d / 2, transform: 'rotateX(90deg)' }} />
      <div className="slab-face box-front" style={{ inset: 0, transform: `translateZ(${d / 2}px)` }}>
        {win(0)}
        <span aria-hidden="true" className="slab-sheen" style={{ ['--d' as string]: '0s' }} />
      </div>
    </div>
  )
})

/** True on phones. Lets heavy decorative layers (refracted copies) be skipped where they cost the most. */
export function useNarrow(max = 767) {
  const q = `(max-width: ${max}px)`
  const [n, setN] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const f = () => setN(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [q])
  return n
}
