import { useEffect, useState } from 'react'
import { scrollToTarget } from '../lib/lenis'

/** Active-section indicator for long pages. Reads [data-section] markers. */
export default function SectionDots() {
  const [items, setItems] = useState<{ el: HTMLElement; label: string }[]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    const collect = () =>
      setItems(Array.from(document.querySelectorAll<HTMLElement>('[data-section]')).map((el) => ({ el, label: el.dataset.section ?? '' })))
    const t = setTimeout(collect, 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!items.length) return
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(items.findIndex((i) => i.el === e.target))
        }),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    items.forEach((i) => io.observe(i.el))
    return () => io.disconnect()
  }, [items])

  if (!items.length) return null
  return (
    <nav aria-label="Page sections" className="fixed right-5 top-1/2 z-[70] hidden -translate-y-1/2 xl:block">
      <ul className="grid gap-3">
        {items.map((it, i) => (
          <li key={it.label + i}>
            <button type="button" onClick={() => scrollToTarget(it.el, 0)} aria-label={`Go to ${it.label}`} aria-current={i === active} className="group flex items-center justify-end gap-3">
              <span className={`font-wide text-[8px] uppercase tracking-[0.3em] transition-all duration-500 ${i === active ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-70'}`}>{it.label}</span>
              <span className={`block h-px transition-all duration-500 ${i === active ? 'w-8 bg-azure' : 'w-3 bg-white/40 group-hover:w-6'}`} />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
