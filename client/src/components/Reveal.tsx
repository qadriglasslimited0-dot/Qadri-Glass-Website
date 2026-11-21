import { useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { gsap, EASE } from '../lib/gsap'
import { useMotion } from '../hooks/useMotion'

/** Fade-and-rise on entering the viewport. Once, transform + opacity only. */
export function Reveal({
  children,
  className = '',
  as = 'div',
  y = 36,
  delay = 0,
  start = 'top 90%',
  style,
}: {
  children: ReactNode
  className?: string
  as?: ElementType
  y?: number
  delay?: number
  start?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLElement>(null)
  useMotion(ref, ({ reduced }) => {
    const el = ref.current
    if (!el || reduced) return
    gsap.from(el, { opacity: 0, y, duration: 1.15, delay, ease: EASE, scrollTrigger: { trigger: el, start, once: true } })
  })
  const Tag = as
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  )
}

/**
 * Photograph with a curtain reveal and (optionally) gentle parallax.
 *  - `natural`  : the whole photo at its own proportions, nothing cropped.
 *  - otherwise  : fills the frame (give it an aspect via className); `pos` sets the focal point.
 *    With `parallax` the photo is drawn slightly taller than its frame and drifts inside it.
 */
export function MaskImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  natural = false,
  parallax = false,
  pos = 'center',
  curtain = 'rgb(var(--brand))',
  loading = 'lazy',
  onLoad,
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  natural?: boolean
  parallax?: boolean
  pos?: string
  curtain?: string
  loading?: 'lazy' | 'eager'
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useMotion(ref, ({ reduced, desktop }) => {
    const el = ref.current
    if (!el || reduced) return
    const cur = el.querySelector('[data-curtain]')
    const img = el.querySelector('img')
    const par = el.querySelector('[data-par]')
    gsap.fromTo(cur, { yPercent: 0 }, { yPercent: -101, duration: 1.3, ease: EASE, scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
    gsap.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.8, ease: EASE, scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
    if (parallax && desktop && !natural && par) {
      gsap.fromTo(par, { yPercent: -4.5 }, { yPercent: 4.5, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
    }
  })
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {natural ? (
        <img src={src} alt={alt} loading={loading} decoding="async" onLoad={onLoad} className={`block h-auto w-full ${imgClassName}`} />
      ) : (
        <div data-par className={`absolute inset-x-0 ${parallax ? '-top-[6%] h-[112%]' : 'inset-y-0'}`}>
          <img src={src} alt={alt} loading={loading} decoding="async" onLoad={onLoad} style={{ objectPosition: pos }} className={`h-full w-full object-cover ${imgClassName}`} />
        </div>
      )}
      <span data-curtain aria-hidden="true" className="absolute inset-0 z-10" style={{ background: curtain }} />
    </div>
  )
}
