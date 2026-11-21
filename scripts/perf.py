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

# ---------- GlassScene: no backdrop blur, optional motion ----------
rw('components/GlassScene.tsx', [
    ("export default function GlassScene({ variant = 'facade', className = '', seed = 0 }: { variant?: SceneVariant; className?: string; seed?: number }) {",
     "export default function GlassScene({ variant = 'facade', className = '', seed = 0, lite = false }: { variant?: SceneVariant; className?: string; seed?: number; lite?: boolean }) {"),
    ("    if (reduced) return\n    gsap.from(items,", "    if (reduced || lite) return\n    gsap.from(items,"),
    ("""              backdropFilter: p.blur ? 'blur(10px) saturate(1.2)' : undefined,
              WebkitBackdropFilter: p.blur ? 'blur(10px) saturate(1.2)' : undefined,
""", ""),
    ("""            <span className="glint absolute inset-0" aria-hidden="true" />""", """            {!lite && <span className="glint absolute inset-0" aria-hidden="true" />}"""),
    ("""className="absolute will-change-transform" style""", """className="absolute" style"""),
    ("""rgba(255,255,255,${(p.o ?? 0.7) * 0.95}), rgba(255,255,255,${(p.o ?? 0.7) * 0.25}) 48%""", """rgba(255,255,255,${Math.min(1, (p.o ?? 0.7) * (p.blur ? 1.1 : 0.95))}), rgba(255,255,255,${(p.o ?? 0.7) * (p.blur ? 0.45 : 0.25)}) 48%"""),
])
rw('components/ServiceVisual.tsx', [
    ("seed = 0 }: { slug: string; className?: string; alt?: string; seed?: number })", "seed = 0, lite = false }: { slug: string; className?: string; alt?: string; seed?: number; lite?: boolean })"),
    ("<GlassScene variant={SERVICE_SCENE[slug] ?? 'facade'} seed={seed} />", "<GlassScene variant={SERVICE_SCENE[slug] ?? 'facade'} seed={seed} lite={lite} />"),
])
rw('components/GlassPlaceholder.tsx', [("<GlassScene variant={ORDER[index % ORDER.length]} seed={index} />", "<GlassScene variant={ORDER[index % ORDER.length]} seed={index} lite />")])

# ---------- CSS: kill the expensive stuff ----------
s = rd('index.css')
s = re.sub(r"  backdrop-filter: blur\(14px\) saturate\(1\.2\);\n  -webkit-backdrop-filter: blur\(14px\) saturate\(1\.2\);\n", "", s)
s = s.replace("background: #fff; mix-blend-mode: difference; }", "background: rgb(var(--accent)); box-shadow: 0 0 0 2px rgba(255,255,255,0.85); }")
s = s.replace("border: 1px solid #fff; mix-blend-mode: difference; color: #fff;", "border: 1px solid rgb(var(--accent)); color: rgb(var(--fg));")
s = s.replace("background: rgba(255,255,255,0.9); }", "background: rgb(var(--accent) / 0.18); border-color: rgb(var(--accent)); }")
s = s.replace("background: rgba(255,255,255,0.25); }", "background: rgb(var(--accent) / 0.1); }")
s = s.replace("  backdrop-filter: blur(6px);\n", "")
wr('index.css', s)
rw('components/Nav.tsx', [("data-[scrolled=true]:bg-ink/85 data-[scrolled=true]:backdrop-blur-md", "data-[scrolled=true]:bg-ink/95")])
rw('lib/lenis.ts', [("lerp: reducedMotion() ? 1 : 0.085,", "lerp: reducedMotion() ? 1 : 0.11,")])

# one smoothing layer only: Lenis smooths, so ScrollTrigger scrubs follow it exactly
for f in ['sections/Story.tsx', 'sections/ProcessTimeline.tsx', 'sections/MissionVision.tsx', 'pages/ProjectDetail.tsx']:
    s = rd(f); s2 = re.sub(r'scrub: 0\.\d+', 'scrub: true', s)
    if s2 != s: wr(f, s2)

# headings inside pinned sections must not own their own ScrollTrigger (nested-trigger order bug)
rw('sections/Story.tsx', [("<Split text={'THREE GENERATIONS.\\nONE STANDARD OF _EXCELLENCE._'} />", "<Split text={'THREE GENERATIONS.\\nONE STANDARD OF _EXCELLENCE._'} when=\"ready\" />")])

# Marquee: only run while visible
rw('components/Marquee.tsx', [
    ("    const tick = () => {\n      x -= 0.6 + boost", "    let on = true\n    const io = new IntersectionObserver(([e]) => (on = e.isIntersecting))\n    io.observe(root.current!)\n    const tick = () => {\n      if (!on) return\n      x -= 0.6 + boost"),
    ("      gsap.ticker.remove(tick)\n", "      gsap.ticker.remove(tick)\n      io.disconnect()\n"),
])
print('MISSES', miss)
