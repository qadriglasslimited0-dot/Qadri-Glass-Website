import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { env } from './lib/env.js'
import { supabase } from './lib/supabase.js'
import { mailConfigured } from './lib/mail.js'
import { content } from './routes/content.js'
import { enquiries } from './routes/enquiries.js'

const app = express()
app.set('trust proxy', 1)
app.disable('x-powered-by')
app.use(helmet())
app.use(compression())
app.use(cors({ origin: env.origins, methods: ['GET', 'POST'], maxAge: 86400 }))
app.use(express.json({ limit: '50kb' }))
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-7', legacyHeaders: false }))

app.get('/api/health', (_req, res) => res.json({ ok: true, supabase: Boolean(supabase), mail: mailConfigured }))
app.use('/api/content', content)
app.use('/api/enquiries', enquiries)

app.use((_req, res) => res.status(404).json({ message: 'Not found' }))
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  const status = err.name === 'MulterError' ? 400 : 500
  res.status(status).json({ message: status === 400 ? 'Upload rejected (check file count and size).' : 'Something went wrong.' })
})

app.listen(env.port, () => {
  console.log(`Qadri Glass API on :${env.port}  supabase=${Boolean(supabase)} mail=${mailConfigured}`)
})
