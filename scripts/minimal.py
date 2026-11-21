import re, glob, os
os.chdir(r'C:\Users\Dell\Desktop\AGENT\qadri-glass\client\src')
miss = []

def rd(p): return open(p, encoding='utf8').read()
def wr(p, s): open(p, 'w', encoding='utf8').write(s)

def rw(p, pairs):
    s = rd(p)
    for a, b in pairs:
        if a not in s: miss.append((p, a[:50]))
        s = s.replace(a, b)
    wr(p, s)

def rx(p, pairs):
    s = rd(p)
    for a, b in pairs:
        s, n = re.subn(a, b, s, flags=re.S)
        if n == 0: miss.append((p, 'RX ' + a[:40]))
    wr(p, s)

# ---------- CSS tokens ----------
rw('index.css', [
    ("--gutter: clamp(24px, 5.5vw, 96px);" if False else "--gutter: clamp(20px, 4.2vw, 72px);", "--gutter: clamp(24px, 5.5vw, 96px);\n  --section: clamp(96px, 11vw, 168px);"),
    (".wrap { width: 100%; max-width: 1680px;", ".wrap { width: 100%; max-width: 1360px;"),
    ("  font-size: 10px;\n  letter-spacing: 0.42em;", "  font-size: 10px;\n  letter-spacing: 0.3em;"),
    ("  line-height: 0.92;\n  letter-spacing: -0.035em;", "  line-height: 1.04;\n  letter-spacing: -0.03em;"),
    (".h-xl { font-size: clamp(2.8rem, 9.2vw, 10.5rem); }", ".h-xl { font-size: clamp(2.5rem, 7vw, 7.25rem); }"),
    (".h-lg { font-size: clamp(2.4rem, 6.4vw, 7rem); }", ".h-lg { font-size: clamp(2.1rem, 4.4vw, 4.6rem); }"),
    (".h-md { font-size: clamp(1.9rem, 4vw, 4.2rem); }", ".h-md { font-size: clamp(1.6rem, 2.8vw, 2.8rem); }\n.section { padding-block: var(--section); }"),
    (".lead { font-size: clamp(1.05rem, 1.5vw, 1.45rem); line-height: 1.55;", ".lead { font-size: clamp(1rem, 1.25vw, 1.2rem); line-height: 1.7;"),
    ("  padding: 18px 30px;", "  padding: 16px 28px;"),
    (".grain::after {", ".grain::after {\n  display: none;"),
])

# ---------- unify section padding ----------
for f in glob.glob('sections/*.tsx') + glob.glob('pages/*.tsx') + glob.glob('components/ServiceBlock.tsx'):
    s = rd(f); o = s
    s = re.sub(r'py-\[clamp\(\d+px,[\d.]+vw,\d+px\)\]', 'section', s)
    if s != o: wr(f, s)

# ---------- remove clutter ----------
rw('pages/Home.tsx', [("import SectionDots from '../components/SectionDots'\n", ""), ("      <SectionDots />\n", "")])
rw('pages/Services.tsx', [("import SectionDots from '../components/SectionDots'\n", ""), ("      <SectionDots />\n", "")])

rx('sections/Stats.tsx', [
    (r'      <div className="pointer-events-none absolute inset-x-0 top-1/2.*?</div>\n      </div>\n', ''),
    (r'            <svg className="absolute -left-6.*?</svg>\n', ''),
    (r"    q\('\[data-ring\]'\).*?\n    \}\)\n", ''),
    (r"    gsap\.fromTo\(q\('\[data-ghost\]'\).*?\n", ''),
])
rw('sections/Stats.tsx', [
    ('text-[clamp(4.5rem,13vw,13rem)] font-extralight leading-[0.9]', 'text-[clamp(3.5rem,8vw,8rem)] font-extralight leading-none'),
    ('gap-y-20 md:grid-cols-3', 'gap-y-16 md:grid-cols-3'),
    ('{ y: 40 + i * 30 }, { y: -40 - i * 30,', '{ y: 24 + i * 12 }, { y: -24 - i * 12,'),
])

rx('sections/CTA.tsx', [
    (r'      <div data-orb.*?aria-hidden="true" />\n', ''),
    (r'      <div className="mt-\[clamp\(70px,10vw,140px\)\].*?</div>\n      </div>\n', ''),
    (r"    gsap\.fromTo\(q\('\[data-orb\]'\).*?\n", ''),
    (r"  const word = .*?\n", ''),
])
rw('sections/CTA.tsx', [("text-[clamp(2.4rem,7.6vw,8.4rem)]", "text-[clamp(2.2rem,5.6vw,5.6rem)]")])

