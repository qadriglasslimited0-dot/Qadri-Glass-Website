import { useRef, type ReactNode } from 'react'
import { gsap, whenReady } from '../lib/gsap'
import { useMotion } from '../hooks/useMotion'

/**
 * Changing headline word with a smooth typewriter: type, hold, erase, next.
 * Width is reserved by an invisible spacer holding the longest word, so nothing on the page ever moves.
 */
export default function RotatingWord({ words, className = '', hold = 2.1, suffix = '' }: { words: string[]; className?: string; hold?: number; suffix?: ReactNode }) {
  const root = useRef<HTMLSpanElement>(null)
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '')

  useMotion(root, ({ reduced }) => {
    const text = root.current?.querySelector('[data-text]') as HTMLElement | null
    if (!text || reduced) return
    const o = { n: 0 }
    let i = 0
    const render = () => {
      text.textContent = words[i].slice(0, Math.round(o.n))
    }
    const tl = gsap.timeline({ repeat: -1, paused: true })
    words.forEach((w, k) => {
      tl.call(() => {
        i = k
      })
      tl.to(o, { n: w.length, duration: w.length * 0.085, ease: 'none', onUpdate: render })
      tl.to({}, { duration: hold })
      tl.to(o, { n: 0, duration: w.length * 0.04, ease: 'none', onUpdate: render })
      tl.to({}, { duration: 0.25 })
    })
    // start from an empty word once the intro is done; until then show the first word so there is never a blank headline
    const off = whenReady(() => {
      o.n = 0
      render()
      tl.play()
    })
    return () => off()
  })

  return (
    <span ref={root} className={`relative inline-grid align-baseline ${className}`}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {longest}
        {suffix}
        <span className="inline-block w-[0.08em]" />
      </span>
      <span className="col-start-1 row-start-1 whitespace-nowrap" aria-label={words.join(', ')}>
        <span data-text aria-hidden="true">{words[0]}</span>
        <span aria-hidden="true">{suffix}</span>
        <span aria-hidden="true" className="caret ml-[0.04em] inline-block h-[0.78em] w-[0.07em] translate-y-[0.06em] rounded-[1px] bg-current align-baseline" />
      </span>
    </span>
  )
}
