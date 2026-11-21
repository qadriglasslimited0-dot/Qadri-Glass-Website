import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Check, Quote } from 'lucide-react'
import { gsap, reducedMotion } from '../lib/gsap'
import { fetchReviews, submitReview, type Review } from '../lib/api'
import FaceRating from '../components/FaceRating'
import Split from '../components/Split'
import { Reveal } from '../components/Reveal'

const LABELS = ['Tap a star to rate us', 'Disappointed', 'Could be better', 'It was okay', 'Happy with it', 'Delighted']
const EMOJI = ['✨', '😞', '🙁', '😐', '🙂', '🤩']
const MAX = 600

function StarIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <path
        d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95z"
        fill={on ? 'rgb(var(--amber))' : 'transparent'}
        stroke={on ? 'rgb(var(--amber))' : 'rgb(var(--mist))'}
        strokeWidth="1.6"
        strokeLinejoin="round"
        style={{ transition: 'fill .25s, stroke .25s' }}
      />
    </svg>
  )
}

/** The published look of a review: used for the live preview and for approved reviews. */
function ReviewCard({ name, company, rating, message, preview = false }: { name: string; company?: string | null; rating: number; message: string; preview?: boolean }) {
  return (
    <figure className="relative flex h-full flex-col rounded-[22px] border border-[rgb(var(--fg)/0.12)] bg-[#ffffff] p-7 text-[#0d2619] shadow-[0_30px_60px_-36px_rgba(13,38,25,0.35)]">
      <Quote size={30} className="mb-4 text-[rgb(var(--amber))]" aria-hidden="true" />
      <div className="mb-4 flex gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className="h-5 w-5">
            <StarIcon on={n <= rating} />
          </span>
        ))}
      </div>
      <blockquote className={`flex-1 text-[1.02rem] leading-relaxed ${message ? '' : 'text-[rgb(var(--mist))]'}`}>{message || 'Your review will appear here as you type it.'}</blockquote>
      <figcaption className="mt-6 border-t border-[rgb(var(--fg)/0.1)] pt-4">
        <p className="font-display text-lg font-bold">{name || 'Your name'}</p>
        {(company || !name) && <p className="text-sm text-[rgb(var(--mist))]">{company || 'Your company (optional)'}</p>}
      </figcaption>
      {preview && <span className="absolute right-5 top-5 rounded-full bg-[rgb(var(--mintc)/0.35)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1A5A33]">Live preview</span>}
    </figure>
  )
}

