import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useSite } from '../lib/api'
import { SERVICE_ART } from '../components/Art'
import ServiceVisual from '../components/ServiceVisual'
import Split from '../components/Split'

/** Interactive services index: titles on the left, the active service's animated diagram on the right. */
export default function ServicesList() {
  const { services } = useSite()
  const [active, setActive] = useState(0)
  const cur = services[active]
  const Art = SERVICE_ART[cur.slug as keyof typeof SERVICE_ART]

  return (
    <section data-section="Services" className="relative bg-coal section">
      <div className="wrap">
        <p className="eyebrow mb-5">What we do</p>
        <h2 className="display h-lg max-w-[14ch]">
          <Split text={'Four ways we work _with glass._'} />
        </h2>

        <div className="mt-[clamp(40px,7vw,110px)] grid gap-10 lg:grid-cols-12">
          <ul className="lg:col-span-7" role="list">
            {services.map((s, i) => {
              const open = i === active
              const A = SERVICE_ART[s.slug as keyof typeof SERVICE_ART]
              return (
                <li key={s.slug} className="border-t border-white/10 last:border-b" onMouseEnter={() => window.matchMedia('(hover:hover)').matches && setActive(i)}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-expanded={open}
                    className="group flex w-full items-baseline gap-5 py-6 text-left sm:gap-8 sm:py-8"
                  >
                    <span className="font-wide text-[10px] tracking-[0.3em] text-azure">0{i + 1}</span>
                    <span className={`flex-1 text-[clamp(1.5rem,3vw,3rem)] font-extralight uppercase leading-none tracking-tight transition-all duration-700 ease-out ${open ? 'translate-x-3 text-white' : 'text-silver/45 group-hover:text-silver'}`}>
                      {s.title}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-6 pb-9 pl-0 sm:pl-14 md:grid-cols-5">
                          <div className="md:col-span-5 lg:col-span-5">
                            <p className="lead max-w-[46ch]">{s.summary}</p>
                            <Link to={`/services/${s.slug}`} className="ulink mt-6 inline-flex items-center gap-2 font-wide text-[10px] uppercase tracking-[0.3em]" data-cursor="">
                              Explore service <ArrowUpRight size={14} />
                            </Link>
                          </div>
                          {A && <A className="mt-2 w-full max-w-md lg:hidden" />}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>

          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="glass sticky top-28 aspect-[4/3] overflow-hidden">
              <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(70% 60% at 30% 20%, rgb(var(--accent) / 0.16), transparent 70%)' }} />
              <AnimatePresence mode="wait">
                <motion.div key={cur.slug} className="relative h-full w-full" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: 0.5 }}>
                  <ServiceVisual slug={cur.slug} alt={cur.title} />
                </motion.div>
              </AnimatePresence>
              <p className="eyebrow absolute bottom-4 left-6">{cur.kicker}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
