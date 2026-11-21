import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { SEED, SiteDataContext, fetchSiteData, type SiteData } from './lib/api'
import { destroyLenis, initLenis } from './lib/lenis'
import { markReady, ScrollTrigger } from './lib/gsap'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import ScrollProgress from './components/ScrollProgress'
import Nav from './components/Nav'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import RouteTransition from './components/RouteTransition'
import Home from './pages/Home'

const About = lazy(() => import('./pages/About'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const Quality = lazy(() => import('./pages/Quality'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Admin = lazy(() => import('./pages/admin/Admin'))

export default function App() {
  const [data, setData] = useState<SiteData>(SEED)
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    let alive = true
    fetchSiteData().then((d) => alive && setData(d))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (isAdmin) {
      markReady()
      return
    }
    initLenis()
    return () => destroyLenis()
  }, [isAdmin])

  // Warm the page chunks while the browser is idle so route changes are instant.
  useEffect(() => {
    if (isAdmin) return
    const warm = () => {
      void import('./pages/About')
      void import('./pages/Products')
      void import('./pages/Projects')
      void import('./pages/Services')
      void import('./pages/Quality')
      void import('./pages/Contact')
    }
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
    if (w.requestIdleCallback) w.requestIdleCallback(warm, { timeout: 5000 })
    else window.setTimeout(warm, 3000)
  }, [isAdmin])

  // Re-measure pins once fonts and lazy chunks have settled — never during scrolling (that causes jumps).
  useEffect(() => {
    const t1 = window.setTimeout(() => ScrollTrigger.refresh(), 1200)
    const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 3500)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  return (
    <SiteDataContext.Provider value={data}>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[10001] -translate-y-24 bg-white px-4 py-2 text-sm text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      {!isAdmin && <Preloader />}
      {!isAdmin && <Cursor />}
      {!isAdmin && <ScrollProgress />}
      {!isAdmin && <Nav />}
      {!isAdmin && <WhatsAppButton />}
      <RouteTransition>
        {(loc) => (
          <Suspense fallback={<div className="min-h-screen bg-ink" />}>
            <Routes location={loc}>
              <Route path="/admin/*" element={<Admin />} />
              <Route
                path="*"
                element={
                  <>
                    <main id="main" tabIndex={-1} className="outline-none">
                      <Routes location={loc}>
                        <Route index element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="products" element={<Products />} />
                        <Route path="products/:slug" element={<ProductDetail />} />
                        <Route path="projects" element={<Projects />} />
                        <Route path="projects/:slug" element={<ProjectDetail />} />
                        <Route path="services" element={<Services />} />
                        <Route path="services/:slug" element={<ServiceDetail />} />
                        <Route path="quality" element={<Quality />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </>
                }
              />
            </Routes>
          </Suspense>
        )}
      </RouteTransition>
    </SiteDataContext.Provider>
  )
}
