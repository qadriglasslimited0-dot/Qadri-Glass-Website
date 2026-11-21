import os, re
os.chdir(r'C:\Users\Dell\Desktop\AGENT\qadri-glass\client')
miss = []
def rd(p): return open(p, encoding='utf8').read()
def wr(p, s): open(p, 'w', encoding='utf8').write(s)
def rw(p, pairs):
    s = rd(p)
    for a, b in pairs:
        if a not in s: miss.append((p, a[:70]))
        s = s.replace(a, b)
    wr(p, s)
def rx(p, pairs):
    s = rd(p)
    for a, b in pairs:
        s, n = re.subn(a, b, s, flags=re.S)
        if n == 0: miss.append((p, 'RX ' + a[:50]))
    wr(p, s)

# fonts: heavier weights
rw('index.html', [("Inter+Tight:wght@200;300;400;500;600", "Inter+Tight:wght@300;400;500;600;700;800")])

# global type: heavy, tight, huge
rx('src/index.css', [
    (r"\.display \{.*?\n\}", ".display {\n  font-weight: 700;\n  line-height: 0.95;\n  letter-spacing: -0.045em;\n  text-transform: uppercase;\n}"),
    (r"\.h-xl \{[^}]*\}", ".h-xl { font-size: clamp(3.2rem, 10.5vw, 11.5rem); }"),
    (r"\.h-lg \{[^}]*\}", ".h-lg { font-size: clamp(2.6rem, 7.2vw, 7.8rem); }"),
    (r"\.h-md \{[^}]*\}", ".h-md { font-size: clamp(2rem, 4.4vw, 4.6rem); }"),
    (r"  padding: 16px 28px;", "  padding: 20px 34px;"),
])
rw('src/index.css', [(".btn-solid { background: rgb(var(--accent));", ".btn-solid { font-weight: 700; background: rgb(var(--accent));")])

# vivid green for light sections
rw('src/index.css', [
    ("  --accent: 46 139 87;\n  --accent2: 80 176 124;\n  --ease-out", "  --accent: 16 150 82;\n  --accent2: 60 190 120;\n  --ease-out"),
    ("  --bg: 38 124 80; --bg2: 46 138 92; --bg3: 30 108 69;", "  --bg: 14 143 79; --bg2: 20 158 90; --bg3: 10 120 66;"),
])

# HERO: massive headline, no competing widgets
rx('src/sections/Hero.tsx', [
    (r'      <div data-float className="pointer-events-none absolute right-.*?\n      </div>\n      <div data-float data-in className="glass absolute.*?\n      </div>\n      <div data-cue', '      <div data-cue'),
    (r'className="display max-w-\[13ch\] text-\[clamp\(2\.7rem,min\(7\.2vw,14svh\),7\.6rem\)\] will-change-transform"', 'className="display text-[clamp(2.8rem,min(9.6vw,17svh),11rem)] will-change-transform"'),
    (r"      \.to\(q\('\[data-float\]'\), \{ yPercent: -40, ease: 'none' \}, 0\)\n", ""),
])
rw('src/sections/Hero.tsx', [("import Logo from '../components/Logo'\n", "")])

# MARQUEE: loud green band
rw('src/components/Marquee.tsx', [
    ('className="overflow-hidden border-y border-[rgb(var(--fg)/0.1)] bg-ink py-8 sm:py-10"', 'className="theme-green overflow-hidden bg-ink py-7 sm:py-9"'),
    ("px-8 text-[clamp(2.6rem,7vw,7rem)] font-extralight uppercase leading-none tracking-tight ${i % 2 ? 'text-gradient' : ''}", "px-8 text-[clamp(2.8rem,8vw,8rem)] font-extrabold uppercase leading-none tracking-tighter ${i % 2 ? 'text-[rgb(var(--accent))]' : ''}"),
    ('h-3 w-3 rotate-45 bg-azure', 'h-4 w-4 rotate-45 bg-white'),
])

# STATS: solid green block, giant white numbers
rw('src/sections/Stats.tsx', [
    ('className="mesh-band relative overflow-hidden section"', 'className="theme-green relative overflow-hidden bg-ink section"'),
    ("text-gradient block text-[clamp(4rem,10vw,10.5rem)] font-light leading-none tracking-tighter tabular-nums", "block text-[clamp(5rem,14vw,15rem)] font-extrabold leading-[0.9] tracking-tighter tabular-nums"),
])
rx('src/sections/Stats.tsx', [(r"md:border-white/10", "md:border-white/30")])

# STORY marks bold
rw('src/sections/Story.tsx', [("text-gradient font-light", "text-gradient font-extrabold")])

# SERVICES titles bold
rw('src/sections/ServicesStage.tsx', [("font-light uppercase leading-[1.05] tracking-tight\">{s.title}", "font-extrabold uppercase leading-[1] tracking-tighter\">{s.title}"), ("text-[clamp(1.9rem,3.6vw,3.8rem)]", "text-[clamp(2.2rem,4.6vw,4.8rem)]")])

# MISSION: bigger, bolder
rw('src/sections/MissionVision.tsx', [
    ("text-[clamp(1.35rem,2.5vw,2.5rem)] font-extralight leading-[1.35]", "text-[clamp(1.6rem,3.3vw,3.4rem)] font-semibold leading-[1.18] tracking-tight"),
    ("text-[clamp(1.8rem,3.8vw,3.8rem)] leading-[1.15]", "text-[clamp(2.2rem,5vw,5.2rem)] leading-[1.05]"),
])

# CTA: shout
rw('src/sections/CTA.tsx', [("text-[clamp(2.4rem,6.4vw,6.6rem)]", "text-[clamp(2.8rem,8.4vw,9rem)]")])
print('MISSES', miss)
