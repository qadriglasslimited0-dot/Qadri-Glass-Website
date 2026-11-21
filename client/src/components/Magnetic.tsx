import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, finePointer, reducedMotion } from '../lib/gsap'

/** Wraps a child and pulls it gently toward the pointer. Disabled on touch + reduced motion. */
export default function Magnetic({
  children,
  strength = 0.32,
  className = '',
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !finePointer() || reducedMotion()) return
    const qx = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.5)' })
    const qy = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.5)' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      qx((e.clientX - (r.left + r.width / 2)) * strength)
      qy((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      qx(0)
      qy(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.set(el, { clearProps: 'transform' })
    }
  }, [strength])

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  )
}
