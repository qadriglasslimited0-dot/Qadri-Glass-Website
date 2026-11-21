import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, markReady, reducedMotion } from '../lib/gsap'
import { lockScroll, unlockScroll } from '../lib/lenis'

const assetsLoaded = () =>
  Promise.race([
    Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => window.addEventListener('load', r, { once: true })),
    ]),
    new Promise((r) => setTimeout(r, 5000)),
  ])

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    let seen = false
    try {
      seen = sessionStorage.getItem('qg-seen') === '1'
    } catch {
      /* ignore */
    }
    const reduced = reducedMotion()
    let dead = false
    lockScroll()
    const q = gsap.utils.selector(el)
    const counter = q('[data-count]')[0] as HTMLElement
    const bar = q('[data-bar]')[0]
    const p = { v: 0 }
    const render = () => {
      counter.textContent = String(Math.round(p.v)).padStart(3, '0')
      gsap.set(bar, { scaleX: p.v / 100 })
    }

    const finish = () => {
      try {
        sessionStorage.setItem('qg-seen', '1')
      } catch {
        /* ignore */
      }
      unlockScroll()
      setDone(true)
    }

    const ctx = gsap.context(() => {
      const base = reduced ? 0.35 : seen ? 0.9 : 2.3
      gsap.set(q('[data-mark]'), { clipPath: 'inset(0 0 100% 0)' })
      gsap.set(q('[data-word]'), { opacity: 0, y: 14, letterSpacing: '0.7em' })
      gsap.set(q('[data-meta]'), { opacity: 0 })

      const intro = gsap.timeline()
      if (reduced) {
        intro.set(q('[data-mark]'), { clipPath: 'inset(0 0 0% 0)' }).set(q('[data-word],[data-meta]'), { opacity: 1, y: 0, letterSpacing: '0.42em' })
      } else {
        intro
          .to(q('[data-meta]'), { opacity: 1, duration: 0.8 }, 0.1)
          .to(q('[data-mark]'), { clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'expo.inOut' }, 0.2)
          .fromTo(q('[data-sheen]'), { backgroundPosition: '220% 0' }, { backgroundPosition: '-120% 0', duration: 1.8, ease: 'power2.inOut' }, 0.9)
          .to(q('[data-word]'), { opacity: 1, y: 0, letterSpacing: '0.42em', duration: 1.4, ease: 'expo.out' }, 0.9)
      }

      const count = gsap.to(p, { v: 92, duration: base, ease: 'power2.inOut', onUpdate: render })

      Promise.all([assetsLoaded(), new Promise((r) => setTimeout(r, base * 1000))]).then(() => {
        if (dead) return
        count.kill()
        const out = gsap.timeline({ onComplete: finish })
        out
          .to(p, { v: 100, duration: 0.45, ease: 'power2.out', onUpdate: render })
          .add(() => markReady(), reduced ? 0.2 : 0.75)
          .to(q('[data-stage]'), { opacity: 0, scale: reduced ? 1 : 1.06, duration: 0.7, ease: 'power2.in' }, '+=0.1')
        if (reduced) {
          out.to(el, { opacity: 0, duration: 0.4 }, '>')
        } else {
          out
            .to(q('[data-top]'), { yPercent: -100, duration: 1.25, ease: 'expo.inOut' }, '>-0.25')
            .to(q('[data-bottom]'), { yPercent: 100, duration: 1.25, ease: 'expo.inOut' }, '<')
        }
      })
    }, el)
    return () => {
      dead = true
      ctx.revert()
    }
  }, [])

  if (done) return null
  return (
    <div ref={root} className="theme-dark fixed inset-0 z-[10000] overflow-hidden" aria-label="Loading Qadri Glass" role="status">
      <div data-top className="absolute inset-x-0 top-0 h-1/2 bg-ink" />
      <div data-bottom className="absolute inset-x-0 bottom-0 h-1/2 bg-ink" />
      <div data-stage className="absolute inset-0 grid place-items-center">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(60% 50% at 50% 48%, rgb(var(--accent) / 0.14), transparent 70%)' }}
        />
        <div className="relative flex flex-col items-center px-6">
          <div className="relative w-[min(58vw,300px)]" data-mark>
            <img src="/brand/qadri-mark-color.png" alt="" width={667} height={376} className="w-full" />
            <div
              data-sheen
              className="absolute inset-0"
              style={{
                WebkitMaskImage: 'url(/brand/qadri-mark-color.png)',
                maskImage: 'url(/brand/qadri-mark-color.png)',
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                background: 'linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.95) 50%, transparent 62%) 220% 0 / 220% 100% no-repeat',
              }}
            />
          </div>
          <p data-word className="mt-9 font-wide text-[clamp(11px,2.4vw,15px)] uppercase tracking-ultra text-white">
            Qadri Glass
          </p>
        </div>
        <div data-meta className="absolute inset-x-0 bottom-0 flex items-end justify-between px-[var(--gutter)] pb-8">
          <span data-count className="font-wide text-[11px] tracking-[0.3em] text-mist tabular-nums">000</span>
          <span className="eyebrow">Est. 1960</span>
        </div>
        <div data-meta className="absolute inset-x-[var(--gutter)] bottom-0 h-px bg-white/10">
          <div data-bar className="h-full origin-left bg-azure" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>
    </div>
  )
}
