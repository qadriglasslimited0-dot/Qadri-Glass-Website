import { useEffect, useRef, type RefObject } from 'react'
import { ScrollTrigger } from '../lib/gsap'
import { reducedMotion } from '../lib/gsap'

/**
 * The signature line. One SVG path is generated from the REAL positions of the section's markers
 * ([data-node] elements), so it always passes through them at every screen size. It draws itself as
 * the reader scrolls (stroke-dashoffset, scrubbed by ScrollTrigger on top of Lenis smoothing) and a
 * pen dot rides its tip. Markers light up (data-on="true") as the line reaches them.
 * No pinning: the page always scrolls normally.
 */
export default function ScrollPath({
  container,
  color = 'rgb(var(--amber))',
  width = 3,
  sway = 70,
  track = true,
  start = 'top 72%',
  end = 'bottom 55%',
}: {
  container: RefObject<HTMLElement | null>
  color?: string
  width?: number
  sway?: number
  track?: boolean
  start?: string
  end?: string
}) {
  const svg = useRef<SVGSVGElement>(null)
  const base = useRef<SVGPathElement>(null)
  const line = useRef<SVGPathElement>(null)
  const pen = useRef<SVGGElement>(null)

  useEffect(() => {
    const box = container.current
    const svgEl = svg.current
    const lineEl = line.current
    const baseEl = base.current
    const penEl = pen.current
    if (!box || !svgEl || !lineEl || !baseEl || !penEl) return
    const reduced = reducedMotion()
    let st: ScrollTrigger | null = null
    let fractions: number[] = []
    let nodes: HTMLElement[] = []
    let len = 1

    const build = () => {
      const b = box.getBoundingClientRect()
      nodes = Array.from(box.querySelectorAll<HTMLElement>('[data-node]'))
      if (!nodes.length || b.width < 10) return
      svgEl.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`)
      const pts = nodes.map((n) => {
        const r = n.getBoundingClientRect()
        return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2 }
      })
      // deterministic hand-drawn wobble so the line feels sketched, not plotted
      const wob = (i: number, k: number) => Math.sin(i * 12.9898 + k * 78.233) * 0.5
      let d = `M ${pts[0].x.toFixed(1)} 0 L ${pts[0].x.toFixed(1)} ${(pts[0].y - 40).toFixed(1)}`
      let prev = { x: pts[0].x, y: pts[0].y - 40 }
      pts.forEach((p, i) => {
        const dy = p.y - prev.y
        const dir = i % 2 === 0 ? 1 : -1
        const c1 = { x: prev.x + sway * dir + wob(i, 1) * 40, y: prev.y + dy * 0.5 }
        const c2 = { x: p.x - sway * dir + wob(i, 2) * 40, y: p.y - dy * 0.45 }
        d += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
        prev = p
      })
      const last = pts[pts.length - 1]
      d += ` C ${last.x.toFixed(1)} ${(last.y + 60).toFixed(1)}, ${(last.x + sway).toFixed(1)} ${(b.height - 60).toFixed(1)}, ${last.x.toFixed(1)} ${b.height.toFixed(1)}`
      lineEl.setAttribute('d', d)
      baseEl.setAttribute('d', d)
      len = lineEl.getTotalLength()
      // length-fraction at which the line reaches each marker (nearest sampled point)
      fractions = pts.map((p) => {
        let best = 0
        let bestD = Infinity
        for (let l = 0; l <= len; l += 6) {
          const q = lineEl.getPointAtLength(l)
          const dd = (q.x - p.x) ** 2 + (q.y - p.y) ** 2
          if (dd < bestD) {
            bestD = dd
            best = l
          }
        }
        return best / len
      })
      update(st ? st.progress : reduced ? 1 : 0)
    }

    const update = (p: number) => {
      lineEl.style.strokeDasharray = `${len}`
      lineEl.style.strokeDashoffset = `${len * (1 - p)}`
      const pt = lineEl.getPointAtLength(len * p)
      penEl.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`)
      penEl.style.opacity = p > 0.003 && p < 0.997 ? '1' : '0'
      nodes.forEach((n, i) => {
        const on = p >= (fractions[i] ?? 1) - 0.004
        const v = on ? 'true' : 'false'
        if (n.dataset.on !== v) n.dataset.on = v
      })
    }

    build()
    st = ScrollTrigger.create({
      trigger: box,
      start,
      end,
      scrub: reduced ? false : true,
      onUpdate: (self) => update(self.progress),
    })
    if (reduced) update(1)

    const ro = new ResizeObserver(() => {
      build()
      ScrollTrigger.refresh()
    })
    ro.observe(box)
    // images and fonts shift marker positions after first paint
    const t = window.setTimeout(build, 900)
    const t2 = window.setTimeout(build, 2800)
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(t2)
      ro.disconnect()
      st?.kill()
    }
  }, [container, start, end, sway])

  return (
    <svg ref={svg} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible">
      {track && <path ref={base} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth={width} strokeLinecap="round" strokeDasharray="2 10" />}
      {!track && <path ref={base} fill="none" stroke="none" />}
      <path ref={line} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      <g ref={pen} style={{ opacity: 0 }}>
        <circle r="16" fill={color} opacity="0.18" />
        <circle r="6.5" fill={color} />
      </g>
    </svg>
  )
}
