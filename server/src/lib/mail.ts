import nodemailer from 'nodemailer'
import { env } from './env.js'

const transport =
  env.smtp.host && env.smtp.user
    ? nodemailer.createTransport({
        host: env.smtp.host,
        port: env.smtp.port,
        secure: env.smtp.port === 465,
        auth: { user: env.smtp.user, pass: env.smtp.pass },
      })
    : null

export const mailConfigured = Boolean(transport)

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESC[c])

export type Enquiry = {
  name: string
  email: string
  phone?: string
  company?: string
  category?: string
  message: string
  files: string[]
}

export async function notifyCompany(e: Enquiry) {
  const subject = `New website enquiry — ${e.name}${e.category ? ` (${e.category})` : ''}`
  const rows: [string, string][] = [
    ['Name', e.name],
    ['Email', e.email],
    ['Phone', e.phone ?? '—'],
    ['Company', e.company ?? '—'],
    ['Category', e.category ?? '—'],
    ['Attachments', e.files.length ? `${e.files.length} file(s) — view in the dashboard` : 'None'],
  ]
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px"><h2>New enquiry</h2><table cellpadding="6">${rows
    .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`)
    .join('')}</table><h3>Requirements</h3><p style="white-space:pre-wrap">${esc(e.message)}</p></div>`
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\n${e.message}`
  if (!transport) {
    console.log(`[mail not configured] ${subject}\n${text}`)
    return false
  }
  await transport.sendMail({ from: env.smtp.from, to: env.smtp.to, replyTo: e.email, subject, text, html })
  return true
}
