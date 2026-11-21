import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../lib/content'
import GlassPlaceholder from './GlassPlaceholder'
import { MaskImage } from './Reveal'

/**
 * Editorial project card. The photograph is shown whole, at its own proportions (never cropped),
 * with a curtain reveal on entry, a slow zoom and title overlay on hover, and an always-visible arrow
 * so touch screens get the same affordance.
 */
export default function ProjectCard({ p, index, className = '', size = 'md' }: { p: Project; index: number; className?: string; size?: 'md' | 'lg' }) {
  const to = `/projects/${p.slug}`
  const img = p.images[0]
  return (
    <article data-card className={`group ${className}`}>
      <Link to={to} aria-label={`View ${p.name}`} data-cursor="VIEW" className="relative block overflow-hidden bg-[rgb(var(--bg3)/0.6)]">
        {img ? (
          <MaskImage src={img} alt={p.name} natural loading={index < 3 ? 'eager' : 'lazy'} imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.045]" />
        ) : (
          <div className="aspect-[4/5]">
            <GlassPlaceholder index={index} label={p.pending ? 'Photography pending' : p.name} />
          </div>
        )}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#14452c]/85 via-[#14452c]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="pointer-events-none absolute bottom-4 left-5 z-20 translate-y-3 text-sm font-bold text-[#ffffff] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          View project
        </span>
        <span className="absolute bottom-3 right-3 z-20 grid h-12 w-12 place-items-center rounded-full bg-[#ffffff] text-[#0d2619] shadow-lg transition-all duration-500 group-hover:bg-[rgb(var(--support))] group-hover:rotate-45">
          <ArrowUpRight size={18} />
        </span>
        <span className="absolute left-0 top-0 z-20 bg-[rgb(var(--support))] px-3.5 py-2 font-display text-sm font-extrabold tabular-nums text-[#0d2619]">{String(index + 1).padStart(2, '0')}</span>
      </Link>

      <div className="mt-5">
        <p className="eyebrow !text-azure before:hidden">{p.category}</p>
        <h3 className={`display mt-2 ${size === 'lg' ? 'text-[clamp(1.9rem,3.6vw,3.6rem)]' : 'text-[clamp(1.5rem,2.5vw,2.5rem)]'}`}>
          <Link to={to} className="transition-colors hover:text-[rgb(var(--accent))]">{p.name}</Link>
        </h3>
        <p className="mt-2 text-[15px] text-mist">
          {p.location}
          {p.year ? ` · ${p.year}` : ''}
        </p>
      </div>
    </article>
  )
}
