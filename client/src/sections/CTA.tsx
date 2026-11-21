import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle, Phone, Mail, MapPin } from 'lucide-react'
import { useCompany, useSite } from '../lib/api'
import Split from '../components/Split'
import Magnetic from '../components/Magnetic'
import { Reveal } from '../components/Reveal'
import { ArchArt } from '../components/Graphics'

/** The closing section: a clear next step, the real contact details, and a glass arch drawn in lines. */
export default function CTA() {
  const C = useCompany()
  const { site } = useSite()
  const photo = site['image.cta']
  return (
    <section data-section="Begin" className="theme-deep relative overflow-hidden bg-ink section">
      <div aria-hidden="true" className="pointer-events-none absolute -right-[12%] top-[-20%] h-[70vmax] w-[70vmax] rounded-full" style={{ background: 'radial-gradient(circle, rgb(var(--amber) / 0.16), transparent 60%)' }} />
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-8">Begin a project</p>
          <h2 className="display text-[clamp(2.6rem,7.2vw,7.6rem)]">
            <Split text={"Let's shape\nsomething _extraordinary._"} />
          </h2>
          <Reveal className="mt-12 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link to="/contact" className="btn btn-solid">
                Start an enquiry <ArrowRight size={16} className="arrow" />
              </Link>
            </Magnetic>
            <Magnetic>
              <a href={C.whatsapp} target="_blank" rel="noreferrer" className="btn">
                <MessageCircle size={16} /> WhatsApp us
              </a>
            </Magnetic>
          </Reveal>
          <Reveal className="mt-14 flex flex-wrap gap-x-12 gap-y-7 border-t border-white/15 pt-8 text-[15px]" delay={0.05}>
            <a href={C.phoneHref} className="group flex items-start gap-3">
              <Phone size={18} className="mt-0.5 shrink-0 text-[rgb(var(--amber))]" />
              <span>
                <span className="eyebrow !gap-0 before:hidden">Call</span>
                <span className="mt-1 block font-semibold group-hover:text-[rgb(var(--amber))]">{C.phone}</span>
              </span>
            </a>
            <a href={`mailto:${C.email}`} className="group flex items-start gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-[rgb(var(--amber))]" />
              <span className="min-w-0">
                <span className="eyebrow !gap-0 before:hidden">Email</span>
                <span className="mt-1 block break-all font-semibold group-hover:text-[rgb(var(--amber))] sm:break-normal">{C.email}</span>
              </span>
            </a>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-[rgb(var(--amber))]" />
              <span>
                <span className="eyebrow !gap-0 before:hidden">Visit</span>
                <span className="mt-1 block font-semibold">{C.address}</span>
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-5" y={60}>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[440px]">
            {photo && <img src={photo} alt="" loading="lazy" decoding="async" className="absolute inset-x-[16%] bottom-0 top-[13%] h-[87%] w-[68%] rounded-t-[999px] object-cover" />}
            <ArchArt className="absolute inset-0 h-full w-full text-[rgb(var(--accent))]" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
