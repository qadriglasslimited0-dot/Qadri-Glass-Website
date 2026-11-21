import { useMemo, useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, Check, MapPin, MessageCircle, Paperclip, Phone, Mail, X } from 'lucide-react'
import { PROJECT_CATEGORIES } from '../lib/content'
import { submitEnquiry, useCompany } from '../lib/api'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'
import Magnetic from '../components/Magnetic'

const MAX_FILES = 5
const MAX_MB = 10
const ACCEPT = '.jpg,.jpeg,.png,.webp,.pdf,.dwg,.dxf'

type Values = { name: string; email: string; phone: string; company: string; category: string; message: string }
type Errors = Partial<Record<keyof Values | 'files', string>>

function validate(v: Values, files: File[]): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address.'
  if (v.phone.trim() && !/^[+()\d\s-]{7,20}$/.test(v.phone.trim())) e.phone = 'Please enter a valid phone number.'
  if (v.message.trim().length < 10) e.message = 'Please tell us a little about your project (10+ characters).'
  if (files.length > MAX_FILES) e.files = `Attach up to ${MAX_FILES} files.`
  else if (files.some((f) => f.size > MAX_MB * 1024 * 1024)) e.files = `Each file must be under ${MAX_MB} MB.`
  return e
}

export default function Contact() {
  const COMPANY = useCompany()
  const [params] = useSearchParams()
  const initialMsg = params.get('product') ? `I would like to enquire about: ${params.get('product')}.\n\n` : ''
  const initialCat = PROJECT_CATEGORIES.includes(params.get('category') ?? '') ? (params.get('category') as string) : ''
  const [v, setV] = useState<Values>({ name: '', email: '', phone: '', company: '', category: initialCat, message: initialMsg })
  const [files, setFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [serverMsg, setServerMsg] = useState('')
  const openedAt = useRef(Date.now())
  const honey = useRef<HTMLInputElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const set = (k: keyof Values) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }))
  const wa = useMemo(() => `${COMPANY.whatsapp}?text=${encodeURIComponent('Hello Qadri Glass, I would like to discuss a project.')}`, [])

  const addFiles = (list: FileList | null) => {
    if (!list) return
    setFiles((cur) => [...cur, ...Array.from(list)].slice(0, MAX_FILES + 1))
    if (fileInput.current) fileInput.current.value = ''
  }

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    const errs = validate(v, files)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.querySelector<HTMLElement>('[data-invalid="true"]')?.focus()
      return
    }
    setStatus('sending')
    const fd = new FormData()
    Object.entries(v).forEach(([k, val]) => fd.append(k, val.trim()))
    fd.append('website', honey.current?.value ?? '')
    fd.append('t', String(Date.now() - openedAt.current))
    files.forEach((f) => fd.append('files', f))
    const res = await submitEnquiry(fd)
    if (res.ok) setStatus('ok')
    else {
      setServerMsg(res.message ?? '')
      setStatus('error')
    }
  }

  const err = (k: keyof Errors) => errors[k]

  return (
    <>
      <Seo title="Contact" description="Contact Qadri Glass Pvt. Ltd., 278/3 Main Peco Road, Kot Lakhpat, Lahore. Call 0300 8434320 or send an enquiry." path="/contact" />
      <PageHeader eyebrow="Contact" title={"LET'S SHAPE\nSOMETHING _EXTRAORDINARY._"} />
      <section className="bg-coal section">
        <div className="wrap grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {status === 'ok' ? (
              <div role="status" className="glass p-10 sm:p-14">
                <span className="mb-6 grid h-14 w-14 place-items-center rounded-full border border-mint/60 text-mint"><Check /></span>
                <h2 className="display h-md">Thank you, <em>{v.name.split(' ')[0]}.</em></h2>
                <p className="lead mt-5 max-w-[46ch]">Your enquiry has been received. The Qadri Glass team will get back to you shortly. For anything urgent, call {COMPANY.phone} or message us on WhatsApp.</p>
                <a href={wa} target="_blank" rel="noreferrer" className="btn mt-8"><MessageCircle size={14} /> Continue on WhatsApp</a>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid gap-x-10 gap-y-9 sm:grid-cols-2" aria-describedby={status === 'error' ? 'form-error' : undefined}>
                <div className="field">
                  <input id="name" name="name" autoComplete="name" placeholder=" " value={v.name} onChange={set('name')} aria-invalid={!!err('name')} data-invalid={!!err('name')} required />
                  <label htmlFor="name">Name *</label>
                  {err('name') && <span className="err" role="alert">{err('name')}</span>}
                </div>
                <div className="field">
                  <input id="email" name="email" type="email" autoComplete="email" placeholder=" " value={v.email} onChange={set('email')} aria-invalid={!!err('email')} data-invalid={!!err('email')} required />
                  <label htmlFor="email">Email *</label>
                  {err('email') && <span className="err" role="alert">{err('email')}</span>}
                </div>
                <div className="field">
                  <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder=" " value={v.phone} onChange={set('phone')} aria-invalid={!!err('phone')} data-invalid={!!err('phone')} />
                  <label htmlFor="phone">Phone</label>
                  {err('phone') && <span className="err" role="alert">{err('phone')}</span>}
                </div>
                <div className="field">
                  <input id="company" name="company" autoComplete="organization" placeholder=" " value={v.company} onChange={set('company')} />
                  <label htmlFor="company">Company</label>
                </div>
                <div className={`field sm:col-span-2 ${v.category ? 'has-value' : ''}`}>
                  <select id="category" name="category" value={v.category} onChange={set('category')}>
                    <option value=""></option>
                    {PROJECT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <label htmlFor="category">Project category</label>
                </div>
                <div className="field sm:col-span-2">
                  <textarea id="message" name="message" rows={5} placeholder=" " value={v.message} onChange={set('message')} aria-invalid={!!err('message')} data-invalid={!!err('message')} required />
                  <label htmlFor="message">Project requirements *</label>
                  {err('message') && <span className="err" role="alert">{err('message')}</span>}
                </div>

                {/* Honeypot: hidden from people, irresistible to bots */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>Leave this empty<input ref={honey} type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
                </div>

                <div className="sm:col-span-2">
                  <input ref={fileInput} id="files" type="file" multiple accept={ACCEPT} className="sr-only" onChange={(e) => addFiles(e.target.files)} />
                  <label htmlFor="files" className="inline-flex cursor-pointer items-center gap-3 border border-dashed border-white/25 px-5 py-4 text-sm text-silver transition-colors hover:border-azure hover:text-white">
                    <Paperclip size={16} /> Attach drawings or photos
                    <span className="text-xs text-mist">(up to {MAX_FILES} files, {MAX_MB} MB each · JPG, PNG, WebP, PDF, DWG, DXF)</span>
                  </label>
                  {files.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {files.map((f, n) => (
                        <li key={f.name + n} className="flex items-center gap-2 border border-white/15 px-3 py-1.5 text-xs">
                          {f.name}
                          <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setFiles((c) => c.filter((_, x) => x !== n))}><X size={12} /></button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {err('files') && <p className="mt-3 text-xs text-red-500" role="alert">{err('files')}</p>}
                </div>

                {status === 'error' && (
                  <p id="form-error" role="alert" className="border border-red-500/40 bg-red-500/5 p-4 text-sm text-red-600 sm:col-span-2">
                    {serverMsg}{' '}
                    <a href={wa} className="ulink" target="_blank" rel="noreferrer">WhatsApp us</a> or email <a className="ulink" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
                  </p>
                )}

                <div className="sm:col-span-2">
                  <Magnetic>
                    <button type="submit" disabled={status === 'sending'} className="btn btn-solid disabled:opacity-60">
                      {status === 'sending' ? 'Sending…' : 'Send enquiry'} <ArrowRight size={14} className="arrow" />
                    </button>
                  </Magnetic>
                  <p className="mt-4 text-xs text-mist">Your details are used only to respond to your enquiry.</p>
                </div>
              </form>
            )}
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="grid gap-9 lg:sticky lg:top-28">
              <div>
                <p className="eyebrow mb-4">{COMPANY.name}</p>
                <a href="https://www.google.com/maps/search/?api=1&query=278%2F3+Main+Peco+Road+Kot+Lakhpat+Lahore" target="_blank" rel="noreferrer" className="group flex gap-4 text-silver">
                  <MapPin className="mt-1 shrink-0 text-azure" size={18} />
                  <address className="not-italic">
                    {COMPANY.addressLines.map((l) => <span key={l} className="block">{l}</span>)}
                    <span className="ulink mt-2 text-xs text-mist">Open in Maps</span>
                  </address>
                </a>
              </div>
              <a href={COMPANY.phoneHref} className="flex items-center gap-4 text-xl font-light"><Phone className="text-azure" size={18} />{COMPANY.phone}</a>
              <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-4 break-all text-silver"><Mail className="shrink-0 text-azure" size={18} />{COMPANY.email}</a>
              <Magnetic>
                <a href={wa} target="_blank" rel="noreferrer" className="btn w-full justify-center"><MessageCircle size={14} /> Chat on WhatsApp</a>
              </Magnetic>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
