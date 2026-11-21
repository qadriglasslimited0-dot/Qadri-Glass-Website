import os, re
os.chdir(r'C:\Users\Dell\Desktop\AGENT\qadri-glass\client\src')
miss = []
def rd(p): return open(p, encoding='utf8').read()
def wr(p, s): open(p, 'w', encoding='utf8').write(s)
def rw(p, pairs):
    s = rd(p)
    for a, b in pairs:
        if a not in s: miss.append((p, a[:60]))
        s = s.replace(a, b)
    wr(p, s)

# ---------- 1. glitch sources ----------
wr('main.tsx', """import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
// Always start at the top so pinned sections measure from a clean state.
window.scrollTo(0, 0)

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
""")
rx = re.compile(r"  // Keep pin/scrub measurements accurate.*?\n  \}, \[\]\)\n", re.S)
s = rd('App.tsx')
new = """  // Re-measure pins once fonts and lazy chunks have settled — never during scrolling (that causes jumps).
  useEffect(() => {
    const t1 = window.setTimeout(() => ScrollTrigger.refresh(), 1200)
    const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 3500)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])
"""
s, n = rx.subn(new, s)
if n == 0: miss.append(('App.tsx', 'refresh block'))
wr('App.tsx', s)
rw('lib/gsap.ts', [("gsap.registerPlugin(ScrollTrigger)", "gsap.registerPlugin(ScrollTrigger)\nScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true })")])

# ---------- 2. story: chapters no longer overlap while swapping ----------
rw('sections/Story.tsx', [
    (".to(chapters[i], { opacity: 1, y: 0, duration: 0.5, pointerEvents: 'auto' }, at + 0.3)", ".to(chapters[i], { opacity: 1, y: 0, duration: 0.5, pointerEvents: 'auto' }, at + 0.5)"),
    (".to(ticks[i], { opacity: 1, duration: 0.2 }, at + 0.3)", ".to(ticks[i], { opacity: 1, duration: 0.2 }, at + 0.5)"),
    (".fromTo(marks[i], { yPercent: 100 }, { yPercent: 0, duration: 0.5 }, at + 0.25)", ".fromTo(marks[i], { yPercent: 100 }, { yPercent: 0, duration: 0.5 }, at + 0.45)"),
])

# ---------- 3. headline sizes tied to viewport height so nothing collides ----------
rw('sections/Hero.tsx', [
    ('className="display h-xl max-w-[13ch] will-change-transform"', 'className="display max-w-[13ch] text-[clamp(2.7rem,min(7.2vw,14svh),7.6rem)] will-change-transform"'),
    ('hidden h-[150px] w-[150px] lg:block', 'hidden h-[150px] w-[150px] xl:block'),
    ('w-[270px] p-6 lg:block', 'w-[270px] p-6 xl:block'),
])
rw('sections/ServicesStage.tsx', [('className="display h-lg max-w-[16ch]"', 'className="display max-w-[18ch] text-[clamp(2rem,min(5.2vw,8.5svh),5rem)]"')])
rw('sections/GlassLab.tsx', [('className="display h-lg"', 'className="display text-[clamp(2.2rem,min(5.6vw,9svh),5.6rem)]"')])

# ---------- 4. contrast: clearly different section bands ----------
rw('index.css', [
    ("  --mist: 112 141 126;", "  --mist: 82 110 95;"),
    ("  --mist: 104 135 119;", "  --mist: 82 110 95;"),
])
open('index.css', 'a', encoding='utf8').write("""
/* Solid green bands — clear contrast against the white / mint sections */
.theme-green {
  --bg: 38 124 80; --bg2: 46 138 92; --bg3: 30 108 69;
  --fg: 255 255 255; --silver: 226 244 234; --mist: 184 219 199;
  --accent: 196 248 220; --accent2: 255 255 255;
  color: rgb(var(--fg));
}
.theme-forest {
  --bg: 20 78 49; --bg2: 26 92 58; --bg3: 15 64 40;
  --fg: 255 255 255; --silver: 214 236 222; --mist: 160 200 178;
  --accent: 160 232 196; --accent2: 255 255 255;
  color: rgb(var(--fg));
}
""")
rw('sections/ServicesStage.tsx', [('className="theme-dark relative bg-ink"', 'className="relative bg-ink"')])
rw('sections/GlassLab.tsx', [('className="theme-dark relative bg-ink section"', 'className="relative bg-ink section"')])
rw('sections/CTA.tsx', [('className="theme-dark relative overflow-hidden bg-ink section"', 'className="relative overflow-hidden bg-ink section"')])
rw('sections/MissionVision.tsx', [('className="theme-dark relative overflow-hidden bg-ink section"', 'className="theme-green relative overflow-hidden bg-ink section"')])
rw('components/Footer.tsx', [('className="theme-dark relative overflow-hidden border-t border-white/10 bg-ink"', 'className="theme-forest relative overflow-hidden bg-ink"')])
print('MISSES', miss)
