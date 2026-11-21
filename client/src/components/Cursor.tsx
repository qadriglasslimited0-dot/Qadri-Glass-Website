import { useEffect, useRef } from 'react'
import { gsap, finePointer, reducedMotion } from '../lib/gsap'

/**
 * Custom cursor. Elements opt in with data-cursor="LABEL". Links/buttons get a subtle ring.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!finePointer()) return
    const d = dot.current!
    const r = ring.current!
    document.body.classList.add('has-cursor')
    const dx = gsap.quickTo(d, 'x', { duration: 0.08, ease: 'none' })
    const dy = gsap.quickTo(d, 'y', { duration: 0.08, ease: 'none' })
    const rx = gsap.quickTo(r, 'x', { duration: reducedMotion() ? 0.01 : 0.55, ease: 'power3.out' })
    const ry = gsap.quickTo(r, 'y', { duration: reducedMotion() ? 0.01 : 0.55, ease: 'power3.out' })

    const move = (e: PointerEvent) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null
      const labelled = t?.closest?.('[data-cursor]') as HTMLElement | null
      const link = t?.closest?.('a,button,[role="button"],input,select,textarea,summary')
      if (labelled) {
        r.textContent = labelled.dataset.cursor ?? ''
        r.classList.add('is-active')
        r.classList.remove('is-link')
      } else {
        r.textContent = ''
        r.classList.remove('is-active')
        r.classList.toggle('is-link', Boolean(link))
      }
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.body.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
