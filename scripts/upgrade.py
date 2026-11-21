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

# ---- ServicesStage: DOM order (visual first) and drop global order classes ----
s = rd('sections/ServicesStage.tsx')
m = re.search(r'(              <div data-s .*?\n              </div>\n)(              <div data-v .*?\n              </div>\n)', s, flags=re.S)
if m:
    s = s.replace(m.group(0), m.group(2) + m.group(1))
else:
    miss.append(('ServicesStage', 'reorder'))
s = s.replace('order-2 flex flex-col', 'flex flex-col').replace('order-1 aspect-[4/3]', 'aspect-[4/3]')
wr('sections/ServicesStage.tsx', s)

# ---- CSS: bigger bolder type, texture helpers ----
rw('index.css', [
    ("--section: clamp(96px, 11vw, 168px);", "--section: clamp(104px, 12vw, 190px);"),
    (".h-xl { font-size: clamp(2.5rem, 7vw, 7.25rem); }", ".h-xl { font-size: clamp(2.9rem, 8.6vw, 9rem); }"),
    (".h-lg { font-size: clamp(2.1rem, 4.4vw, 4.6rem); }", ".h-lg { font-size: clamp(2.3rem, 6vw, 6.2rem); }"),
    (".h-md { font-size: clamp(1.6rem, 2.8vw, 2.8rem); }", ".h-md { font-size: clamp(1.8rem, 3.6vw, 3.6rem); }"),
])
open('index.css', 'a', encoding='utf8').write("""
/* Visual helpers */
.text-gradient { background: linear-gradient(110deg, rgb(var(--fg)) 0%, rgb(var(--accent)) 55%, rgb(var(--accent2)) 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.mesh-band {
  background:
    radial-gradient(50% 60% at 10% 0%, rgb(var(--accent2) / 0.22), transparent 70%),
    radial-gradient(45% 55% at 95% 100%, rgb(var(--accent) / 0.16), transparent 70%),
    linear-gradient(180deg, rgb(var(--bg)), rgb(var(--bg2)));
}
@keyframes glint-sweep { 0% { transform: translateX(-130%) skewX(-18deg); } 55%, 100% { transform: translateX(260%) skewX(-18deg); } }
.glint { overflow: hidden; }
.glint::before { content: ''; position: absolute; top: 0; bottom: 0; width: 36%; left: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent); animation: glint-sweep 7s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .glint::before { animation: none; opacity: 0; } }
""")

# ---- Story marks: solid gradient type instead of thin outline ----
rw('sections/Story.tsx', [("outline-text font-extralight", "text-gradient font-light")])
# ---- Stats: bolder + mesh band ----
rw('sections/Stats.tsx', [
    ('className="relative overflow-hidden bg-ink section"', 'className="mesh-band relative overflow-hidden section"'),
    ("block text-[clamp(3.5rem,8vw,8rem)] font-extralight leading-none tracking-tighter tabular-nums", "text-gradient block text-[clamp(4rem,10vw,10.5rem)] font-light leading-none tracking-tighter tabular-nums"),
])

# ---- Home composition ----
rw('pages/Home.tsx', [
    ("import ServicesList from '../sections/ServicesList'", "import ServicesStage from '../sections/ServicesStage'\nimport Marquee from '../components/Marquee'"),
    ("      <Story />\n      <Stats />\n      <ServicesList />", "      <Marquee />\n      <Story />\n      <Stats />\n      <ServicesStage />"),
])
print('MISSES', miss)
