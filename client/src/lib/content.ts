/**
 * Seed / fallback content.
 * Everything here is either verified client-provided copy or is explicitly flagged `draft`/`pending`.
 * Nothing in this file invents certifications, awards, clients, offices, facilities, specs or statistics.
 * The admin dashboard (Supabase) overrides all of it once real content is entered.
 */

export type KV = { k: string; v: string }
export type Service = {
  slug: string
  title: string
  kicker: string
  summary: string
  body: string
  applications: string[]
  process: { t: string; d: string }[]
  draft?: boolean
}
export type Product = {
  slug: string
  name: string
  description: string
  image?: string
  specs: KV[]
  applications: string[]
  related_projects: string[]
  pending?: boolean
}
export type Project = {
  slug: string
  name: string
  location: string
  category: string
  description: string
  applications: string[]
  images: string[]
  details: KV[]
  year?: string
  pending?: boolean
}
export type Certificate = { id: string; title: string; issuer: string; image: string; verified: boolean }

export const COMPANY = {
  name: 'Qadri Glass Pvt. Ltd.',
  short: 'Qadri Glass',
  established: 1960,
  founder: 'Mr. Ghulam M.Q.',
  addressLines: ['278/3 Main Peco Road,', 'Kot Lakhpat, Lahore,', 'Pakistan'],
  address: '278/3 Main Peco Road, Kot Lakhpat, Lahore, Pakistan',
  phone: '0300 8434320',
  phoneHref: 'tel:+923008434320',
  email: 'qadriglasslimited0@gmail.com',
  whatsapp: 'https://wa.me/923008434320',
  developer: 'FRX Technologies',
  // One place to change when the official FRX domain goes live: the footer credit reads this value only.
  developerUrl: 'https://frx-technologies-new-web.vercel.app/',
}

export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Products', to: '/products' },
  { label: 'Projects', to: '/projects' },
  { label: 'Services', to: '/services' },
  { label: 'Quality', to: '/quality' },
  { label: 'Contact', to: '/contact' },
]

export const TIMELINE = [
  {
    mark: '1960',
    title: 'The Foundation',
    text: 'Founded by Mr. Ghulam M.Q. as a modest retail glass business.',
  },
  {
    mark: 'Evolution',
    title: 'The Evolution',
    text: 'Expansion through decades of craftsmanship and family leadership.',
  },
  {
    mark: 'Generations',
    title: 'The Next Generations',
    text: 'Development into a full-service glass business spanning import, supply, fabrication and installation.',
  },
  {
    mark: 'Today',
    title: 'Today',
    text: 'Qadri Glass continues its legacy of serving architectural and decorative glass requirements.',
  },
]

export const STATS = [
  { value: 65, suffix: '+', label: 'Years', sub: 'of craftsmanship' },
  { value: 1000, suffix: '+', label: 'Projects', sub: 'delivered', note: 'Figure as stated by Qadri Glass.' },
  { value: 3, suffix: '', label: 'Generations', sub: 'of leadership' },
]

export const MISSION =
  'We work with glass as a living, endlessly adaptable medium — shaping it into design solutions that are innovative in concept, timeless in form, and exceptional in quality. Every project we undertake is guided by precision engineering, honest craftsmanship, and a standard of service that reflects the trust our clients place in us.'
export const VISION =
  "To be Pakistan's most trusted name in architectural glass, recognized for precision, innovation, and an unwavering commitment to craftsmanship."

export const HERITAGE =
  "Three generations of the Qadri family have shaped this company's story. What began as a single retail counter in 1960 grew, through decades of hands-on craftsmanship, into a full-service glass house — spanning import, supply, fabrication, and installation. Each generation inherited not just a business, but a standard: that the work must speak for itself."

