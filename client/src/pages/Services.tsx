import { useSite } from '../lib/api'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'
import ServiceBlock from '../components/ServiceBlock'
import CTA from '../sections/CTA'

export default function Services() {
  const { services } = useSite()
  return (
    <>
      <Seo title="Services" description="Architectural Glass, Custom Fabrication, Professional Installation and Decorative Solutions from Qadri Glass, Lahore." path="/services" />
      <PageHeader eyebrow="Services" title={'Four disciplines.\n_One_ standard.'} intro="Architectural glass, custom fabrication, professional installation and decorative solutions — each carried out with the same precision and care." />
      {services.map((s, i) => (
        <ServiceBlock key={s.slug} s={s} index={i} />
      ))}
      <CTA />
    </>
  )
}
