import { useRef, type ReactNode } from 'react'
import { TIMELINE } from '../lib/content'
import Split from '../components/Split'
import ScrollPath from '../components/ScrollPath'
import { Reveal } from '../components/Reveal'
import { FoundationGlass, EvolutionGlass, CurtainGlass, TodayGlass } from '../components/glass/StoryGlass'

/**
 * Our story: one continuous line is drawn down the page as you read, passing through each chapter.
 * No pinning and no scroll-jacking: the page scrolls exactly as normal.
 */
export default function Story() {
  const root = useRef<HTMLDivElement>(null)
  const big = 'h-auto w-full'
  const visuals: ReactNode[] = [
    <FoundationGlass key="v1" className={big} />,
    <EvolutionGlass key="v2" className={big} />,
    <CurtainGlass key="v3" className={big} />,
    <TodayGlass key="v4" className="h-auto w-full" />,
  ]

  return (
    <section id="story" data-section="Story" className="relative overflow-hidden bg-ink section">
      <div className="wrap">
        <div className="mb-[clamp(56px,8vw,120px)] max-w-[1100px]">
          <p className="eyebrow mb-6">Our story · since 1960</p>
          <h2 className="display text-[clamp(2.4rem,6.2vw,6.4rem)]">
            <Split text={'Three generations.\nOne standard of _excellence._'} />
          </h2>
        </div>

        <div ref={root} data-chapters className="relative text-[rgb(var(--fg))]">
          <ScrollPath container={root} />
          <ol className="relative z-10 grid gap-y-[clamp(72px,10vw,150px)]">
            {TIMELINE.map((c, i) => {
              const even = i % 2 === 0
              return (
                <li key={c.title} className="grid grid-cols-[44px_1fr] items-center gap-x-5 gap-y-8 md:grid-cols-[1fr_96px_1fr] md:gap-x-10">
                  <div
                    data-node
                    data-on="false"
                    className="group col-start-1 row-start-1 grid h-11 w-11 place-items-center self-start rotate-45 border-2 border-[rgb(var(--brand))] bg-ink transition-[background,transform,box-shadow] duration-500 data-[on=true]:scale-110 data-[on=true]:border-[rgb(var(--support))] data-[on=true]:bg-[rgb(var(--support))] data-[on=true]:shadow-[0_0_0_8px_rgb(var(--support)/0.2)] md:col-start-2 md:mx-auto md:h-14 md:w-14 md:self-center"
                  >
                    <span className="-rotate-45 text-xs font-extrabold tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  </div>

                  <Reveal className={`col-start-2 row-start-1 md:row-start-1 ${even ? 'md:col-start-1 md:text-right' : 'md:col-start-3'}`}>
                    {/^\d+$/.test(c.mark) ? (
                      <>
                        <p className="display text-[clamp(3rem,7.4vw,7.4rem)] text-[rgb(var(--brand))]">{c.mark}</p>
                        <h3 className="mt-3 font-display text-xl font-bold sm:text-2xl">{c.title}</h3>
                      </>
                    ) : (
                      <>
                        <p className={`eyebrow mb-3 !text-azure ${even ? 'md:flex-row-reverse' : ''}`}>{c.mark}</p>
                        <h3 className="display text-[clamp(2.2rem,4.8vw,4.8rem)]">{c.title}</h3>
                      </>
                    )}
                    <p className={`lead mt-3 max-w-[40ch] ${even ? 'md:ml-auto' : ''}`}>{c.text}</p>
                  </Reveal>

                  <Reveal className={`col-start-2 row-start-2 md:row-start-1 ${even ? 'md:col-start-3' : 'md:col-start-1'}`} y={50}>
                    {visuals[i]}
                  </Reveal>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
