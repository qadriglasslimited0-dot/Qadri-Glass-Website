import { useSite } from '../lib/api'
import Seo from '../components/Seo'
import ROUTES from '../lib/seoRoutes.json'
import PageHeader from '../components/PageHeader'
import QualitySection from '../sections/QualitySection'
import ProcessTimeline from '../sections/ProcessTimeline'
import CTA from '../sections/CTA'
import { ShieldCheck } from 'lucide-react'

export default function Quality() {
  const { certificates } = useSite()
  const verified = certificates.filter((c) => c.verified)
  return (
    <>
      <Seo {...ROUTES['/quality']} path="/quality" />
      <PageHeader eyebrow="Quality" title={'Built on\n_precision._'} intro="Four principles guide how Qadri Glass cuts, finishes, inspects and documents its work." />
      <QualitySection heading={false} />
      <section className="bg-ink section">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-4">Certificates</p>
            <h2 className="display h-md">Verified <em>documents</em></h2>
          </div>
          <div className="lg:col-span-8">
            {verified.length === 0 ? (
              <div className="glass flex items-start gap-5 p-8">
                <ShieldCheck className="mt-1 shrink-0 text-azure" />
                <div>
                  <p className="text-lg font-light">No certificates published yet.</p>
                  <p className="mt-2 max-w-[52ch] text-sm text-mist">Certificates appear here only once Qadri Glass has uploaded the actual documents and they have been verified. Nothing is displayed on assumption.</p>
                </div>
              </div>
            ) : (
              <ul className="grid gap-6 sm:grid-cols-2">
                {verified.map((c) => (
                  <li key={c.id} className="glass overflow-hidden">
                    <img src={c.image} alt={c.title} loading="lazy" className="aspect-[3/4] w-full object-cover" />
                    <div className="p-5">
                      <p>{c.title}</p>
                      <p className="eyebrow mt-1">{c.issuer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
      <ProcessTimeline />
      <CTA />
    </>
  )
}
