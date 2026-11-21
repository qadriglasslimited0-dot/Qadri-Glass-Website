import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/gsap'

/**
 * An illustrated face whose expression morphs smoothly between ratings.
 * 0 = waiting, 1 = disappointed, 2 = unhappy, 3 = neutral, 4 = happy, 5 = delighted.
 * All numbers are tweened on one proxy object and written to the SVG each frame (no React re-render).
 */
type P = { mouth: number; fill: number; ry: number; ey: number; bo: number; bi: number; tear: number; cheek: number; spark: number; r: number; g: number; b: number }
const PRESETS: P[] = [
  { mouth: 146, fill: 0, ry: 7, ey: 92, bo: 72, bi: 70, tear: 0, cheek: 0, spark: 0, r: 236, g: 245, b: 240 },
  { mouth: 116, fill: 0, ry: 6.5, ey: 94, bo: 82, bi: 66, tear: 1, cheek: 0, spark: 0, r: 192, g: 206, b: 224 },
  { mouth: 128, fill: 0, ry: 7, ey: 93, bo: 77, bi: 68, tear: 0, cheek: 0, spark: 0, r: 210, g: 218, b: 228 },
  { mouth: 144, fill: 0, ry: 7, ey: 92, bo: 72, bi: 72, tear: 0, cheek: 0, spark: 0, r: 238, g: 240, b: 232 },
  { mouth: 168, fill: 0, ry: 7, ey: 91, bo: 68, bi: 66, tear: 0, cheek: 0.7, spark: 0, r: 190, g: 232, b: 208 },
  { mouth: 196, fill: 1, ry: 3.4, ey: 90, bo: 60, bi: 58, tear: 0, cheek: 1, spark: 1, r: 224, g: 249, b: 237 },
]

export default function FaceRating({ value, className = '' }: { value: number; className?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const p = useRef<P>({ ...PRESETS[0] })

  const apply = () => {
    const svg = ref.current
    if (!svg) return
    const s = p.current
    const $ = (sel: string) => svg.querySelector(sel) as SVGElement
    $('[data-face]').setAttribute('fill', `rgb(${s.r | 0} ${s.g | 0} ${s.b | 0})`)
    const m = `M62 142 Q100 ${s.mouth.toFixed(1)} 138 142`
    $('[data-mouth]').setAttribute('d', m)
    $('[data-mouth-fill]').setAttribute('d', `${m} Z`)
    $('[data-mouth-fill]').setAttribute('fill-opacity', String(s.fill))
    ;['[data-eye-l]', '[data-eye-r]'].forEach((k) => {
      const e = $(k)
      e.setAttribute('ry', s.ry.toFixed(2))
      e.setAttribute('cy', s.ey.toFixed(1))
    })
    $('[data-brow-l]').setAttribute('d', `M52 ${s.bo.toFixed(1)} L88 ${s.bi.toFixed(1)}`)
    $('[data-brow-r]').setAttribute('d', `M148 ${s.bo.toFixed(1)} L112 ${s.bi.toFixed(1)}`)
    $('[data-tear]').setAttribute('opacity', String(s.tear))
    svg.querySelectorAll('[data-cheek]').forEach((c) => c.setAttribute('opacity', String(s.cheek * 0.55)))
    svg.querySelectorAll('[data-spark]').forEach((c) => {
      c.setAttribute('opacity', String(s.spark))
      c.setAttribute('transform', `${c.getAttribute('data-at')} scale(${(0.4 + s.spark * 0.6).toFixed(2)})`)
    })
  }

  useEffect(() => {
    const target = PRESETS[Math.max(0, Math.min(5, value))]
    if (reducedMotion()) {
      Object.assign(p.current, target)
      apply()
      return
    }
    const tw = gsap.to(p.current, { ...target, duration: 0.6, ease: 'back.out(1.4)', onUpdate: apply, overwrite: true })
    // a small settle of the whole head each time the expression changes
    const nod = ref.current ? gsap.fromTo(ref.current, { rotation: value % 2 ? -5 : 5, scale: 0.95 }, { rotation: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' }) : null
    return () => {
      tw.kill()
      nod?.kill()
    }
  }, [value])

  // idle: a soft blink every few seconds
  useEffect(() => {
    if (reducedMotion()) return
    const eyes = ref.current?.querySelector('[data-eyes]')
    if (!eyes) return
    const blink = () => {
      gsap.fromTo(eyes, { scaleY: 1 }, { scaleY: 0.1, svgOrigin: '100 92', duration: 0.07, yoyo: true, repeat: 1 })
      call = gsap.delayedCall(2.6 + Math.random() * 2.4, blink)
    }
    let call = gsap.delayedCall(2.2, blink)
    return () => {
      call.kill()
    }
  }, [])

  const spark = 'M0 -9 L2.4 -2.4 L9 0 L2.4 2.4 L0 9 L-2.4 2.4 L-9 0 L-2.4 -2.4 Z'
  return (
    <svg ref={ref} viewBox="0 0 200 200" className={className} aria-hidden="true">
      <circle data-face cx="100" cy="100" r="84" fill="rgb(236 245 240)" stroke="#0d2619" strokeWidth="5" />
      <ellipse data-cheek cx="52" cy="122" rx="13" ry="8" fill="#f08a7a" opacity="0" />
      <ellipse data-cheek cx="148" cy="122" rx="13" ry="8" fill="#f08a7a" opacity="0" />
      <path data-brow-l d="M52 72 L88 70" stroke="#0d2619" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path data-brow-r d="M148 72 L112 70" stroke="#0d2619" strokeWidth="5" strokeLinecap="round" fill="none" />
      <g data-eyes>
        <ellipse data-eye-l cx="72" cy="92" rx="8.5" ry="7" fill="#0d2619" />
        <ellipse data-eye-r cx="128" cy="92" rx="8.5" ry="7" fill="#0d2619" />
      </g>
      <ellipse data-tear cx="58" cy="114" rx="4.5" ry="7" fill="#6ec1ff" opacity="0" />
      <path data-mouth-fill d="M62 142 Q100 146 138 142 Z" fill="#0d2619" fillOpacity="0" stroke="none" />
      <path data-mouth d="M62 142 Q100 146 138 142" stroke="#0d2619" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path data-spark data-at="translate(22 54)" d={spark} fill="rgb(129 208 172)" opacity="0" transform="translate(22 54) scale(0.4)" />
      <path data-spark data-at="translate(182 70)" d={spark} fill="rgb(129 208 172)" opacity="0" transform="translate(182 70) scale(0.4)" />
      <path data-spark data-at="translate(164 14)" d={spark} fill="rgb(129 208 172)" opacity="0" transform="translate(164 14) scale(0.4)" />
    </svg>
  )
}
