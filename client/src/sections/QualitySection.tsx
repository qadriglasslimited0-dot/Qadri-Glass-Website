import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PRINCIPLES } from '../lib/content'
import { QUALITY_ART } from '../components/Art'
import Split from '../components/Split'

/** Interactive quality presentation — four principles, each with its own animated diagram. */
export default function QualitySection({ heading = true }: { heading?: boolean }) {
  const [i, setI] = useState(0)
  const cur = PRINCIPLES[i]
  const Art = QUALITY_ART[cur.key as keyof typeof QUALITY_ART]

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') setI((n) => (n + 1) % PRINCIPLES.length)
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') setI((n) => (n - 1 + PRINCIPLES.length) % PRINCIPLES.length)
  }

  return (
    <section data-section="Quality" className="relative bg-coal section">
      <div className="wrap">
        {heading && (
          <>
            <p className="eyebrow mb-5">Quality principles</p>
            <h2 className="display h-lg max-w-[12ch]">
              <Split text={'Built on _precision._'} />
            </h2>
          </>
        )}

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div role="tablist" aria-label="Quality principles" aria-orientation="vertical" className="lg:col-span-5" onKeyDown={onKey}>
            {PRINCIPLES.map((p, n) => (
              <button
                key={p.key}
                role="tab"
                id={`q-tab-${p.key}`}
                aria-selected={n === i}
                aria-controls="q-panel"
                tabIndex={n === i ? 0 : -1}
                onClick={() => setI(n)}
                onMouseEnter={() => window.matchMedia('(hover:hover)').matches && setI(n)}
                className="group relative block w-full border-t border-white/10 py-6 text-left last:border-b"
              >
                <span className="absolute left-0 top-0 h-px bg-azure transition-[width] duration-700 ease-out" style={{ width: n === i ? '100%' : '0%' }} />
                <span className="flex items-baseline gap-5">
                  <span className="font-wide text-[10px] tracking-[0.3em] text-azure">0{n + 1}</span>
                  <span className={`text-[clamp(1.2rem,2vw,1.9rem)] font-light uppercase tracking-tight transition-colors duration-500 ${n === i ? 'text-white' : 'text-silver/50 group-hover:text-silver'}`}>{p.title}</span>
                </span>
              </button>
            ))}
          </div>

          <div id="q-panel" role="tabpanel" aria-labelledby={`q-tab-${cur.key}`} className="lg:col-span-7">
            <div className="glass relative aspect-[4/3] overflow-hidden p-6 sm:p-10">
              <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 60% at 70% 20%, rgb(var(--accent) / 0.14), transparent 70%)' }} />
              <AnimatePresence mode="wait">
                <motion.div key={cur.key} className="relative h-full w-full" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45 }}>
                  <Art className="h-full w-full" />
                </motion.div>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={cur.key} className="lead mt-8 max-w-[56ch]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                {cur.text}
              </motion.p>
            </AnimatePresence>
            <p className="mt-5 text-xs text-mist">Principles as described by Qadri Glass. Detailed procedures to be confirmed with the company before publication.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
