import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useMotion } from '../hooks/useMotion'

const ROW_A = ['Precision in every panel', 'Crafted through generations', 'Designed for architecture']
const ROW_B = ['The art of transparency', 'Built on experience', 'Glass, made to last']

/** A small glass pane used as the separator between phrases. */
function Pane() {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 52" className="mx-8 h-[0.62em] w-auto shrink-0 text-[rgb(var(--support))] sm:mx-12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round">
      <path d="M6 48 L14 6 H38 L30 48 Z" fill="currentColor" fillOpacity="0.22" />
      <path d="M17 38 L22 14" strokeLinecap="round" strokeOpacity="0.7" />
    </svg>
  )
}

/**
 * Two bands of kinetic type moving in opposite directions. Speed rises with scroll velocity.
 * Paused off-screen; frame-rate independent; transform only.
 */
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null)
  useMotion(root, ({ reduced }) => {
    if (reduced) return
    const el = root.current!
    const tracks = Array.from(el.querySelectorAll<HTMLElement>('[data-mq]'))
    const state = tracks.map((t, i) => ({ t, dir: i % 2 === 0 ? -1 : 1, x: 0, half: t.scrollWidth / 2 }))
    state.forEach((s) => {
      if (s.dir > 0) s.x = -s.half
    })
    const ro = new ResizeObserver(() => state.forEach((s) => (s.half = s.t.scrollWidth / 2)))
    state.forEach((s) => ro.observe(s.t))
    let on = true
    const io = new IntersectionObserver(([e]) => (on = e.isIntersecting))
    io.observe(el)
    let boost = 0
    let last = window.scrollY
    const onScroll = () => {
      boost = Math.min(9, boost + Math.abs(window.scrollY - last) * 0.05)
      last = window.scrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const tick = (_t: number, dt: number) => {
      if (!on) return
      const f = Math.min(3, dt / 16.67)
      boost *= Math.pow(0.92, f)
      state.forEach((s) => {
        s.x += s.dir * (0.7 + boost) * f
        if (s.dir < 0 && -s.x >= s.half) s.x += s.half
        if (s.dir > 0 && s.x >= 0) s.x -= s.half
        s.t.style.transform = `translate3d(${s.x.toFixed(2)}px,0,0)`
      })
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  })

  const row = (words: string[], outline: boolean, key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {words.map((w) => (
        <span key={w} className="flex items-center">
          <span
            className="display whitespace-nowrap text-[clamp(2.6rem,7.4vw,7.2rem)] font-extrabold uppercase leading-[1.02]"
            style={outline ? { color: 'transparent', WebkitTextStroke: '1.5px rgb(var(--accent))' } : undefined}
          >
            {w}
          </span>
          <Pane />
        </span>
      ))}
    </div>
  )

  return (
    <div ref={root} className="theme-brand relative overflow-hidden bg-ink py-6 sm:py-9" aria-hidden="true">
      <div data-mq className="flex w-max will-change-transform">
        {row(ROW_A, false, 'a1')}
        {row(ROW_A, false, 'a2')}
      </div>
      <div data-mq className="mt-1 flex w-max will-change-transform sm:mt-3">
        {row(ROW_B, true, 'b1')}
        {row(ROW_B, true, 'b2')}
      </div>
    </div>
  )
}
