import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useMotion } from '../hooks/useMotion'

const WORDS = ['Architectural Glass', 'Custom Fabrication', 'Professional Installation', 'Decorative Solutions']

/** Big kinetic type band. Speed and skew respond to scroll velocity. */
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null)
  useMotion(root, ({ reduced }) => {
    if (reduced) return
    const track = root.current!.querySelector('[data-mq]') as HTMLElement
    let x = 0
    let boost = 0
    let halfW = track.scrollWidth / 2
    const ro = new ResizeObserver(() => (halfW = track.scrollWidth / 2))
    ro.observe(track)
    const half = () => halfW
    let on = true
    const io = new IntersectionObserver(([e]) => (on = e.isIntersecting))
    io.observe(root.current!)
    const tick = (_t: number, dt: number) => {
      if (!on) return
      const f = Math.min(3, dt / 16.67) // frame-rate independent
      x -= (0.6 + boost) * f
      boost *= Math.pow(0.92, f)
      if (-x >= half()) x += half()
      gsap.set(track, { x })
    }
    gsap.ticker.add(tick)
    const onScroll = (() => {
      let last = window.scrollY
      return () => {
        const d = Math.abs(window.scrollY - last)
        last = window.scrollY
        boost = Math.min(10, boost + d * 0.05)
      }
    })()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      gsap.ticker.remove(tick)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  })
  const row = (
    <div className="flex shrink-0 items-center">
      {WORDS.map((w, i) => (
        <span key={w} className="flex items-center">
          <span className={`px-8 text-[clamp(2.8rem,8vw,8rem)] font-extrabold uppercase leading-none tracking-tighter ${i % 2 ? 'text-[rgb(var(--accent))]' : ''}`}>{w}</span>
          <span className="h-4 w-4 rotate-45 bg-white" aria-hidden="true" />
        </span>
      ))}
    </div>
  )
  return (
    <div ref={root} className="theme-green overflow-hidden bg-ink py-7 sm:py-9" aria-hidden="true">
      <div data-mq className="flex w-max will-change-transform">
        {row}
        {row}
      </div>
    </div>
  )
}
