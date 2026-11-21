import { createElement, Fragment, useRef, type ElementType, type ReactNode } from 'react'
import { gsap, whenReady, EASE } from '../lib/gsap'
import { useMotion } from '../hooks/useMotion'

type Props = {
  text: string
  as?: ElementType
  by?: 'word' | 'char'
  className?: string
  /** 'ready' waits for the preloader, 'scroll' triggers on view, 'none' leaves it hidden for manual control */
  when?: 'ready' | 'scroll' | 'none'
  delay?: number
  stagger?: number
  start?: string
}

/** `_text_` toggles the serif-italic accent. `\n` breaks lines. */
function parse(text: string) {
  const lines: { word: string; em: boolean }[][] = []
  let em = false
  text.split('\n').forEach((line) => {
    const words: { word: string; em: boolean }[] = []
    line.split(' ').forEach((raw) => {
      if (!raw) return
      const startsEm = raw.startsWith('_')
      const endsEm = raw.endsWith('_') && raw.length > 1
      if (startsEm) em = true
      const clean = raw.replace(/^_/, '').replace(/_$/, '')
      words.push({ word: clean, em })
      if (endsEm) em = false
    })
    lines.push(words)
  })
  return lines
}

export default function Split({
  text,
  as = 'span',
  by = 'word',
  className,
  when = 'scroll',
  delay = 0,
  stagger,
  start = 'top 88%',
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const lines = parse(text)
  const plain = text.replace(/_/g, '').replace(/\n/g, ' ')

  useMotion(ref, ({ reduced }) => {
    const el = ref.current
    if (!el) return
    const units = el.querySelectorAll('.si')
    if (reduced) {
      gsap.set(units, { yPercent: 0, opacity: 1 })
      return
    }
    gsap.set(units, { yPercent: 115, rotate: by === 'char' ? 4 : 2 })
    if (when === 'none') return
    const tween = gsap.to(units, {
      yPercent: 0,
      rotate: 0,
      duration: by === 'char' ? 1.1 : 1.3,
      ease: EASE,
      stagger: stagger ?? (by === 'char' ? 0.025 : 0.07),
      delay,
      paused: when === 'ready',
      scrollTrigger: when === 'scroll' ? { trigger: el, start, once: true } : undefined,
    })
    if (when === 'ready') {
      const off = whenReady(() => tween.play())
      return () => off()
    }
  })

  const kids: ReactNode[] = []
  lines.forEach((words, li) => {
    words.forEach((w, wi) => {
      const inner =
        by === 'char'
          ? w.word.split('').map((c, ci) => (
              <span className="sw" key={ci} style={{ paddingInline: 0 }}>
                <span className="si">{c}</span>
              </span>
            ))
          : (
              <span className="sw">
                <span className="si">{w.word}</span>
              </span>
            )
      const wrapped = (
        <span key={`${li}-${wi}`} className={`inline-block whitespace-nowrap ${w.em ? 'serif-em' : ''}`} aria-hidden="true">
          {inner}
        </span>
      )
      kids.push(wrapped)
      if (wi < words.length - 1) kids.push(<Fragment key={`s${li}-${wi}`}> </Fragment>)
    })
    if (li < lines.length - 1) kids.push(<br key={`br${li}`} />)
  })

  return createElement(as, { ref, className, 'aria-label': plain }, kids)
}
