import { useRef, type ReactNode } from 'react'
import { gsap, whenReady } from '../lib/gsap'
import { useMotion } from '../hooks/useMotion'
import Split from './Split'

/** Cinematic sub-page header: kinetic title, drifting glass planes, scroll fade. */
export default function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: string
  intro?: string
  children?: ReactNode
}) {
  const root = useRef<HTMLElement>(null)
  useMotion(root, ({ reduced }) => {
    if (reduced) return
    const q = gsap.utils.selector(root.current!)
    gsap.set(q('[data-in]'), { opacity: 0, y: 20 })
    const off = whenReady(() => gsap.to(q('[data-in]'), { opacity: 1, y: 0, duration: 1.2, stagger: 0.12, delay: 0.5, ease: 'expo.out' }))
    gsap.to(q('[data-copy]'), { opacity: 0, y: -50, ease: 'none', scrollTrigger: { trigger: root.current, start: '60% top', end: 'bottom top', scrub: true } })
    return () => off()
  })
  return (
    <section ref={root} className="theme-dark relative flex min-h-[58svh] flex-col justify-end overflow-hidden bg-ink pb-[clamp(50px,8vw,110px)] pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgb(13 38 25 / 0.07) 1px, transparent 1px), linear-gradient(90deg, rgb(13 38 25 / 0.07) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
      <div aria-hidden="true" className="pointer-events-none absolute -right-[8%] top-[10%] h-[44vmax] w-[44vmax] rounded-full" style={{ background: 'radial-gradient(circle, rgb(var(--amber) / 0.2), transparent 62%)' }} />
      <div aria-hidden="true" className="absolute -right-[2%] bottom-0 hidden h-[78%] w-[22%] -skew-x-6 bg-[linear-gradient(160deg,#1A5A33,#0f3a24)] md:block" />
      <div aria-hidden="true" className="absolute bottom-0 right-[18%] hidden h-[46%] w-[10%] -skew-x-6 border border-[rgb(var(--brand)/0.5)] bg-[rgb(var(--mintc)/0.3)] md:block" />
      <div data-copy className="wrap relative">
        <p data-in className="eyebrow mb-6">{eyebrow}</p>
        <h1 className="display max-w-[18ch] text-[clamp(2.6rem,min(7.2vw,13svh),7.6rem)]">
          <Split text={title} when="ready" delay={0.2} />
        </h1>
        {intro && (
          <p data-in className="lead mt-8 max-w-[52ch]">
            {intro}
          </p>
        )}
        {children && <div data-in className="mt-8">{children}</div>}
      </div>
    </section>
  )
}
