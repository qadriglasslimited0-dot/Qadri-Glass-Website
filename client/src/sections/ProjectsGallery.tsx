import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { useSite } from '../lib/api'
import { useMotion } from '../hooks/useMotion'
import Split from '../components/Split'
import ProjectCard from '../components/ProjectCard'

/**
 * Portfolio on the home page: a plain, readable layout — no pinning, no horizontal scroll-jacking.
 * Photos are shown whole and large; the first project is featured.
 */
export default function ProjectsGallery() {
  const root = useRef<HTMLElement>(null)
  const { projects } = useSite()
  const list = projects.slice(0, 5)

  useMotion(
    root,
    ({ reduced }) => {
      if (reduced) return
      gsap.utils.selector(root.current!)('[data-card]').forEach((c) =>
        gsap.from(c, { opacity: 0, y: 36, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 90%', once: true } }),
      )
    },
    [list.length],
  )

  return (
    <section ref={root} id="world" data-section="Portfolio" className="relative bg-coal section">
      <div className="wrap">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">Portfolio</p>
            <h2 className="display text-[clamp(2.4rem,6vw,5.6rem)]">
              <Split text="Selected _work_" />
            </h2>
          </div>
          <Link to="/projects" className="btn">
            All projects <ArrowRight size={16} className="arrow" />
          </Link>
        </div>

        <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
          {list.map((p, i) => (
            <ProjectCard key={p.slug} p={p} index={i} featured={i === 0} />
          ))}
        </div>
        <p className="mt-14 max-w-[60ch] text-sm text-mist">Projects are added by Qadri Glass with their own photography. Entries marked “photography pending” are placeholders.</p>
      </div>
    </section>
  )
}
