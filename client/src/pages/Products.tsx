import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { useSite } from '../lib/api'
import { useMotion } from '../hooks/useMotion'
import Seo from '../components/Seo'
import ROUTES from '../lib/seoRoutes.json'
import PageHeader from '../components/PageHeader'
import GlassPlaceholder from '../components/GlassPlaceholder'
import CTA from '../sections/CTA'

export default function Products() {
  const { products } = useSite()
  const root = useRef<HTMLElement>(null)
  const pending = products.every((p) => p.pending)

  useMotion(root, ({ reduced }) => {
    if (reduced) return
    gsap.utils.selector(root.current!)('[data-row]').forEach((row) => {
      const img = row.querySelector('[data-img]')
      gsap.fromTo(img, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 78%', once: true } })
      gsap.fromTo(img!.firstElementChild, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.from(row.querySelectorAll('[data-t]'), { opacity: 0, y: 40, stagger: 0.1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 72%', once: true } })
    })
  }, [products.length])

  return (
    <>
      <Seo {...ROUTES['/products']} path="/products" />
      <PageHeader eyebrow="Product catalogue" title={'Glass, in\n_detail._'} intro="Each product is presented with photography, description, technical specifications and applications — and a direct line to our team." />
      <section ref={root} className="bg-coal section">
        <div className="wrap">
          {pending && (
            <div className="glass mb-[clamp(40px,6vw,90px)] max-w-2xl p-6 text-sm text-silver/80">
              <p className="eyebrow mb-2 !text-azure">Catalogue in preparation</p>
              The product catalogue is supplied by Qadri Glass and managed through the admin dashboard. The entries below are labelled placeholders — no product names or specifications have been invented.
            </div>
          )}
          <ul className="grid gap-[clamp(50px,8vw,130px)]">
            {products.map((p, i) => (
              <li key={p.slug} data-row>
                <Link to={`/products/${p.slug}`} data-cursor="VIEW" className={`group grid items-center gap-8 lg:grid-cols-12 ${i % 2 ? 'lg:[&>div:first-child]:order-2' : ''}`}>
                  <div data-img className="relative aspect-[4/3] overflow-hidden lg:col-span-7">
                    <div className="h-[116%] w-full -translate-y-[8%]">
                      {p.image ? <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" /> : <GlassPlaceholder index={i} label="Photography pending" />}
                    </div>
                  </div>
                  <div className="lg:col-span-5">
                    <p data-t className="eyebrow mb-4">0{i + 1} {p.pending ? '· Placeholder' : ''}</p>
                    <h2 data-t className="display h-md">{p.name}</h2>
                    <p data-t className="lead mt-5 max-w-[40ch]">{p.description}</p>
                    <span data-t className="ulink mt-7 inline-flex items-center gap-2 font-wide text-[10px] uppercase tracking-[0.3em]">
                      View product <ArrowUpRight size={14} />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CTA />
    </>
  )
}
