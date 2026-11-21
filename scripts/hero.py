import os
os.chdir(r'C:\Users\Dell\Desktop\AGENT\qadri-glass\client\src')
miss = []
def rw(p, pairs):
    s = open(p, encoding='utf8').read()
    for a, b in pairs:
        if a not in s: miss.append((p, a[:60]))
        s = s.replace(a, b)
    open(p, 'w', encoding='utf8').write(s)

rw('sections/Hero.tsx', [
    # imports
    ("import { Link } from 'react-router-dom'", "import { Link } from 'react-router-dom'\nimport Logo from '../components/Logo'"),
    # spotlight follows cursor
    ("      const cx = gsap.quickTo(q('[data-h1]'), 'x', { duration: 1.4, ease: 'power3.out' })",
     "      const sx = gsap.quickTo(q('[data-spot]'), 'x', { duration: 1.1, ease: 'power3.out' })\n      const sy = gsap.quickTo(q('[data-spot]'), 'y', { duration: 1.1, ease: 'power3.out' })\n      const cx = gsap.quickTo(q('[data-h1]'), 'x', { duration: 1.4, ease: 'power3.out' })"),
    ("        cx(nx * -16)", "        sx(e.clientX - window.innerWidth / 2)\n        sy(e.clientY - window.innerHeight / 2)\n        cx(nx * -16)"),
    # parallax for the badge + card on scroll
    ("      .to(q('[data-cue]'), { opacity: 0, ease: 'none', duration: 0.2 }, 0)",
     "      .to(q('[data-cue]'), { opacity: 0, ease: 'none', duration: 0.2 }, 0)\n      .to(q('[data-float]'), { yPercent: -40, ease: 'none' }, 0)"),
    # lighter veils so the glass shows
    ('<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink" />\n      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />',
     '<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/90" />\n      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/25 to-transparent" />\n      <div data-spot className="pointer-events-none absolute left-1/2 top-1/2 h-[46vmax] w-[46vmax] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform" style={{ background: \'radial-gradient(circle, rgba(255,255,255,0.55), transparent 62%)\' }} aria-hidden="true" />'),
    # layout: copy + buttons stacked left
    ('<div className="mt-10 grid items-end gap-8 sm:mt-12 lg:grid-cols-12">\n          <p data-in className="lead max-w-[44ch] lg:col-span-5">',
     '<div className="mt-10 grid gap-9 sm:mt-12">\n          <p data-in className="lead max-w-[46ch]">'),
    ('<div data-in className="flex flex-wrap gap-4 lg:col-span-7 lg:justify-end">', '<div data-in className="flex flex-wrap gap-4">'),
    ('max-w-[14ch] will-change-transform', 'max-w-[13ch] will-change-transform'),
    ('<span className="scrollcue absolute inset-0 bg-white" />', '<span className="scrollcue absolute inset-0" />'),
    ('bg-white/15">', 'bg-[rgb(var(--fg)/0.15)]">'),
    # badge + card
    ('      <div data-cue className="absolute bottom-7',
     '''      <div data-float className="pointer-events-none absolute right-[var(--gutter)] top-[26%] z-10 hidden h-[150px] w-[150px] lg:block" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 text-[rgb(var(--fg))]">
          <defs><path id="hero-circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
          <text fontSize="11.5" letterSpacing="5.2" fill="currentColor" className="font-wide uppercase"><textPath href="#hero-circ">Architectural · Decorative · Since 1960 ·</textPath></text>
        </svg>
        <Logo variant="mark" className="absolute left-1/2 top-1/2 w-12 -translate-x-1/2 -translate-y-1/2" alt="" />
      </div>
      <div data-float data-in className="glass absolute bottom-[clamp(88px,13vh,150px)] right-[var(--gutter)] z-10 hidden w-[270px] p-6 lg:block">
        <p className="eyebrow mb-4 !text-azure">Qadri Glass · Lahore</p>
        <dl className="grid gap-4">
          {[['65+', 'Years of craftsmanship'], ['1,000+', 'Projects delivered*'], ['3', 'Generations of leadership']].map(([n, l]) => (
            <div key={l} className="flex items-baseline justify-between gap-4 border-t border-[rgb(var(--fg)/0.1)] pt-3 first:border-0 first:pt-0">
              <dt className="text-3xl font-light tracking-tight">{n}</dt>
              <dd className="text-right text-xs text-mist">{l}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[10px] text-mist">*As stated by Qadri Glass.</p>
      </div>
      <div data-cue className="absolute bottom-7'''),
])
open('index.css', 'a', encoding='utf8').write("""
@keyframes spin-slow { to { transform: rotate(360deg); } }
.spin-slow { animation: spin-slow 28s linear infinite; }
@media (prefers-reduced-motion: reduce) { .spin-slow { animation: none; } }
""")
print('MISSES', miss)
