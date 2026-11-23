import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function NotFound() {
  return (
    <section className="grid min-h-[100svh] place-items-center bg-ink px-6 text-center">
      <Seo title="Page not found" description="This page could not be found." noindex />
      <div>
        <p className="eyebrow mb-6">Error 404</p>
        <h1 className="display h-lg">
          Clear, <em>but empty.</em>
        </h1>
        <p className="lead mx-auto mt-6 max-w-[40ch]">The page you are looking for does not exist or has moved.</p>
        <Link to="/" className="btn mt-10">Back to home</Link>
      </div>
    </section>
  )
}
