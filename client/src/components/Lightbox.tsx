import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { lockScroll, unlockScroll } from '../lib/lenis'

/** Full-screen photo viewer: whole image, any aspect ratio. Esc closes, arrow keys browse. */
export default function Lightbox({ images, index, onClose, onIndex, title }: { images: string[]; index: number; onClose: () => void; onIndex: (i: number) => void; title: string }) {
  const n = images.length
  useEffect(() => {
    lockScroll()
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % n)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + n) % n)
    }
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('keydown', key)
      unlockScroll()
    }
  }, [index, n, onClose, onIndex])

  const arrow = 'absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-lg transition-transform hover:scale-110'
  return (
    <div role="dialog" aria-modal="true" aria-label={`${title} photographs`} className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgb(8_30_20/0.94)] p-4 sm:p-10" onClick={onClose}>
      <button aria-label="Close" onClick={onClose} className="absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-white text-ink shadow-lg transition-transform hover:scale-110 sm:right-8 sm:top-8">
        <X size={20} />
      </button>
      {n > 1 && (
        <>
          <button aria-label="Previous photo" className={`${arrow} left-3 sm:left-8`} onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + n) % n) }}>
            <ChevronLeft size={22} />
          </button>
          <button aria-label="Next photo" className={`${arrow} right-3 sm:right-8`} onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % n) }}>
            <ChevronRight size={22} />
          </button>
        </>
      )}
      <img src={images[index]} alt={`${title} — photograph ${index + 1}`} className="max-h-full max-w-full object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
      {n > 1 && <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-medium text-white/80">{index + 1} / {n}</p>}
    </div>
  )
}
