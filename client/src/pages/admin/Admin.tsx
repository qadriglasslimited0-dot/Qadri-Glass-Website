import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { ImagePlus, LogOut, Plus, Trash2, X } from 'lucide-react'
import { supabase, supabaseConfigured } from '../../lib/supabase'
import { fromText, RESOURCES, toText, type Field, type Resource } from './resources'
import Logo from '../../components/Logo'

type Row = Record<string, any>
const btn = 'border border-white/25 px-4 py-2 font-wide text-[9px] uppercase tracking-[0.25em] transition-colors hover:bg-white hover:text-ink disabled:opacity-50'
const input = 'w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-azure'

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null)
  const [staff, setStaff] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!supabase || !session) return setStaff(null)
    supabase.from('staff').select('user_id').eq('user_id', session.user.id).maybeSingle().then(({ data }) => setStaff(Boolean(data)))
  }, [session])

  return (
    <div className="theme-dark min-h-screen bg-ink text-white" data-lenis-prevent>
      <meta name="robots" content="noindex,nofollow" />
      <title>Staff dashboard — Qadri Glass</title>
      {!supabaseConfigured ? (
        <Shell>
          <h1 className="display h-md mb-4">Supabase not configured</h1>
          <p className="max-w-xl text-silver/80">
            Add <code className="text-azure">VITE_SUPABASE_URL</code> and <code className="text-azure">VITE_SUPABASE_ANON_KEY</code> to <code>client/.env</code>, run <code>supabase/schema.sql</code> in your Supabase project, then reload. See the README for the full setup.
          </p>
        </Shell>
      ) : loading ? (
        <Shell>Loading…</Shell>
      ) : !session ? (
        <Login />
      ) : staff === false ? (
        <Claim email={session.user.email ?? ''} onClaimed={() => setStaff(true)} />
      ) : staff ? (
        <Dashboard session={session} />
      ) : (
        <Shell>Checking access…</Shell>
      )}
    </div>
  )
}

function Claim({ email, onClaimed }: { email: string; onClaimed: () => void }) {
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const claim = async () => {
    setBusy(true)
    setMsg('')
    const { data, error } = await supabase!.rpc('claim_staff')
    setBusy(false)
    if (error) setMsg(error.message.includes('claim_staff') ? 'Database setup is incomplete: run supabase/schema.sql in the Supabase SQL editor first.' : error.message)
    else if (data) onClaimed()
    else setMsg('An admin already exists. Ask them to add your user ID to the staff table.')
  }
  return (
    <Shell>
      <h1 className="display h-md mb-4">Set up admin access</h1>
      <p className="mb-6 max-w-md text-silver">
        {email} is signed in but is not on the staff list yet. If this is the first setup, claim admin access. It only works while no admin exists.
      </p>
      {msg && <p role="alert" className="mb-4 max-w-md text-sm text-red-600">{msg}</p>}
      <div className="flex gap-3">
        <button className={btn} onClick={claim} disabled={busy}>{busy ? 'Claiming…' : 'Claim admin access'}</button>
        <button className={btn} onClick={() => supabase!.auth.signOut()}>Sign out</button>
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div>
        <Logo variant="mark" className="mb-8 h-10 w-auto" />
        {children}
        <p className="mt-10"><Link to="/" className="ulink text-xs text-mist">← Back to website</Link></p>
      </div>
    </div>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    const { error } = await supabase!.auth.signInWithPassword({ email, password })
    if (error) setErr(error.message)
    setBusy(false)
  }
  return (
    <Shell>
      <h1 className="display h-md mb-8">Staff sign in</h1>
      <form onSubmit={submit} className="grid w-[min(86vw,360px)] gap-4">
        <label className="grid gap-1 text-xs text-mist">Email<input className={input} type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label className="grid gap-1 text-xs text-mist">Password<input className={input} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {err && <p role="alert" className="text-sm text-red-500">{err}</p>}
        <button className={`${btn} mt-2`} disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </Shell>
  )
}

