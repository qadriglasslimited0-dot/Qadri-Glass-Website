import 'dotenv/config'

export const env = {
  port: Number(process.env.PORT ?? 8787),
  origins: (process.env.CORS_ORIGINS ?? 'http://localhost:5200').split(',').map((s) => s.trim()).filter(Boolean),
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  smtp: {
    host: process.env.SMTP_HOST ?? '',
    port: Number(process.env.SMTP_PORT ?? 465),
    user: process.env.SMTP_USER ?? '',
    pass: process.env.SMTP_PASS ?? '',
    to: process.env.NOTIFY_TO ?? 'qadriglasslimited0@gmail.com',
    from: process.env.NOTIFY_FROM ?? 'Qadri Glass Website <no-reply@localhost>',
  },
  turnstile: process.env.TURNSTILE_SECRET ?? '',
}
