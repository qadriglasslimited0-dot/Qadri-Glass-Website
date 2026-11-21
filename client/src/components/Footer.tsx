import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { COMPANY, NAV } from '../lib/content'
import { useCompany } from '../lib/api'
import Logo from './Logo'

export default function Footer() {
  const C = useCompany()
  return (
    <footer className="theme-deep relative overflow-hidden border-t border-white/10 bg-[rgb(var(--bg))] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -left-[10%] bottom-[-30%] h-[60vmax] w-[60vmax] rounded-full" style={{ background: 'radial-gradient(circle, rgb(var(--mintc) / 0.10), transparent 62%)' }} />
      <div className="wrap relative grid gap-14 pb-14 pt-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo variant="full" tone="white" className="h-auto w-[132px]" />
          <p className="mt-7 max-w-sm text-[15px] leading-relaxed text-white/75">
            Import, supply, fabrication and installation of architectural and decorative glass. Established 1960.
          </p>
          <a href={C.whatsapp} target="_blank" rel="noreferrer" className="btn mt-8 !text-white">
            Chat on WhatsApp <ArrowUpRight size={16} />
          </a>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="eyebrow mb-5">Explore</p>
          <ul className="grid gap-3">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="ulink text-[15px] font-semibold text-white/80 hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <address className="not-italic md:col-span-4">
          <p className="eyebrow mb-5">Visit & contact</p>
          <p className="text-[15px] leading-relaxed text-white/80">
            {C.addressLines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </p>
          <p className="mt-5 grid gap-1.5 text-[15px] font-semibold">
            <a className="ulink w-fit" href={C.phoneHref}>
              {C.phone}
            </a>
            <a className="ulink w-fit break-all" href={`mailto:${C.email}`}>
              {C.email}
            </a>
          </p>
        </address>
      </div>

      <div className="relative border-t border-white/10">
        <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-6 text-sm text-white/65">
          <span>
            © {new Date().getFullYear()} {COMPANY.name} All rights reserved.
          </span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={COMPANY.developerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-[13px] font-bold text-white transition-colors hover:border-[rgb(var(--support))] hover:bg-[rgb(var(--support))] hover:text-[#0d2619]"
            >
              Powered by {COMPANY.developer}
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <Link to="/admin" className="ulink" rel="nofollow">
              Staff login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