export default function Reviews() {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [note, setNote] = useState('')
  const [reviews, setReviews] = useState<Review[] | null>(null)
  const honey = useRef<HTMLInputElement>(null)
  const emoji = useRef<HTMLSpanElement>(null)
  const starRefs = useRef<(HTMLButtonElement | null)[]>([])

  const shown = hover || rating
  useEffect(() => {
    fetchReviews().then(setReviews)
  }, [])

  // emoji pops each time the shown expression changes
  useEffect(() => {
    if (!emoji.current || reducedMotion()) return
    gsap.fromTo(emoji.current, { scale: 0.4, rotate: -14, opacity: 0.3 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.55, ease: 'back.out(2.4)' })
  }, [shown])

  const choose = (n: number) => {
    setRating(n)
    const el = starRefs.current[n - 1]
    if (el && !reducedMotion()) {
      gsap.fromTo(starRefs.current.slice(0, n), { scale: 1 }, { scale: 1.32, duration: 0.18, yoyo: true, repeat: 1, stagger: 0.05, ease: 'power2.out' })
    }
  }
  const onKey = (e: KeyboardEvent) => {
    const cur = rating || 0
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      const n = Math.min(5, cur + 1)
      choose(n)
      starRefs.current[n - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      const n = Math.max(1, cur - 1)
      choose(n)
      starRefs.current[n - 1]?.focus()
    }
  }

  const valid = rating > 0 && name.trim().length >= 2 && message.trim().length >= 10
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (honey.current?.value) return // bots fill the hidden field
    if (!valid) {
      setStatus('error')
      setNote(rating === 0 ? 'Please choose a star rating.' : name.trim().length < 2 ? 'Please enter your name.' : 'Please write at least 10 characters.')
      return
    }
    let last = 0
    try {
      last = Number(localStorage.getItem('qg-review-at') ?? 0)
    } catch {
      /* storage unavailable */
    }
    if (Date.now() - last < 60_000) {
      setStatus('error')
      setNote('Please wait a minute before sending another review.')
      return
    }
    setStatus('sending')
    const res = await submitReview({ name, company, rating, message })
    if (res.ok) {
      try {
        localStorage.setItem('qg-review-at', String(Date.now()))
      } catch {
        /* storage unavailable */
      }
      setStatus('ok')
      setName('')
      setCompany('')
      setMessage('')
      setRating(0)
    } else {
      setStatus('error')
      setNote(res.message ?? 'Something went wrong.')
    }
  }

  const field = 'w-full rounded-xl border border-white/20 bg-white/[0.07] px-4 py-3.5 text-[15px] text-white placeholder:text-white/45 outline-none transition-colors focus:border-[rgb(var(--mintc))] focus:bg-white/[0.12]'

  return (
    <section data-section="Reviews" id="reviews" className="relative overflow-hidden bg-ink section">
      <div className="wrap">
        <div className="mb-[clamp(44px,6vw,90px)] max-w-[1100px]">
          <p className="eyebrow mb-6">Customer reviews</p>
          <h2 className="display text-[clamp(2.4rem,6.2vw,6.4rem)]">
            <Split text={'Tell us how we _did._'} />
          </h2>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-12">
          {/* ---------- form ---------- */}
          <Reveal className="theme-deep rounded-[28px] bg-[linear-gradient(160deg,#0f3a24,#081e14)] p-6 text-white shadow-[0_50px_90px_-44px_rgba(8,30,20,0.8)] sm:p-9 lg:col-span-7">
            {status === 'ok' ? (
              <div role="status" className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <span className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-[rgb(var(--mintc))] text-[#0a2116]">
                  <Check size={30} />
                </span>
                <p className="font-display text-3xl font-bold">Thank you.</p>
                <p className="mt-3 max-w-[38ch] text-white/75">Your review has been received and is waiting for approval. It will appear on this page once our team has approved it.</p>
                <button type="button" onClick={() => setStatus('idle')} className="btn mt-8 !text-white">
                  Write another review
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <div className="grid items-center gap-6 sm:grid-cols-[150px_1fr]">
                  <div className="relative mx-auto w-[136px] sm:w-[150px]">
                    <FaceRating value={shown} className="h-auto w-full drop-shadow-[0_18px_28px_rgba(0,0,0,0.35)]" />
                  </div>
                  <div>
                    <p className="flex items-center gap-3 font-display text-2xl font-bold sm:text-3xl" aria-live="polite">
                      <span ref={emoji} className="inline-block text-3xl sm:text-4xl" aria-hidden="true">
                        {EMOJI[shown]}
                      </span>
                      {LABELS[shown]}
                    </p>
                    <div role="radiogroup" aria-label="Your rating" onKeyDown={onKey} onMouseLeave={() => setHover(0)} className="mt-4 flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((n) => {
                        const on = n <= shown
                        return (
                          <button
                            key={n}
                            ref={(el) => {
                              starRefs.current[n - 1] = el
                            }}
                            type="button"
                            role="radio"
                            aria-checked={rating === n}
                            aria-label={`${n} star${n > 1 ? 's' : ''}: ${LABELS[n]}`}
                            tabIndex={rating === n || (rating === 0 && n === 1) ? 0 : -1}
                            onMouseEnter={() => setHover(n)}
                            onFocus={() => setHover(0)}
                            onClick={() => choose(n)}
                            className="h-11 w-11 rounded-full p-1 transition-transform duration-200 hover:scale-110 focus-visible:outline-offset-2 sm:h-12 sm:w-12"
                            style={{ filter: on ? 'drop-shadow(0 0 9px rgb(242 160 61 / 0.85))' : 'none', transition: 'filter .25s, transform .2s' }}
                          >
                            <StarIcon on={on} />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold">
                    Your name
                    <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="name" required className={field} placeholder="e.g. Ayesha Khan" />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold">
                    Company <span className="-mt-1 text-xs font-normal text-white/50">optional</span>
                    <input value={company} onChange={(e) => setCompany(e.target.value)} maxLength={120} autoComplete="organization" className={field} placeholder="e.g. Studio name" />
                  </label>
                </div>
                <label className="mt-4 grid gap-2 text-sm font-semibold">
                  Your review
                  <textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, MAX))} rows={5} required className={`${field} resize-none`} placeholder="Tell us about your experience with Qadri Glass." />
                  <span className={`text-right text-xs font-normal ${message.length > MAX - 40 ? 'text-[rgb(var(--amber))]' : 'text-white/50'}`}>
                    {message.length} / {MAX}
                  </span>
                </label>

                {/* honeypot: hidden from people, filled by bots */}
                <input ref={honey} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button type="submit" disabled={status === 'sending'} className="btn btn-solid disabled:opacity-60">
                    {status === 'sending' ? 'Sending…' : 'Submit review'}
                  </button>
                  <p className="max-w-[34ch] text-xs text-white/55">Reviews are checked by our team before they appear on the website.</p>
                </div>
                {status === 'error' && (
                  <p role="alert" className="mt-4 rounded-xl border border-[rgb(var(--amber)/0.5)] bg-[rgb(var(--amber)/0.12)] px-4 py-3 text-sm text-[rgb(var(--amber))]">
                    {note}
                  </p>
                )}
              </form>
            )}
          </Reveal>

          {/* ---------- live preview ---------- */}
          <Reveal className="lg:sticky lg:top-28 lg:col-span-5" y={50}>
            <ReviewCard preview name={name.trim()} company={company.trim()} rating={rating || 0} message={message.trim()} />
          </Reveal>
        </div>

        {/* ---------- published ---------- */}
        <div className="mt-[clamp(72px,9vw,140px)]">
          <div className="mb-10 flex items-end justify-between gap-6">
            <h3 className="display text-[clamp(1.8rem,3.6vw,3.4rem)]">What customers say</h3>
          </div>
          {reviews && reviews.length > 0 ? (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r) => (
                <li key={r.id}>
                  <ReviewCard name={r.name} company={r.company} rating={r.rating} message={r.message} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="relative overflow-hidden rounded-[24px] border border-dashed border-[rgb(var(--fg)/0.25)] bg-coal px-6 py-14 text-center sm:py-20">
              <Quote size={40} className="mx-auto mb-5 text-[rgb(var(--amber))]" aria-hidden="true" />
              <p className="font-display text-2xl font-bold sm:text-3xl">No reviews published yet.</p>
              <p className="mx-auto mt-3 max-w-[44ch] text-mist">Approved reviews from Qadri Glass customers will appear here. Be the first to share your experience above.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
