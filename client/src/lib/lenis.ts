import Lenis from 'lenis'
import { gsap, ScrollTrigger, reducedMotion } from './gsap'

let lenis: Lenis | null = null
let tick: ((t: number) => void) | null = null

export function initLenis() {
  if (lenis) return lenis
  lenis = new Lenis({
    lerp: reducedMotion() ? 1 : 0.11,
    wheelMultiplier: 0.95,
    smoothWheel: !reducedMotion(),
    syncTouch: false,
  })
  lenis.on('scroll', ScrollTrigger.update)
  tick = (t) => lenis?.raf(t * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export const getLenis = () => lenis
export const lockScroll = () => lenis?.stop()
export const unlockScroll = () => lenis?.start()

export function scrollToTarget(target: string | number | HTMLElement, offset = 0, immediate = false) {
  if (lenis) lenis.scrollTo(target as never, { offset, immediate, duration: immediate ? 0 : 1.6 })
  else if (typeof target === 'number') window.scrollTo(0, target)
  else if (typeof target === 'string') document.querySelector(target)?.scrollIntoView()
}

export function destroyLenis() {
  if (tick) gsap.ticker.remove(tick)
  lenis?.destroy()
  lenis = null
  tick = null
}
