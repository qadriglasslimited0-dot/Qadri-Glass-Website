import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { useCompany, useSite } from '../lib/api'
import Split from '../components/Split'
import Magnetic from '../components/Magnetic'
import GlassScene from '../components/GlassScene'

export default function CTA() {
  const C = useCompany()
  const { site } = useSite()
  return (
    <section data-section="Begin" className="relative overflow-hidden bg-ink section">
      <div className="wrap grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-8">Begin a project</p>
          <h2 className="display text-[clamp(2.4rem,5.6vw,6.2rem)]">
            <Split text={"LET'S SHAPE\nSOMETHING _EXTRAORDINARY._"} />
          </h2>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link to="/contact" className="btn btn-solid">
                Start an enquiry <ArrowRight size={14} className="arrow" />
              </Link>
            </Magnetic>
            <Magnetic>
              <a href={C.whatsapp} target="_blank" rel="noreferrer" className="btn">
                <MessageCircle size={14} /> WhatsApp
              </a>
            </Magnetic>
          </div>
        </div>
        <div className="aspect-[4/5] shadow-[0_50px_100px_-50px_rgba(29,92,56,0.5)] lg:col-span-5">
          {site['image.cta'] ? <img src={site['image.cta']} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" /> : <GlassScene variant="facade" seed={2} />}
        </div>
      </div>
    </section>
  )
}
