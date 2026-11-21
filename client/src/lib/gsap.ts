import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true })
gsap.defaults({ ease: 'power3.out', duration: 1 })

export { gsap, ScrollTrigger }

export const EASE = 'expo.out'
export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/** Shared hero progress (0..1) read by the WebGL hero each frame — avoids React re-renders. */
export const heroState = { progress: 0, mx: 0, my: 0 }

// ---- "ready" gate: hero animation waits for the preloader to finish -------
let ready = false
const waiting = new Set<() => void>()
export const isReady = () => ready
export function markReady() {
  if (ready) return
  ready = true
  waiting.forEach((cb) => cb())
  waiting.clear()
  window.dispatchEvent(new Event('qg:ready'))
}
export function whenReady(cb: () => void) {
  if (ready) cb()
  else waiting.add(cb)
  return () => waiting.delete(cb)
}
