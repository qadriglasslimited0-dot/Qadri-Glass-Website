import { useRef } from 'react'
import { gsap, finePointer } from '../lib/gsap'
import { useMotion } from '../hooks/useMotion'

export type SceneVariant = 'facade' | 'fluted' | 'frame' | 'ring' | 'slab'
type Pane = { x: number; y: number; w: number; h: number; r?: number; d: number; round?: boolean; blur?: boolean; o?: number }

const LAYOUTS: Record<SceneVariant, Pane[]> = {
  facade: [
    { x: 6, y: 8, w: 20, h: 86, r: 0, d: 0.3, blur: true, o: 0.7 },
    { x: 24, y: 2, w: 20, h: 90, r: 0, d: 0.55, o: 0.9 },
    { x: 42, y: 12, w: 20, h: 84, r: 0, d: 0.8, blur: true, o: 0.65 },
    { x: 60, y: 4, w: 20, h: 92, r: 0, d: 1.05, o: 0.85 },
    { x: 78, y: 14, w: 18, h: 80, r: 0, d: 1.3, blur: true, o: 0.6 },
  ],
  fluted: Array.from({ length: 13 }, (_, i) => ({ x: i * 7.6 + 3, y: -4, w: 7, h: 108, d: 0.15 + (i % 4) * 0.12, o: 0.35 + ((i * 5) % 6) * 0.1 })),
  frame: [
    { x: 12, y: 10, w: 76, h: 80, d: 0.25, o: 0.55 },
    { x: 20, y: 18, w: 60, h: 64, d: 0.6, blur: true, o: 0.85 },
    { x: 50, y: 30, w: 34, h: 56, r: -6, d: 1.1, blur: true, o: 0.8 },
  ],
  ring: [
    { x: 14, y: 6, w: 72, h: 72, d: 0.3, round: true, o: 0.5 },
    { x: 26, y: 18, w: 48, h: 48, d: 0.7, round: true, blur: true, o: 0.8 },
    { x: 40, y: 32, w: 26, h: 26, d: 1.2, round: true, blur: true, o: 0.9 },
    { x: 46, y: 56, w: 44, h: 36, r: 0, d: 0.9, o: 0.55 },
  ],
  slab: [
    { x: 8, y: 14, w: 52, h: 66, r: -10, d: 0.4, blur: true, o: 0.7 },
    { x: 26, y: 6, w: 52, h: 72, r: 6, d: 0.85, o: 0.85 },
    { x: 46, y: 22, w: 46, h: 62, r: -3, d: 1.25, blur: true, o: 0.75 },
  ],
}

/**
 * Abstract architectural-glass imagery built from layered translucent panes over a soft green light field.
 * Used wherever a photograph is not yet available — it reads as a visual, never as a fake project photo.
 */
export default function GlassScene({ variant = 'facade', className = '', seed = 0, lite = false }: { variant?: SceneVariant; className?: string; seed?: number; lite?: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const panes = LAYOUTS[variant]

  useMotion(root, ({ reduced }) => {
    const el = root.current!
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-pane]'))
    if (reduced || lite) return
    gsap.from(items, { yPercent: 10, opacity: 0, duration: 1.6, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
    if (!finePointer()) return
    const setters = items.map((p) => ({
      d: parseFloat(p.dataset.depth || '0.5'),
      x: gsap.quickTo(p.firstElementChild as HTMLElement, 'x', { duration: 1.1, ease: 'power3.out' }),
      y: gsap.quickTo(p.firstElementChild as HTMLElement, 'y', { duration: 1.1, ease: 'power3.out' }),
    }))
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5
      setters.forEach((s) => {
        s.x(nx * s.d * 46)
        s.y(ny * s.d * 28)
      })
    }
    const leave = () => setters.forEach((s) => { s.x(0); s.y(0) })
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  })

  const hue = seed % 3
  const base = [
    'radial-gradient(60% 70% at 18% 18%, #e4f7ec, transparent 62%), radial-gradient(55% 60% at 88% 85%, #9fdcbb, transparent 62%), radial-gradient(40% 50% at 72% 12%, #ffffff, transparent 55%), linear-gradient(160deg, #eef9f3, #c9ecd9)',
    'radial-gradient(60% 70% at 80% 20%, #e9f9f0, transparent 60%), radial-gradient(55% 60% at 12% 88%, #86d1ab, transparent 62%), radial-gradient(45% 55% at 40% 40%, #ffffff, transparent 55%), linear-gradient(200deg, #f1faf5, #b9e6cd)',
    'radial-gradient(60% 70% at 30% 80%, #d5f1e2, transparent 62%), radial-gradient(55% 60% at 80% 15%, #b4e5ca, transparent 62%), radial-gradient(40% 50% at 55% 50%, #ffffff, transparent 55%), linear-gradient(120deg, #f3fbf6, #c2e9d3)',
  ][hue]

  return (
    <div ref={root} className={`relative h-full w-full overflow-hidden ${className}`} style={{ background: base }} role="img" aria-label="Abstract glass panels">
      {panes.map((p, i) => (
        <div key={i} data-pane data-depth={p.d} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: `${p.h}%`, transform: p.r ? `rotate(${p.r}deg)` : undefined, zIndex: Math.round(p.d * 10) }}>
          <div
            className="h-full w-full overflow-hidden"
            style={{
              borderRadius: p.round ? '9999px' : 2,
              background: `linear-gradient(135deg, rgba(255,255,255,${Math.min(1, (p.o ?? 0.7) * (p.blur ? 1.1 : 0.95))}), rgba(255,255,255,${(p.o ?? 0.7) * (p.blur ? 0.45 : 0.25)}) 48%, rgba(46,139,87,${0.1 + (i % 3) * 0.05}))`,
              border: '1px solid rgba(255,255,255,0.9)',
              boxShadow: '0 40px 70px -40px rgba(20,90,55,0.55), inset 0 0 0 1px rgba(46,139,87,0.14), inset 0 1px 0 rgba(255,255,255,0.95)',
            }}
          >
          </div>
        </div>
      ))}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/50 to-transparent" aria-hidden="true" />
    </div>
  )
}
