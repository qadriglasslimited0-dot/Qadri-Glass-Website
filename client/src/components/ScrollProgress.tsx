import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

/** Hairline reading-progress bar. One scaleX transform, written on the shared GSAP ticker — no layout work. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = bar.current
    if (!el) return
    let cur = 0
    let max = 1
    const measure = () => (max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    const tick = () => {
      const target = Math.min(1, Math.max(0, window.scrollY / max))
      cur += (target - cur) * 0.2
      if (Math.abs(target - cur) < 0.0004) cur = target
      el.style.transform = `scaleX(${cur})`
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
    }
  }, [])
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[3px]">
      <div ref={bar} className="h-full origin-left bg-azure" style={{ transform: 'scaleX(0)' }} />
    </div>
  )
}
