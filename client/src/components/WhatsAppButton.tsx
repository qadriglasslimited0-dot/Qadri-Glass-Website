import { useRef } from 'react'
import { gsap, finePointer, reducedMotion, whenReady } from '../lib/gsap'
import { useMotion } from '../hooks/useMotion'
import { useCompany } from '../lib/api'

const Glyph = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" fill="currentColor">
    <path d="M16.04 3C9.4 3 4 8.38 4 15.02c0 2.12.56 4.19 1.62 6.01L4 29l8.13-1.59a12.03 12.03 0 0 0 3.9.65h.01C22.68 28.06 28 22.68 28 16.04 28 9.38 22.7 3 16.04 3Zm0 22.03h-.01a10 10 0 0 1-5.1-1.4l-.37-.22-4.82.94.99-4.7-.24-.38a9.97 9.97 0 0 1-1.54-5.25c0-5.5 4.5-9.98 10.04-9.98 5.52 0 9.96 4.46 9.96 9.98 0 5.52-4.5 10.01-10 10.01Zm5.5-7.5c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.25-.24-.58-.5-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.12 3.23 5.13 4.53.72.3 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
  </svg>
)

/** Floating WhatsApp action: pops in after the preloader, breathes with a soft ripple, wiggles for attention, and expands on hover. */
export default function WhatsAppButton() {
  const C = useCompany()
  const root = useRef<HTMLAnchorElement>(null)
  const href = `${C.whatsapp}?text=${encodeURIComponent('Hello Qadri Glass, I would like to discuss a project.')}`

  useMotion(root, ({ reduced }) => {
    const el = root.current!
    if (reduced) return
    gsap.set(el, { scale: 0, opacity: 0, y: 30 })
    const off = whenReady(() => gsap.to(el, { scale: 1, opacity: 1, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.6)', delay: 1.6 }))

    // magnetic pull on fine pointers
    let cleanup = () => {}
    if (finePointer()) {
      const qx = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.5)' })
      const qy = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.5)' })
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        qx((e.clientX - (r.left + r.width / 2)) * 0.3)
        qy((e.clientY - (r.top + r.height / 2)) * 0.3)
      }
      const leave = () => {
        qx(0)
        qy(0)
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      cleanup = () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    }
    return () => {
      off()
      cleanup()
    }
  })

  return (
    <a
      ref={root}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Qadri Glass on WhatsApp"
      className="wa group fixed bottom-5 right-5 z-[85] flex items-center sm:bottom-8 sm:right-8"
      data-cursor=""
    >
      <span className="wa-label pointer-events-none mr-3 hidden overflow-hidden whitespace-nowrap rounded-full bg-white px-0 py-3 font-wide text-[9px] uppercase tracking-[0.25em] text-ink shadow-lg sm:block">
        <span className="block px-5">Chat with us</span>
      </span>
      <span className="wa-icon relative grid h-14 w-14 place-items-center rounded-full bg-[#1d5c38] ring-4 ring-white text-white shadow-[0_12px_30px_-8px_rgba(29,92,56,0.7)] transition-[transform,background] duration-500 group-hover:scale-110 group-hover:bg-[#25a35a]">
        <span className="wa-ring absolute inset-0 rounded-full" aria-hidden="true" />
        <span className="wa-ring wa-ring-2 absolute inset-0 rounded-full" aria-hidden="true" />
        <span className="wa-glyph relative transition-transform duration-500 group-hover:rotate-[-12deg]">
          <Glyph />
        </span>
      </span>
    </a>
  )
}
