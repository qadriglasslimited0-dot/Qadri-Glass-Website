import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useSite } from '../lib/api'
import Split from '../components/Split'
import ProjectCard from '../components/ProjectCard'
import { Reveal } from '../components/Reveal'

/**
 * Selected work: an asymmetrical editorial layout (alternating widths and offsets) built from the real
 * projects. Photographs keep their own proportions, so a portrait photo is never cropped into a landscape box.
 */
const PLACE = [
  'md:col-span-6 md:col-start-1',
  'md:col-span-5 md:col-start-8 md:mt-[14vw]',
  'md:col-span-5 md:col-start-2',
  'md:col-span-6 md:col-start-7 md:mt-[10vw]',
  'md:col-span-6 md:col-start-1',
]

export default function ProjectsGallery() {
  const { projects } = useSite()
  const list = projects.slice(0, 5)

  return (
    <section id="world" data-section="Portfolio" className="relative overflow-hidden bg-ink section">
      {/* a block of the supporting amber behind the first photograph */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 top-[38%] hidden h-[42%] w-[22%] bg-[rgb(var(--amber)/0.9)] md:block" />
      <div className="wrap relative">
        <div className="mb-[clamp(48px,7vw,110px)] flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow mb-6">Portfolio</p>
            <h2 className="display text-[clamp(3rem,9vw,9.4rem)]">
              <Split text="Selected _work_" />
            </h2>
          </div>
          <Reveal className="flex max-w-[36ch] flex-col items-start gap-5">
            <p className="lead">Glass we have supplied and installed, shown in full.</p>
            <Link to="/projects" className="btn">
              All projects <ArrowRight size={16} className="arrow" />
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-x-6 gap-y-16 md:grid-cols-12 md:gap-y-[clamp(48px,6vw,96px)]">
          {list.map((p, i) => (
            <ProjectCard key={p.slug} p={p} index={i} size={i % 2 === 0 ? 'lg' : 'md'} className={PLACE[i % PLACE.length]} />
          ))}
        </div>
      </div>
    </section>
  )
}
