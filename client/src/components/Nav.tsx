import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { COMPANY, NAV } from '../lib/content'
import { gsap, ScrollTrigger, whenReady } from '../lib/gsap'
import { lockScroll, unlockScroll } from '../lib/lenis'
import { useMotion } from '../hooks/useMotion'
import Logo from './Logo'
import Magnetic from './Magnetic'

export default function Nav() {
  const header = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Reveal after preloader
  useMotion(header, ({ reduced }) => {
    const el = header.current!
    if (reduced) return
    gsap.set(el, { yPercent: -100, opacity: 0 })
    const off = whenReady(() => gsap.to(el, { yPercent: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.25 }))
    return () => off()
  })

  // Scroll: glass bar after threshold, hide on scroll down / show on scroll up, progress line
  useEffect(() => {
    const el = header.current!
    const bar = el.querySelector('[data-progress]') as HTMLElement
    let last = window.scrollY
    let hidden = false
    const onScroll = () => {
      const y = window.scrollY
      el.dataset.scrolled = y > 40 ? 'true' : 'false'
      const goingDown = y > last
      if (Math.abs(y - last) > 6) {
        const shouldHide = goingDown && y > 500
        if (shouldHide !== hidden) {
          hidden = shouldHide
          gsap.to(el, { yPercent: hidden ? -110 : 0, duration: 0.7, ease: 'expo.out', overwrite: 'auto' })
        }
        last = y
      }
      const max = document.documentElement.scrollHeight - window.innerHeight
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  useEffect(() => {
    setOpen(false)
  }, [pathname])
  useEffect(() => {
    if (open) lockScroll()
    else unlockScroll()
    return () => unlockScroll()
  }, [open])
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])
  useEffect(() => {
    ScrollTrigger.refresh()
  }, [open])

  return (
    <>
      <header
        ref={header}
        data-scrolled="false"
        className="theme-dark fixed inset-x-0 top-0 z-[80] transition-[background,backdrop-filter,border-color] duration-500 data-[scrolled=true]:border-b data-[scrolled=true]:border-white/10 data-[scrolled=true]:bg-ink/95"
        style={{ borderBottom: '1px solid transparent' }}
      >
        <div className="wrap flex h-[76px] items-center justify-between">
          <Link to="/" aria-label="Qadri Glass — home" className="relative z-[95] flex items-center gap-3" data-cursor="HOME">
            <Logo variant="mark" className="h-8 w-auto sm:h-9" />
            <span className="hidden font-wide text-[10px] uppercase tracking-[0.34em] sm:block">
              Qadri Glass
              <span className="mt-1 block text-[8px] tracking-[0.5em] text-mist">Est. 1960</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {NAV.filter((n) => n.to !== '/contact').map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `ulink font-wide text-[9px] uppercase tracking-[0.3em] ${isActive ? 'is-active text-white' : 'text-silver/80 hover:text-white'}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="relative z-[95] flex items-center gap-4">
            <Magnetic className="hidden lg:inline-block" strength={0.25}>
              <Link
                to="/contact"
                className="glass glow-azure group flex items-center gap-3 px-6 py-3 font-wide text-[9px] uppercase tracking-[0.3em] transition-colors hover:bg-white hover:text-ink"
              >
                Contact <ArrowUpRight size={14} className="transition-transform duration-500 group-hover:rotate-45" />
              </Link>
            </Magnetic>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/5">
          <div data-progress className="h-full origin-left bg-gradient-to-r from-azure to-white" style={{ transform: 'scaleX(0)' }} />
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="theme-dark fixed inset-0 z-[90] flex flex-col bg-ink/95 px-[var(--gutter)] pb-8 pt-28 lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(70% 45% at 80% 0%, rgb(var(--accent) / 0.18), transparent 70%)' }}
            />
            <nav aria-label="Mobile" className="relative flex flex-1 flex-col justify-center gap-1">
              {NAV.map((n, i) => (
                <div key={n.to} className="overflow-hidden">
                  <motion.div
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 0.9, delay: 0.25 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <NavLink
                      to={n.to}
                      end={n.to === '/'}
                      className={({ isActive }) =>
                        `flex items-baseline gap-4 py-1.5 text-[clamp(2rem,10vw,3.4rem)] font-extralight uppercase leading-[1.05] tracking-tight ${isActive ? 'text-white' : 'text-silver/60'}`
                      }
                    >
                      <span className="font-wide text-[9px] tracking-[0.3em] text-azure">0{i + 1}</span>
                      {n.label}
                    </NavLink>
                  </motion.div>
                </div>
              ))}
            </nav>
            <motion.div
              className="relative grid gap-1 border-t border-white/10 pt-5 text-sm text-silver"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.8 } }}
              exit={{ opacity: 0 }}
            >
              <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              <span className="text-mist">{COMPANY.address}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
