import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { COMPANY, NAV } from '../lib/content'
import { useCompany } from '../lib/api'

export default function Footer() {
  const C = useCompany()
  return (
    <footer className="theme-forest relative overflow-hidden bg-ink">
      <div className="wrap grid gap-14 pb-16 pt-24 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow mb-5">Qadri Glass Pvt. Ltd.</p>
          <p className="max-w-sm text-silver/80">
            Import, supply, fabrication and installation of architectural and decorative glass. Established 1960.
          </p>
          <a
            href={C.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="ulink mt-8 inline-flex items-center gap-2 font-wide text-[10px] uppercase tracking-[0.3em]"
          >
            Chat on WhatsApp <ArrowUpRight size={14} />
          </a>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="eyebrow mb-5">Explore</p>
          <ul className="grid gap-2.5">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="ulink text-silver/80 hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <address className="not-italic md:col-span-4">
          <p className="eyebrow mb-5">Visit & Contact</p>
          <p className="text-silver/80">
            {C.addressLines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </p>
          <p className="mt-5 grid gap-1">
            <a className="ulink w-fit" href={C.phoneHref}>
              {C.phone}
            </a>
            <a className="ulink w-fit" href={`mailto:${C.email}`}>
              {C.email}
            </a>
          </p>
        </address>
      </div>
      <div className="wrap flex flex-wrap items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-mist">
        <span>© {new Date().getFullYear()} {COMPANY.name} All rights reserved.</span>
        <span>
          Website by {COMPANY.developer} ·{' '}
          <Link to="/admin" className="ulink" rel="nofollow">
            Staff login
          </Link>
        </span>
      </div>
    </footer>
  )
}