rx('sections/Hero.tsx', [
    (r'      <div\n        data-glint.*?aria-hidden="true"\n      />\n', ''),
    (r'      <div className="absolute bottom-7 right-\[var\(--gutter\)\].*?</div>\n    </section>', '    </section>'),
    (r'          <span data-rule className="block h-px w-14.*?/>\n', ''),
    (r"      const gx = gsap\.quickTo.*?\n.*?\n", ''),
    (r"        gx\(.*?\n        gy\(.*?\n", ''),
    (r"      gsap\.set\(q\('\[data-rule\]'\), \{ scaleX: 0 \}\)\n", ''),
    (r"        gsap\.to\(q\('\[data-rule\]'\).*?\n", ''),
])
rw('sections/Hero.tsx', [
    ('<div data-in className="mb-6 flex items-center gap-5 sm:mb-8">', '<div data-in className="mb-8">'),
    ('max-w-[16ch] will-change-transform', 'max-w-[14ch] will-change-transform'),
    ('mt-8 grid items-end gap-8 sm:mt-10', 'mt-10 grid items-end gap-8 sm:mt-12'),
])

rx('components/ServiceBlock.tsx', [
    (r"  const num = \(.*?\n  \)\n  const title", "  const title"),
    (r"    gsap\.fromTo\(q\('\[data-bignum\]'\).*?\n", ''),
])
rw('components/ServiceBlock.tsx', [("      {num}\n", ""), ("text-[clamp(2.3rem,6vw,6.4rem)]", "text-[clamp(2.1rem,4.4vw,4.6rem)]")])

rx('components/PageHeader.tsx', [
    (r'      <div className="pointer-events-none absolute inset-0" aria-hidden="true">.*?\n      </div>\n      <div data-copy', '      <div data-copy'),
    (r"    gsap\.to\(q\('\[data-plane\]'\).*?\n", ''),
])
rw('components/PageHeader.tsx', [("min-h-[78svh]", "min-h-[64svh]"), (" grain", "")])

rx('sections/MissionVision.tsx', [(r'      <div className="pointer-events-none absolute -right-40.*?/>\n', '')])
rw('sections/MissionVision.tsx', [
    ("text-[clamp(1.45rem,3.1vw,3.3rem)] font-extralight leading-[1.18]", "text-[clamp(1.35rem,2.5vw,2.5rem)] font-extralight leading-[1.35]"),
    ("text-[clamp(2rem,5.4vw,6rem)] leading-[1.02]", "text-[clamp(1.8rem,3.8vw,3.8rem)] leading-[1.15]"),
    ("mt-[clamp(80px,12vw,200px)]", "mt-[var(--section)]"),
])

rx('sections/Story.tsx', [
    (r'      <div\n        className="pointer-events-none absolute inset-0 opacity-70".*?/>\n', ''),
    (r'          <div className="mt-8 grid grid-cols-4 gap-3" aria-hidden="true">.*?\n          </div>\n', ''),
    (r"      gsap\.set\(q\('\[data-pane\]'\).*?\n", ''),
    (r"      tl\.to\(q\('\[data-pane\]'\).*?\n", ''),
])
rw('sections/Story.tsx', [
    ("text-[clamp(1.9rem,min(5.4vw,8.4svh),5.6rem)]", "text-[clamp(1.8rem,min(4vw,7svh),4rem)]"),
    ("text-[clamp(5rem,min(15vw,25svh),14rem)]", "text-[clamp(4rem,min(11vw,22svh),10rem)]"),
    ("lg:h-[clamp(5rem,min(16vw,28svh),15rem)]", "lg:h-[clamp(4rem,min(12vw,24svh),11rem)]"),
])

rx('components/Footer.tsx', [
    (r'      <div className="overflow-hidden" aria-hidden="true">.*?\n      </div>\n      <div className="wrap flex', '      <div className="wrap flex'),
    (r"  useMotion\(ref.*?\n  \}\)\n", ''),
])
rw('components/Footer.tsx', [
    ("import { useRef } from 'react'\n", ""),
    ("import { gsap } from '../lib/gsap'\nimport { useMotion } from '../hooks/useMotion'\n", ""),
    ("  const ref = useRef<HTMLElement>(null)\n", ""),
    ("<footer ref={ref} ", "<footer "),
    ("pb-10 pt-20", "pb-16 pt-24"),
])

rx('sections/GlassLab.tsx', [
    (r'            <div data-ui className="glass p-5">.*?\n            </div>\n(          </div>\n        </div>\n      </div>\n    </section>)', r'\1'),
    (r'              <Slider label="Light angle".*?\n', ''),
    (r"  // Illustrative readouts.*?\] as const\n\n", ''),
])
rw('sections/GlassLab.tsx', [("const [light, setLight] = useState(0.6)", "const [light] = useState(0.6)")])

rw('sections/ProjectsGallery.tsx', [
    ('                <span className="absolute left-5 top-5 font-wide text-[10px] tracking-[0.3em] text-white/80">0{i + 1}</span>\n', ''),
    ("text-[clamp(1.8rem,4.4vw,4.8rem)] leading-[0.95]", "text-[clamp(1.6rem,3vw,3rem)] leading-[1.05]"),
    ("text-[clamp(2.2rem,min(6vw,10svh),6.4rem)]", "text-[clamp(2rem,min(4.4vw,8svh),4.2rem)]"),
])
rw('sections/ServicesList.tsx', [
    ('                    <span className="eyebrow hidden sm:block">{s.kicker}</span>\n', ''),
    ("text-[clamp(1.7rem,4.2vw,4.4rem)]", "text-[clamp(1.5rem,3vw,3rem)]"),
])
print('MISSES:', miss)
