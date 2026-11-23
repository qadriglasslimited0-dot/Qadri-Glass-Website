import Seo from '../components/Seo'
import ROUTES from '../lib/seoRoutes.json'
import Hero from '../sections/Hero'
import Story from '../sections/Story'
import Stats from '../sections/Stats'
import ServicesStage from '../sections/ServicesStage'
import Marquee from '../components/Marquee'
import ProjectsGallery from '../sections/ProjectsGallery'
import MissionVision from '../sections/MissionVision'
import Reviews from '../sections/Reviews'
import CTA from '../sections/CTA'
import { GlassDefs } from '../components/glass/kit'

export default function Home() {
  return (
    <>
      <Seo {...ROUTES['/']} path="/" />
      <GlassDefs />
      <Hero />
      <Marquee />
      <Story />
      <Stats />
      <ServicesStage />
      <ProjectsGallery />
      <MissionVision />
      <Reviews />
      <CTA />
    </>
  )
}
