import { useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useMotion } from '../hooks/useMotion'

export default function Counter({
  to,
  suffix = '',
  duration = 2.4,
  className,
}: {
  to: number
  suffix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const fmt = (n: number) => Math.round(n).toLocaleString('en-US')

  useMotion(ref, ({ reduced }) => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.textContent = fmt(to) + suffix
      return
    }
    const o = { v: 0 }
    el.textContent = '0' + suffix
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () =>
        gsap.to(o, {
          v: to,
          duration,
          ease: 'power3.out',
          onUpdate: () => {
            el.textContent = fmt(o.v) + suffix
          },
        }),
    })
  }, [to, suffix])

  return (
    <span ref={ref} className={className} aria-label={`${fmt(to)}${suffix}`}>
      {fmt(to)}
      {suffix}
    </span>
  )
}
