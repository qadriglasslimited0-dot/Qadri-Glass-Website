import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'
import Story from '../sections/Story'
import Stats from '../sections/Stats'
import MissionVision from '../sections/MissionVision'
import CTA from '../sections/CTA'
import { COMPANY } from '../lib/content'

export default function About() {
  return (
    <>
      <Seo title="About" description="Founded in 1960 by Mr. Ghulam M.Q., Qadri Glass has grown across three generations into a glass business spanning import, supply, fabrication and installation." path="/about" />
      <PageHeader eyebrow="About Qadri Glass" title={'Since 1960,\n_glass_ is our craft.'} intro="What began as a modest retail glass business has grown, across three generations of family leadership, into a business spanning import, supply, fabrication and installation." />
      <Story />
      <Stats />
      <section className="bg-coal section">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-4">Who we serve</p>
            <h2 className="display h-md">Architects, designers &amp; developers</h2>
          </div>
          <div className="grid gap-6 lg:col-span-7 lg:col-start-6">
            <p className="lead">Today, {COMPANY.short} serves architects, interior designers and developers through architectural and decorative glass solutions — from the first conversation to the final installation.</p>
            <dl className="mt-4 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
              {[
                ['Company', COMPANY.name],
                ['Established', String(COMPANY.established)],
                ['Founder', COMPANY.founder],
                ['Location', 'Kot Lakhpat, Lahore, Pakistan'],
              ].map(([k, v]) => (
                <div key={k} className="bg-coal p-6">
                  <dt className="eyebrow mb-2">{k}</dt>
                  <dd className="text-silver">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
      <MissionVision />
      <CTA />
    </>
  )
}
