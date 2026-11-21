import { Router } from 'express'
import multer from 'multer'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { env } from '../lib/env.js'
import { supabase } from '../lib/supabase.js'
import { notifyCompany } from '../lib/mail.js'

export const enquiries = Router()

const EXT_OK = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'dwg', 'dxf']
const upload = multer({ storage: multer.memoryStorage(), limits: { files: 5, fileSize: 10 * 1024 * 1024, fields: 20 } })

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many enquiries from this connection. Please try again later or contact us on WhatsApp.' },
})

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(30).regex(/^[+()\d\s-]*$/).optional(),
  company: z.string().trim().max(160).optional(),
  category: z.string().trim().max(80).optional(),
  message: z.string().trim().min(10).max(5000),
  'cf-turnstile-response': z.string().optional(),
})

async function turnstileOk(token?: string, ip?: string) {
  if (!env.turnstile) return true
  if (!token) return false
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: env.turnstile, response: token, ...(ip ? { remoteip: ip } : {}) }),
  })
  return Boolean(((await r.json()) as { success?: boolean }).success)
}

enquiries.post('/', limiter, upload.array('files', 5), async (req, res) => {
  // Honeypot filled, or form submitted impossibly fast: pretend success so bots learn nothing.
  const t = Number(req.body?.t)
  if (req.body?.website || (t > 0 && t < 2500)) return res.json({ ok: true })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ message: 'Please check the form fields and try again.' })
  if (!(await turnstileOk(parsed.data['cf-turnstile-response'], req.ip))) {
    return res.status(400).json({ message: 'Spam check failed. Please try again.' })
  }

  const d = parsed.data
  const files = (req.files as Express.Multer.File[] | undefined) ?? []
  const paths: string[] = []

  if (supabase) {
    for (const f of files) {
      const ext = (f.originalname.split('.').pop() ?? '').toLowerCase()
      if (!EXT_OK.includes(ext)) return res.status(400).json({ message: `File type not allowed: ${f.originalname}` })
      const path = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${ext}`
      const { error } = await supabase.storage.from('enquiry-files').upload(path, f.buffer, { contentType: f.mimetype })
      if (error) {
        console.error('upload failed', error.message)
        return res.status(500).json({ message: 'We could not store your attachment. Please try again.' })
      }
      paths.push(path)
    }
    const { error } = await supabase.from('enquiries').insert({
      name: d.name,
      email: d.email,
      phone: d.phone || null,
      company: d.company || null,
      category: d.category || null,
      message: d.message,
      attachments: paths,
      status: 'new',
    })
    if (error) {
      console.error('insert failed', error.message)
      return res.status(500).json({ message: 'We could not save your enquiry. Please try again or contact us on WhatsApp.' })
    }
  } else {
    console.warn('Supabase not configured — enquiry logged only, not stored.')
  }

  // Notification must never fail the request: the enquiry is already stored.
  notifyCompany({ ...d, phone: d.phone || undefined, files: paths }).catch((e) => console.error('mail failed', e.message))
  res.json({ ok: true })
})
