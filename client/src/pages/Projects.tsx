import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useSite } from '../lib/api'
import { useMotion } from '../hooks/useMotion'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'
import ProjectCard from '../components/ProjectCard'
import CTA from '../sections/CTA'

export default function Projects() {
  const { projects } = useSite()
  const root = useRef<HTMLElement>(null)
  const pending = projects.every((p) => p.pending)

  useMotion(
    root,
    ({ reduced }) => {
      if (reduced) return
      gsap.utils.selector(root.current!)('[data-card]').forEach((c) =>
        gsap.from(c, { opacity: 0, y: 36, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 90%', once: true } }),
      )
    },
    [projects.length],
  )

  return (
    <>
      <Seo title="Projects" description="The Qadri Glass portfolio: architectural and decorative glass projects delivered across Pakistan." path="/projects" />
      <PageHeader eyebrow="Portfolio" title={'Projects &\n_spaces._'} intro="A portfolio of genuine Qadri Glass work. Each project includes its location, category, glass applications, photography and technical details." />
      <section ref={root} className="relative bg-coal section">
        <div className="wrap">
          {pending && (
            <div className="glass mb-12 max-w-2xl p-6 text-sm text-silver/80">
              <p className="eyebrow mb-2 !text-azure">Portfolio in preparation</p>
              Verified projects and genuine photography will appear here once supplied by Qadri Glass. No projects or client relationships have been invented — the cards below are labelled placeholders.
            </div>
          )}
          <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} p={p} index={i} featured={i === 0 && projects.length % 2 === 1} />
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  )
}
