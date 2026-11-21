export type FieldType = 'text' | 'textarea' | 'lines' | 'kv' | 'steps' | 'image' | 'images' | 'bool' | 'number' | 'select'
export type Field = { key: string; label: string; type: FieldType; options?: string[]; help?: string; required?: boolean }
export type Resource = {
  key: string
  table: string
  label: string
  titleKey: string
  fields: Field[]
  defaults: Record<string, unknown>
  bucketFolder: string
}

const pub: Field = { key: 'published', label: 'Published (visible on website)', type: 'bool' }
const sort: Field = { key: 'sort', label: 'Sort order (lowest first)', type: 'number' }

export const RESOURCES: Resource[] = [
  {
    key: 'projects',
    table: 'projects',
    label: 'Projects',
    titleKey: 'name',
    bucketFolder: 'projects',
    defaults: { published: false, sort: 0, applications: [], images: [], details: [] },
    fields: [
      { key: 'name', label: 'Project name', type: 'text', required: true },
      { key: 'slug', label: 'URL slug (e.g. my-project)', type: 'text', required: true },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'year', label: 'Year', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'applications', label: 'Glass applications (one per line)', type: 'lines' },
      { key: 'images', label: 'Photography (first image is the hero)', type: 'images', help: 'Only genuine Qadri Glass project photography.' },
      { key: 'details', label: 'Technical details (Label: value, one per line)', type: 'kv' },
      pub,
      sort,
    ],
  },
  {
    key: 'products',
    table: 'products',
    label: 'Products',
    titleKey: 'name',
    bucketFolder: 'products',
    defaults: { published: false, sort: 0, specs: [], applications: [], related_projects: [] },
    fields: [
      { key: 'name', label: 'Product name', type: 'text', required: true },
      { key: 'slug', label: 'URL slug', type: 'text', required: true },
      { key: 'image', label: 'Product photography', type: 'image' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'specs', label: 'Technical specifications (Label: value, one per line)', type: 'kv' },
      { key: 'applications', label: 'Applications (one per line)', type: 'lines' },
      { key: 'related_projects', label: 'Related project slugs (one per line)', type: 'lines' },
      pub,
      sort,
    ],
  },
  {
    key: 'services',
    table: 'services',
    label: 'Services',
    titleKey: 'title',
    bucketFolder: 'services',
    defaults: { published: true, sort: 0, applications: [], process: [] },
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'URL slug', type: 'text', required: true },
      { key: 'kicker', label: 'Kicker (short tagline)', type: 'text' },
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'body', label: 'Description', type: 'textarea' },
      { key: 'applications', label: 'Applications (one per line)', type: 'lines' },
      { key: 'process', label: 'Process steps (Title | description, one per line)', type: 'steps' },
      pub,
      sort,
    ],
  },
  {
    key: 'certificates',
    table: 'certificates',
    label: 'Certificates',
    titleKey: 'title',
    bucketFolder: 'certificates',
    defaults: { verified: false, sort: 0 },
    fields: [
      { key: 'title', label: 'Certificate title', type: 'text', required: true },
      { key: 'issuer', label: 'Issuing body', type: 'text' },
      { key: 'image', label: 'Scan / image of the actual certificate', type: 'image' },
      { key: 'verified', label: 'Verified — show on website', type: 'bool', help: 'Only tick once the document has been checked as genuine.' },
      sort,
    ],
  },
  {
    key: 'reviews',
    table: 'reviews',
    label: 'Reviews',
    titleKey: 'name',
    bucketFolder: 'reviews',
    defaults: { rating: 5, status: 'pending' },
    fields: [
      { key: 'status', label: 'Status (only "approved" reviews appear on the website)', type: 'select', options: ['pending', 'approved', 'rejected'], required: true },
      { key: 'name', label: 'Reviewer name', type: 'text', required: true },
      { key: 'company', label: 'Company', type: 'text' },
      { key: 'rating', label: 'Rating (1-5)', type: 'number', required: true },
      { key: 'message', label: 'Review', type: 'textarea', required: true },
    ],
  },
  {
    key: 'site_content',
    table: 'site_content',
    label: 'Website content',
    titleKey: 'key',
    bucketFolder: 'content',
    defaults: {},
    fields: [
      { key: 'key', label: 'Key', type: 'select', options: ['mission', 'vision', 'heritage','company.phone', 'company.phoneHref', 'company.email', 'company.address', 'company.whatsapp'], required: true },
      { key: 'value', label: 'Value', type: 'textarea', required: true },
    ],
  },
]

// ---- (de)serialisation between DB values and editor text ----
export const toText = (f: Field, v: unknown): string => {
  if (v == null) return ''
  if (f.type === 'lines') return (v as string[]).join('\n')
  if (f.type === 'kv') return (v as { k: string; v: string }[]).map((x) => `${x.k}: ${x.v}`).join('\n')
  if (f.type === 'steps') return (v as { t: string; d: string }[]).map((x) => `${x.t} | ${x.d}`).join('\n')
  return String(v)
}
export const fromText = (f: Field, s: string): unknown => {
  const lines = s.split('\n').map((l) => l.trim()).filter(Boolean)
  if (f.type === 'lines') return lines
  if (f.type === 'kv')
    return lines.map((l) => {
      const i = l.indexOf(':')
      return i < 0 ? { k: l, v: '' } : { k: l.slice(0, i).trim(), v: l.slice(i + 1).trim() }
    })
  if (f.type === 'steps')
    return lines.map((l) => {
      const i = l.indexOf('|')
      return i < 0 ? { t: l, d: '' } : { t: l.slice(0, i).trim(), d: l.slice(i + 1).trim() }
    })
  return s
}
