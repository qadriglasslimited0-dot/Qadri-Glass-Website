import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation, type Location } from 'react-router-dom'
import { gsap, ScrollTrigger, reducedMotion } from '../lib/gsap'
import { getLenis, scrollToTarget } from '../lib/lenis'
import Logo from './Logo'

/**
 * Glass-curtain page transition. The outgoing page stays mounted until the curtain fully covers it,
 * then the new route mounts (ScrollTriggers of the old page are reverted by their own cleanups),
 * scroll resets, ScrollTrigger refreshes, and the curtain lifts.
 */
export default function RouteTransition({ children }: { children: (loc: Location) => ReactNode }) {
  const location = useLocation()
  const [shown, setShown] = useState(location)
  const curtain = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const first = useRef(true)

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (location.pathname === shown.pathname) {
      setShown(location)
      return
    }
    const resetScroll = () => {
      const l = getLenis()
      if (l) l.scrollTo(0, { immediate: true, force: true })
      window.scrollTo(0, 0)
    }
    if (reducedMotion() || !curtain.current) {
      setShown(location)
      resetScroll()
      requestAnimationFrame(() => ScrollTrigger.refresh())
      return
    }
    busy.current = true
    const el = curtain.current
    const mark = el.querySelector('[data-cmark]')
    gsap.set(el, { display: 'block', yPercent: 100 })
    gsap.set(mark, { opacity: 0, y: 16 })
    const tl = gsap.timeline()
    tl.to(el, { yPercent: 0, duration: 0.75, ease: 'expo.inOut' })
      .to(mark, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.35')
      .add(() => {
        setShown(location)
        resetScroll()
      })
      .add(() => ScrollTrigger.refresh(), '+=0.25')
      .to(mark, { opacity: 0, duration: 0.3 }, '+=0.1')
      .to(el, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.05')
      .set(el, { display: 'none' })
      .add(() => {
        busy.current = false
      })
    return () => {
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  // Hash navigation (same page or after transition)
  useEffect(() => {
    if (!shown.hash) return
    const t = setTimeout(() => scrollToTarget(shown.hash, -20), 120)
    return () => clearTimeout(t)
  }, [shown])

  return (
    <>
      {children(shown)}
      <div
        ref={curtain}
        aria-hidden="true"
        className="theme-dark pointer-events-auto fixed inset-0 z-[9000] hidden bg-ink"
        style={{ background: 'linear-gradient(160deg, rgb(var(--bg3)), rgb(var(--bg)) 70%)' }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-azure/60" />
        <div data-cmark className="grid h-full place-items-center">
          <Logo variant="mark" className="w-24 opacity-90 sm:w-32" alt="" />
        </div>
      </div>
    </>
  )
}