export const SERVICES: Service[] = [
  {
    slug: 'architectural-glass',
    title: 'Architectural Glass',
    kicker: 'Import · Supply',
    summary: 'Glass for the built environment, sourced and supplied to architects, interior designers and developers.',
    body: 'From the first specification to delivery on site, Qadri Glass imports and supplies architectural glass for buildings that rely on light, clarity and structure. Our role is to help the design team choose the right glass and to deliver it with the care it deserves.',
    applications: ['Façades and glazing', 'Interior partitions', 'Doors and windows', 'Balustrades and railings'],
    process: [
      { t: 'Brief', d: 'We listen to the design intent and project constraints.' },
      { t: 'Selection', d: 'Glass is selected against the brief and specification.' },
      { t: 'Sourcing', d: 'Material is imported or supplied and checked on receipt.' },
      { t: 'Delivery', d: 'Coordinated delivery to the project site.' },
    ],
    draft: true,
  },
  {
    slug: 'custom-fabrication',
    title: 'Custom Fabrication',
    kicker: 'Cut · Finish · Process',
    summary: 'Glass cut, finished and processed to the dimensions and details of each project.',
    body: 'Every opening is different. Custom fabrication turns standard sheets into precisely sized, finished components made for a specific project — guided by precision engineering and honest craftsmanship.',
    applications: ['Made-to-size glass panels', 'Finished edges', 'Project-specific components', 'Decorative processing'],
    process: [
      { t: 'Drawings', d: 'Dimensions and details are confirmed from project drawings.' },
      { t: 'Cutting', d: 'Sheets are cut to size with accuracy.' },
      { t: 'Finishing', d: 'Edges and surfaces are finished as specified.' },
      { t: 'Inspection', d: 'Each piece is checked before it leaves for site.' },
    ],
    draft: true,
  },
  {
    slug: 'professional-installation',
    title: 'Professional Installation',
    kicker: 'Fit · Align · Complete',
    summary: 'Careful on-site installation so the finished glass performs and looks as the design intended.',
    body: 'Glass is only as good as the way it is fitted. Our installation service brings the same standard of care from the workshop to the site, so the final result matches the design.',
    applications: ['New construction', 'Renovation and interior fit-out', 'Commercial spaces', 'Residential spaces'],
    process: [
      { t: 'Site check', d: 'Openings and conditions are verified before installation.' },
      { t: 'Preparation', d: 'Frames, supports and fixings are prepared.' },
      { t: 'Installation', d: 'Glass is fitted and aligned by our team.' },
      { t: 'Handover', d: 'Final checks and a clean handover.' },
    ],
    draft: true,
  },
  {
    slug: 'decorative-solutions',
    title: 'Decorative Solutions',
    kicker: 'Texture · Light · Character',
    summary: 'Decorative glass that gives interiors character, privacy and light.',
    body: 'Glass can be more than a window. Decorative solutions bring pattern, finish and presence to interiors — working with designers to realise the atmosphere they have in mind.',
    applications: ['Interior feature walls', 'Privacy and screening', 'Furniture and fittings', 'Feature lighting areas'],
    process: [
      { t: 'Concept', d: 'We explore the look and feel with the designer.' },
      { t: 'Samples', d: 'Finishes and options are reviewed together.' },
      { t: 'Production', d: 'The glass is made to the agreed design.' },
      { t: 'Installation', d: 'Fitted with care in its final position.' },
    ],
    draft: true,
  },
]

export const PRINCIPLES = [
  {
    key: 'precision',
    title: 'Precision Manufacturing',
    text: 'Accurate glass cutting, finishing and processing — because a project is only as good as the dimensions it is built to.',
  },
  {
    key: 'traceability',
    title: 'Material Traceability',
    text: 'A commitment to sourcing raw materials carefully and checking them before they are used.',
  },
  {
    key: 'inspection',
    title: 'In-Process Inspection',
    text: 'Quality checks carried out during processing, not only at the end, so problems are caught early.',
  },
  {
    key: 'standards',
    title: 'Documented Standards',
    text: 'Project specifications and quality processes are documented, so every project can be delivered and reviewed against clear requirements.',
  },
]

export const PROCESS = [
  { n: '01', t: 'Consultation', d: 'We meet to understand the project, the space and the people it serves.' },
  { n: '02', t: 'Requirements', d: 'Glass types, sizes, finishes and quantities are defined.' },
  { n: '03', t: 'Planning', d: 'Specifications and schedule are agreed before work begins.' },
  { n: '04', t: 'Fabrication', d: 'Glass is cut, finished and processed to specification.' },
  { n: '05', t: 'Quality Inspection', d: 'Each order is checked before delivery.' },
  { n: '06', t: 'Installation', d: 'The glass is delivered and installed on site.' },
]

/** Clearly-labelled placeholders. Replaced by verified projects via the admin dashboard. */
export const PROJECTS: Project[] = [1, 2, 3].map((n) => ({
  slug: `project-slot-0${n}`,
  name: `Project Slot 0${n}`,
  location: 'Location to be confirmed',
  category: 'Category to be confirmed',
  description:
    'Placeholder. A genuine Qadri Glass project will be presented here once its details and photography have been supplied and verified by the company.',
  applications: [],
  images: [],
  details: [
    { k: 'Status', v: 'Awaiting verified project information' },
    { k: 'Photography', v: 'Awaiting genuine project photography' },
  ],
  pending: true,
}))

export const PRODUCTS: Product[] = [1, 2, 3].map((n) => ({
  slug: `product-slot-0${n}`,
  name: `Catalogue Entry 0${n}`,
  description:
    'Placeholder. The product catalogue is to be supplied by Qadri Glass. Name, photography, description, technical specifications and applications will appear here.',
  specs: [{ k: 'Specifications', v: 'To be supplied by Qadri Glass' }],
  applications: [],
  related_projects: [],
  pending: true,
}))

export const CERTIFICATES: Certificate[] = []

export const PROJECT_CATEGORIES = [
  'Architectural Glass',
  'Custom Fabrication',
  'Professional Installation',
  'Decorative Solutions',
  'Not sure yet',
]
