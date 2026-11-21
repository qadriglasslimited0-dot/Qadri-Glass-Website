import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Project } from '../lib/content'
import GlassPlaceholder from './GlassPlaceholder'

/**
 * Project card. The photograph is always shown whole — never cropped — at a generous size,
 * centred on a soft frame so portrait, landscape and square photos all look intentional.
 */
export default function ProjectCard({ p, index, featured = false }: { p: Project; index: number; featured?: boolean }) {
  const to = `/projects/${p.slug}`
  const img = p.images[0]
  return (
    <article data-card className={`group ${featured ? 'lg:col-span-2 lg:grid lg:grid-cols-12 lg:items-center lg:gap-14' : ''}`}>
      <Link to={to} aria-label={`View ${p.name}`} className={`relative block bg-[rgb(var(--bg3)/0.55)] ${featured ? 'lg:col-span-7' : ''}`}>
        {img ? (
          <img
            src={img}
            alt={p.name}
            loading={index < 3 ? 'eager' : 'lazy'}
            decoding="async"
            className="mx-auto max-h-[78svh] w-auto max-w-full transition-transform duration-700 ease-out group-hover:scale-[1.015]"
          />
        ) : (
          <div className="aspect-[4/3]">
            <GlassPlaceholder index={index} label={p.pending ? 'Photography pending' : p.name} />
          </div>
        )}
        <span className="absolute left-4 top-4 bg-white px-3 py-1.5 text-xs font-semibold tracking-wider text-ink shadow-sm">{String(index + 1).padStart(2, '0')}</span>
      </Link>

      <div className={featured ? 'mt-7 lg:col-span-5 lg:mt-0' : 'mt-6'}>
        <p className="eyebrow !text-azure">{p.category}</p>
        <h3 className="display mt-3 text-[clamp(1.7rem,3.2vw,3.2rem)]">{p.name}</h3>
        <p className="mt-3 text-base text-mist">
          {p.location}
          {p.year ? ` · ${p.year}` : ''}
        </p>
        {featured && p.description && <p className="lead mt-5 line-clamp-4 max-w-[52ch]">{p.description}</p>}
        <Link to={to} className="btn btn-solid mt-7">
          View project <ArrowRight size={16} className="arrow" />
        </Link>
      </div>
    </article>
  )
}
