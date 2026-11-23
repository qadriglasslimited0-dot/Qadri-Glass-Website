import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useSite } from '../lib/api'
import Seo, { breadcrumbLd } from '../components/Seo'
import { SITE_URL } from '../lib/site'
import ServiceBlock from '../components/ServiceBlock'
import NotFound from './NotFound'
import CTA from '../sections/CTA'

export default function ServiceDetail() {
  const { slug } = useParams()
  const { services } = useSite()
  const i = services.findIndex((s) => s.slug === slug)
  if (i < 0) return <NotFound />
  const s = services[i]
  const prev = services[(i - 1 + services.length) % services.length]
  const next = services[(i + 1) % services.length]
  return (
    <>
      <Seo
        title={s.title}
        description={s.summary}
        path={`/services/${s.slug}`}
        jsonLd={[
          breadcrumbLd([{ name: 'Services', path: '/services' }, { name: s.title, path: `/services/${s.slug}` }]),
          { '@context': 'https://schema.org', '@type': 'Service', name: s.title, description: s.summary, url: `${SITE_URL}/services/${s.slug}`, provider: { '@type': 'LocalBusiness', name: 'Qadri Glass Pvt. Ltd.', url: SITE_URL } },
        ]}
      />
      <div className="h-24 bg-ink" />
      <ServiceBlock s={s} index={i} detail />
      <nav aria-label="Other services" className="grid border-y border-white/10 bg-coal sm:grid-cols-2">
        <Link to={`/services/${prev.slug}`} data-cursor="PREV" className="group flex items-center gap-4 border-b border-white/10 p-8 sm:border-b-0 sm:border-r">
          <ArrowLeft className="transition-transform duration-500 group-hover:-translate-x-2" />
          <span><span className="eyebrow block">Previous</span><span className="text-xl font-light uppercase">{prev.title}</span></span>
        </Link>
        <Link to={`/services/${next.slug}`} data-cursor="NEXT" className="group flex items-center justify-end gap-4 p-8 text-right">
          <span><span className="eyebrow block">Next</span><span className="text-xl font-light uppercase">{next.title}</span></span>
          <ArrowRight className="transition-transform duration-500 group-hover:translate-x-2" />
        </Link>
      </nav>
      <CTA />
    </>
  )
}