function Dashboard({ session }: { session: Session }) {
  const [tab, setTab] = useState<string>('overview')
  const tabs = [{ key: 'overview', label: 'Overview' }, { key: 'enquiries', label: 'Enquiries' }, { key: 'images', label: 'Site images' }, ...RESOURCES.map((r) => ({ key: r.key, label: r.label }))]
  const res = RESOURCES.find((r) => r.key === tab)
  return (
    <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
        <Logo variant="mark" className="mb-6 h-8 w-auto" />
        <nav aria-label="Dashboard" className="flex flex-wrap gap-2 lg:grid">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} aria-current={tab === t.key} className={`px-3 py-2 text-left text-sm transition-colors ${tab === t.key ? 'bg-white text-ink' : 'text-silver hover:bg-white/10'}`}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="mt-8 hidden text-xs text-mist lg:block">
          <p className="mb-3 break-all">{session.user.email}</p>
          <button className="flex items-center gap-2 text-silver hover:text-white" onClick={() => supabase!.auth.signOut()}><LogOut size={14} /> Sign out</button>
          <Link to="/" className="ulink mt-4 block">View website</Link>
        </div>
      </aside>
      <main className="min-w-0 p-5 sm:p-8">
        {tab === 'overview' ? <Overview go={setTab} /> : tab === 'enquiries' ? <Enquiries /> : tab === 'images' ? <SiteImages /> : res && <Manager key={res.key} res={res} />}
        <div className="mt-10 lg:hidden"><button className={btn} onClick={() => supabase!.auth.signOut()}>Sign out</button></div>
      </main>
    </div>
  )
}

/* ------------------------------ Overview ------------------------------ */
function Overview({ go }: { go: (t: string) => void }) {
  const [counts, setCounts] = useState<Record<string, number | null>>({})
  useEffect(() => {
    const run = async () => {
      const out: Record<string, number | null> = {}
      const q = async (k: string, table: string, f?: (b: any) => any) => {
        let b = supabase!.from(table).select('*', { count: 'exact', head: true })
        if (f) b = f(b)
        const { count, error } = await b
        out[k] = error ? null : count ?? 0
      }
      await Promise.all([
        q('new', 'enquiries', (b) => b.eq('status', 'new')),
        q('enquiries', 'enquiries'),
        q('projects', 'projects'),
        q('products', 'products'),
        q('services', 'services'),
        q('certificates', 'certificates'),
      ])
      setCounts(out)
    }
    void run()
  }, [])
  const missing = Object.values(counts).some((v) => v === null)
  const cards: [string, string, string][] = [
    ['new', 'New enquiries', 'enquiries'],
    ['enquiries', 'All enquiries', 'enquiries'],
    ['projects', 'Projects', 'projects'],
    ['products', 'Products', 'products'],
    ['services', 'Services', 'services'],
    ['certificates', 'Certificates', 'certificates'],
  ]
  return (
    <>
      <h1 className="display h-md mb-8">Overview</h1>
      {missing && (
        <p className="mb-6 max-w-xl border border-red-500/40 bg-red-500/5 p-4 text-sm text-red-700">
          Some tables could not be read. Run <code>supabase/schema.sql</code> in your Supabase SQL editor, then reload.
        </p>
      )}
      <div className="grid gap-px bg-[rgb(var(--fg)/0.12)] sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([k, label, tab]) => (
          <button key={k} onClick={() => go(tab)} className="bg-ink p-7 text-left transition-colors hover:bg-coal">
            <p className="eyebrow mb-4">{label}</p>
            <p className="text-6xl font-extrabold tracking-tighter">{counts[k] ?? '–'}</p>
          </button>
        ))}
      </div>
      <p className="mt-10 max-w-xl text-sm text-mist">Projects and products stay hidden from the website until you tick "Published". Certificates appear only when marked "Verified".</p>
    </>
  )
}

/* ------------------------------ Site images ------------------------------ */
const SLOTS: { key: string; label: string; hint: string }[] = [
  { key: 'image.hero', label: 'Home hero background', hint: 'Wide landscape photo, at least 2000px wide. Replaces the 3D glass wall.' },
  { key: 'image.service.architectural-glass', label: 'Service: Architectural Glass', hint: 'Landscape, about 1800px wide.' },
  { key: 'image.service.custom-fabrication', label: 'Service: Custom Fabrication', hint: 'Landscape, about 1800px wide.' },
  { key: 'image.service.professional-installation', label: 'Service: Professional Installation', hint: 'Landscape, about 1800px wide.' },
  { key: 'image.service.decorative-solutions', label: 'Service: Decorative Solutions', hint: 'Landscape, about 1800px wide.' },
  { key: 'image.cta', label: 'Contact call-to-action', hint: 'Portrait photo, about 4:5.' },
]

