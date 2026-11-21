import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useSite } from '../lib/api'
import Split from '../components/Split'
import ScrollPath from '../components/ScrollPath'
import { Reveal, MaskImage } from '../components/Reveal'
import { FacadeArt, SERVICE_ART } from '../components/Graphics'

/**
 * What we do. One amber line travels down the whole section, drawing itself as you scroll and
 * stopping at each service. Each service pairs its own illustration with its photograph when one exists.
 * No pinning: normal scrolling throughout.
 */
export default function ServicesStage() {
  const root = useRef<HTMLDivElement>(null)
  const { services, site } = useSite()

  return (
    <section data-section="Services" id="services-home" className="relative overflow-hidden bg-coal section">
      <div className="wrap">
        <div className="mb-[clamp(56px,8vw,120px)] max-w-[1100px]">
          <p className="eyebrow mb-6">What we do</p>
          <h2 className="display text-[clamp(2.4rem,6.2vw,6.4rem)]">
            <Split text={'Four ways we work with _glass._'} />
          </h2>
        </div>

        <div ref={root} className="relative">
          <ScrollPath container={root} width={4} sway={120} />
          <ul className="relative z-10 grid gap-y-[clamp(80px,11vw,170px)]">
            {services.map((s, i) => {
              const flip = i % 2 === 1
              const Art = SERVICE_ART[s.slug] ?? FacadeArt
              const photo = site[`image.service.${s.slug}`]
              const [first, ...rest] = s.title.split(' ')
              return (
                <li key={s.slug} data-hover-draw className="group grid grid-cols-[44px_1fr] items-center gap-x-5 gap-y-8 md:grid-cols-[1fr_80px_1fr] md:gap-x-12">
                  <span
                    data-node
                    data-on="false"
                    className="col-start-1 row-start-1 grid h-11 w-11 place-items-center self-start rounded-full border-2 border-[rgb(var(--brand))] bg-coal text-xs font-extrabold tabular-nums transition-[background,transform,box-shadow,color] duration-500 data-[on=true]:scale-110 data-[on=true]:border-[rgb(var(--support))] data-[on=true]:bg-[rgb(var(--support))] data-[on=true]:shadow-[0_0_0_8px_rgb(var(--support)/0.22)] md:col-start-2 md:mx-auto md:h-[60px] md:w-[60px] md:self-center md:text-sm"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <Reveal className={`col-start-2 row-start-1 ${flip ? 'md:col-start-3' : 'md:col-start-1 md:text-right'}`}>
                    <p className="eyebrow mb-4 before:hidden md:before:block">{s.kicker}</p>
                    <h3 className="display text-[clamp(2.4rem,5.4vw,5.6rem)]">
                      <span className="block">{first}</span>
                      {rest.length > 0 && <span className="block font-light text-[rgb(var(--accent))]">{rest.join(' ')}</span>}
                    </h3>
                    <p className={`lead mt-5 max-w-[42ch] ${flip ? '' : 'md:ml-auto'}`}>{s.summary}</p>
                    {s.applications.length > 0 && (
                      <ul className={`mt-6 flex flex-wrap gap-2 ${flip ? '' : 'md:justify-end'}`}>
                        {s.applications.slice(0, 4).map((a) => (
                          <li key={a} className="rounded-full border border-[rgb(var(--fg)/0.22)] px-3.5 py-1.5 text-[13px] font-semibold text-silver">
                            {a}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link to={`/services/${s.slug}`} className="btn btn-solid mt-8">
                      Explore service <ArrowRight size={16} className="arrow" />
                    </Link>
                  </Reveal>

                  <Reveal className={`col-start-2 row-start-2 md:row-start-1 ${flip ? 'md:col-start-1' : 'md:col-start-3'}`} y={56}>
                    <div className="relative">
                      {photo ? (
                        <>
                          <MaskImage src={photo} alt={s.title} parallax className="aspect-[4/3] w-full shadow-[0_40px_80px_-40px_rgba(13,38,25,0.5)]" />
                          <div className="theme-deep absolute -bottom-6 -left-4 w-[42%] rounded-2xl bg-ink p-4 shadow-xl md:-left-8">
                            <Art className="h-auto w-full text-[rgb(var(--accent))]" />
                          </div>
                        </>
                      ) : (
                        <div className="theme-deep relative aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-[linear-gradient(160deg,#262d2a,#121614)] p-[8%] shadow-[0_40px_80px_-40px_rgba(8,30,20,0.7)]">
                          <div aria-hidden="true" className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgb(255 255 255 / 0.08) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.08) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                          <Art className="relative h-full w-full text-[rgb(var(--accent))] transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
                        </div>
                      )}
                    </div>
                  </Reveal>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
