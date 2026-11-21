import { Link, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useSite } from '../lib/api'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'
import GlassPlaceholder from '../components/GlassPlaceholder'
import Magnetic from '../components/Magnetic'
import NotFound from './NotFound'
import CTA from '../sections/CTA'

export default function ProductDetail() {
  const { slug } = useParams()
  const { products, projects } = useSite()
  const p = products.find((x) => x.slug === slug)
  if (!p) return <NotFound />
  const related = projects.filter((pr) => p.related_projects.includes(pr.slug))

  return (
    <>
      <Seo title={p.name} description={p.description.slice(0, 155)} path={`/products/${p.slug}`} image={p.image} />
      <PageHeader eyebrow="Product" title={p.name} intro={p.description} />
      <section className="bg-coal section">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="aspect-[4/5] overflow-hidden lg:col-span-6">
            {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-cover" /> : <GlassPlaceholder label="Photography pending" />}
          </div>
          <div className="lg:col-span-6 lg:pl-10">
            <p className="eyebrow mb-5">Technical specifications</p>
            <dl className="border-t border-white/10">
              {p.specs.map((s) => (
                <div key={s.k} className="grid grid-cols-2 gap-4 border-b border-white/10 py-4">
                  <dt className="text-mist">{s.k}</dt>
                  <dd>{s.v}</dd>
                </div>
              ))}
            </dl>
            {p.applications.length > 0 && (
              <>
                <p className="eyebrow mb-4 mt-12">Applications</p>
                <ul className="flex flex-wrap gap-2">
                  {p.applications.map((a) => (
                    <li key={a} className="border border-white/15 px-4 py-2 text-sm text-silver">{a}</li>
                  ))}
                </ul>
              </>
            )}
            {related.length > 0 && (
              <>
                <p className="eyebrow mb-4 mt-12">Related projects</p>
                <ul className="grid gap-2">
                  {related.map((r) => (
                    <li key={r.slug}><Link className="ulink" to={`/projects/${r.slug}`}>{r.name}</Link></li>
                  ))}
                </ul>
              </>
            )}
            <div className="mt-12">
              <Magnetic>
                <Link to={`/contact?product=${encodeURIComponent(p.name)}`} className="btn btn-solid">
                  Enquire about this product <ArrowRight size={14} className="arrow" />
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>
      <CTA />
    </>
  )
}