function SiteImages() {
  const [vals, setVals] = useState<Record<string, string>>({})
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState('')
  const load = useCallback(async () => {
    const { data } = await supabase!.from('site_content').select('key,value').like('key', 'image.%')
    setVals(Object.fromEntries((data ?? []).map((r: { key: string; value: string }) => [r.key, r.value])))
  }, [])
  useEffect(() => void load(), [load])

  const upload = async (key: string, file: File) => {
    setBusy(key)
    setMsg('')
    const path = `site/${key.replace(/\W+/g, '-')}-${Date.now()}-${file.name.replace(/[^\w.-]+/g, '_')}`
    const up = await supabase!.storage.from('media').upload(path, file, { cacheControl: '31536000' })
    if (up.error) {
      setMsg(up.error.message)
      setBusy('')
      return
    }
    const url = supabase!.storage.from('media').getPublicUrl(path).data.publicUrl
    const { error } = await supabase!.from('site_content').upsert({ key, value: url, updated_at: new Date().toISOString() })
    setMsg(error ? error.message : 'Saved. The website shows it right away.')
    setBusy('')
    load()
  }
  const remove = async (key: string) => {
    const { error } = await supabase!.from('site_content').delete().eq('key', key)
    setMsg(error ? error.message : 'Removed. The website falls back to its default visual.')
    load()
  }

  return (
    <>
      <h1 className="display h-md mb-3">Site images</h1>
      <p className="mb-8 max-w-xl text-sm text-mist">Replace the main pictures on the website. Project and product photos are edited inside Projects and Products. Use genuine Qadri Glass photography.</p>
      {msg && <p role="status" className="mb-5 text-sm text-azure">{msg}</p>}
      <ul className="grid gap-5 md:grid-cols-2">
        {SLOTS.map((s) => (
          <li key={s.key} className="border border-[rgb(var(--fg)/0.15)] p-5">
            <p className="font-normal">{s.label}</p>
            <p className="mb-4 mt-1 text-xs text-mist">{s.hint}</p>
            <div className="mb-4 aspect-[16/9] overflow-hidden bg-coal">
              {vals[s.key] ? <img src={vals[s.key]} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-xs text-mist">Default visual in use</div>}
            </div>
            <div className="flex flex-wrap gap-3">
              <label className={`${btn} flex cursor-pointer items-center gap-2`}>
                <ImagePlus size={14} /> {busy === s.key ? 'Uploading…' : vals[s.key] ? 'Replace' : 'Upload'}
                <input type="file" accept="image/*" className="sr-only" disabled={busy === s.key} onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(s.key, f) }} />
              </label>
              {vals[s.key] && <button className={btn} onClick={() => remove(s.key)}>Remove</button>}
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

/* ------------------------------ Enquiries ------------------------------ */
function Enquiries() {
  const [rows, setRows] = useState<Row[]>([])
  const [open, setOpen] = useState<string | null>(null)
  const [urls, setUrls] = useState<Record<string, string>>({})
  const load = useCallback(async () => {
    const { data } = await supabase!.from('enquiries').select('*').order('created_at', { ascending: false })
    setRows(data ?? [])
  }, [])
  useEffect(() => void load(), [load])

  const toggle = async (r: Row) => {
    setOpen(open === r.id ? null : r.id)
    const next: Record<string, string> = {}
    for (const p of (r.attachments ?? []) as string[]) {
      const { data } = await supabase!.storage.from('enquiry-files').createSignedUrl(p, 600)
      if (data) next[p] = data.signedUrl
    }
    setUrls((u) => ({ ...u, ...next }))
  }
  const setStatus = async (id: string, status: string) => {
    await supabase!.from('enquiries').update({ status }).eq('id', id)
    load()
  }
  const remove = async (id: string) => {
    if (!confirm('Delete this enquiry permanently?')) return
    await supabase!.from('enquiries').delete().eq('id', id)
    load()
  }

  return (
    <>
      <h1 className="display h-md mb-6">Enquiries</h1>
      {rows.length === 0 && <p className="text-mist">No enquiries yet.</p>}
      <ul className="grid gap-px bg-white/10">
        {rows.map((r) => (
          <li key={r.id} className="bg-coal">
            <button onClick={() => toggle(r)} className="grid w-full gap-1 p-4 text-left sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center sm:gap-4">
              <span className="font-normal">{r.name}</span>
              <span className="truncate text-sm text-mist">{r.email}</span>
              <span className="text-xs text-mist">{new Date(r.created_at).toLocaleString()}</span>
              <span className={`w-fit px-2 py-1 font-wide text-[8px] uppercase tracking-[0.2em] ${r.status === 'new' ? 'bg-azure text-ink' : 'border border-white/20 text-silver'}`}>{r.status}</span>
            </button>
            {open === r.id && (
              <div className="grid gap-4 border-t border-white/10 p-5 text-sm">
                <dl className="grid gap-2 sm:grid-cols-2">
                  {[['Phone', r.phone], ['Company', r.company], ['Category', r.category]].map(([k, v]) => <div key={k}><dt className="eyebrow">{k}</dt><dd>{v || '—'}</dd></div>)}
                </dl>
                <div><p className="eyebrow mb-1">Requirements</p><p className="whitespace-pre-wrap text-silver">{r.message}</p></div>
                {(r.attachments ?? []).length > 0 && (
                  <div><p className="eyebrow mb-1">Attachments</p>
                    <ul className="grid gap-1">{(r.attachments as string[]).map((p) => <li key={p}>{urls[p] ? <a className="ulink" href={urls[p]} target="_blank" rel="noreferrer">{p.split('/').pop()}</a> : p.split('/').pop()}</li>)}</ul>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  {['new', 'contacted', 'closed'].map((s) => <button key={s} className={btn} onClick={() => setStatus(r.id, s)} disabled={r.status === s}>{s}</button>)}
                  <button className="ml-auto text-red-500" aria-label="Delete enquiry" onClick={() => remove(r.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}

/* ------------------------------ Generic CRUD ------------------------------ */
function Manager({ res }: { res: Resource }) {
  const [rows, setRows] = useState<Row[]>([])
  const [editing, setEditing] = useState<Row | null>(null)
  const [msg, setMsg] = useState('')
  const pk = res.table === 'site_content' ? 'key' : 'id'
  const load = useCallback(async () => {
    const { data, error } = await supabase!.from(res.table).select('*').order(res.table === 'site_content' ? 'key' : res.table === 'reviews' ? 'created_at' : 'sort', { ascending: res.table !== 'reviews' })
    if (error) setMsg(error.message)
    setRows(data ?? [])
  }, [res.table])
  useEffect(() => void load(), [load])

  const remove = async (r: Row) => {
    if (!confirm(`Delete "${r[res.titleKey]}"? This cannot be undone.`)) return
    const { error } = await supabase!.from(res.table).delete().eq(pk, r[pk])
    setMsg(error ? error.message : 'Deleted.')
    load()
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="display h-md">{res.label}</h1>
        <button className={`${btn} flex items-center gap-2`} onClick={() => setEditing({ ...res.defaults, __new: true })}><Plus size={14} /> New</button>
      </div>
      {msg && <p role="status" className="mb-4 text-sm text-azure">{msg}</p>}
      {rows.length === 0 && <p className="text-mist">Nothing here yet.</p>}
      <ul className="grid gap-px bg-white/10">
        {rows.map((r) => (
          <li key={r[pk]} className="flex items-center gap-4 bg-coal p-4">
            <button className="min-w-0 flex-1 truncate text-left hover:text-azure" onClick={() => setEditing(r)}>{r[res.titleKey]}</button>
            {'published' in r && <span className={`px-2 py-1 font-wide text-[8px] uppercase tracking-[0.2em] ${r.published ? 'bg-mint text-ink' : 'border border-white/20 text-mist'}`}>{r.published ? 'Live' : 'Draft'}</span>}
            {'verified' in r && <span className={`px-2 py-1 font-wide text-[8px] uppercase tracking-[0.2em] ${r.verified ? 'bg-mint text-ink' : 'border border-white/20 text-mist'}`}>{r.verified ? 'Verified' : 'Unverified'}</span>}
            <button aria-label={`Delete ${r[res.titleKey]}`} className="text-red-500" onClick={() => remove(r)}><Trash2 size={16} /></button>
          </li>
        ))}
      </ul>
      {editing && <Editor res={res} row={editing} pk={pk} onClose={() => setEditing(null)} onSaved={(m) => { setMsg(m); setEditing(null); load() }} />}
    </>
  )
}

function Editor({ res, row, pk, onClose, onSaved }: { res: Resource; row: Row; pk: string; onClose: () => void; onSaved: (m: string) => void }) {
  const isNew = Boolean(row.__new)
  const [state, setState] = useState<Row>(() => {
    const s: Row = {}
    res.fields.forEach((f) => {
      s[f.key] = ['lines', 'kv', 'steps'].includes(f.type) ? toText(f, row[f.key]) : (row[f.key] ?? (f.type === 'bool' ? false : f.type === 'number' ? 0 : f.type === 'images' ? [] : ''))
    })
    return s
  })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const upload = async (file: File): Promise<string | null> => {
    const path = `${res.bucketFolder}/${Date.now()}-${file.name.replace(/[^\w.-]+/g, '_')}`
    const { error } = await supabase!.storage.from('media').upload(path, file, { cacheControl: '31536000', upsert: false })
    if (error) {
      setErr(error.message)
      return null
    }
    return supabase!.storage.from('media').getPublicUrl(path).data.publicUrl
  }

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    const payload: Row = {}
    res.fields.forEach((f) => {
      payload[f.key] = ['lines', 'kv', 'steps'].includes(f.type) ? fromText(f, state[f.key]) : f.type === 'number' ? Number(state[f.key]) || 0 : state[f.key]
    })
    const q = isNew ? supabase!.from(res.table).insert(payload) : supabase!.from(res.table).update(payload).eq(pk, row[pk])
    const { error } = await q
    setBusy(false)
    if (error) setErr(error.message)
    else onSaved('Saved.')
  }

  return (
    <div className="fixed inset-0 z-[200] grid place-items-start overflow-y-auto bg-black/70 p-4 backdrop-blur sm:p-10" role="dialog" aria-modal="true" aria-label={`Edit ${res.label}`}>
      <form onSubmit={save} className="glass mx-auto w-full max-w-3xl bg-coal p-6 sm:p-9">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-light uppercase tracking-wide">{isNew ? 'New' : 'Edit'} · {res.label}</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X /></button>
        </div>
        <div className="grid gap-5">
          {res.fields.map((f) => (
            <FieldInput key={f.key} f={f} value={state[f.key]} set={(v) => setState((s) => ({ ...s, [f.key]: v }))} upload={upload} locked={f.key === 'key' && !isNew} />
          ))}
        </div>
        {err && <p role="alert" className="mt-5 text-sm text-red-500">{err}</p>}
        <div className="mt-8 flex gap-3">
          <button className={btn} disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
          <button type="button" className={btn} onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

function FieldInput({ f, value, set, upload, locked }: { f: Field; value: any; set: (v: any) => void; upload: (f: File) => Promise<string | null>; locked?: boolean }) {
  const id = `f-${f.key}`
  const label = <label htmlFor={id} className="eyebrow mb-2 block">{f.label}{f.required ? ' *' : ''}</label>
  const help = f.help && <p className="mt-1 text-xs text-mist">{f.help}</p>
  if (f.type === 'bool')
    return <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={!!value} onChange={(e) => set(e.target.checked)} className="h-4 w-4 accent-white" />{f.label}{help}</label>
  if (f.type === 'select')
    return <div>{label}<select id={id} disabled={locked} className={input + ' bg-coal'} value={value} onChange={(e) => set(e.target.value)} required={f.required}><option value="">Select…</option>{f.options!.map((o) => <option key={o}>{o}</option>)}</select></div>
  if (f.type === 'textarea' || ['lines', 'kv', 'steps'].includes(f.type))
    return <div>{label}<textarea id={id} rows={f.type === 'textarea' ? 5 : 6} className={input} value={value} onChange={(e) => set(e.target.value)} required={f.required} />{help}</div>
  if (f.type === 'image')
    return (
      <div>{label}
        <div className="flex flex-wrap items-center gap-3">
          {value && <img src={value} alt="" className="h-20 w-28 object-cover" />}
          <input id={id} className={input + ' flex-1'} placeholder="Image URL" value={value} onChange={(e) => set(e.target.value)} />
          <label className={`${btn} flex cursor-pointer items-center gap-2`}><ImagePlus size={14} /> Upload<input type="file" accept="image/*" className="sr-only" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const u = await upload(file); if (u) set(u) } }} /></label>
        </div>{help}
      </div>
    )
  if (f.type === 'images') {
    const list: string[] = value ?? []
    return (
      <div>{label}
        <div className="flex flex-wrap gap-3">
          {list.map((u, i) => (
            <div key={u} className="relative"><img src={u} alt="" className="h-24 w-32 object-cover" /><button type="button" aria-label="Remove image" className="absolute right-1 top-1 bg-black/70 p-1" onClick={() => set(list.filter((_, x) => x !== i))}><X size={12} /></button></div>
          ))}
          <label className={`${btn} flex h-24 w-32 cursor-pointer flex-col items-center justify-center gap-2`}><ImagePlus size={18} /> Add<input type="file" accept="image/*" multiple className="sr-only" onChange={async (e) => { const out: string[] = []; for (const file of Array.from(e.target.files ?? [])) { const u = await upload(file); if (u) out.push(u) } set([...list, ...out]) }} /></label>
        </div>{help}
      </div>
    )
  }
  return <div>{label}<input id={id} type={f.type === 'number' ? 'number' : 'text'} className={input} value={value} onChange={(e) => set(e.target.value)} required={f.required} />{help}</div>
}
