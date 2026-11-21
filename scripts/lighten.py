import os, re
os.chdir(r'C:\Users\Dell\Desktop\AGENT\qadri-glass\client\src')
miss = []
def rw(p, pairs):
    s = open(p, encoding='utf8').read()
    for a, b in pairs:
        if a not in s: miss.append((p, a[:60]))
        s = s.replace(a, b)
    open(p, 'w', encoding='utf8').write(s)

# --- palette: everything light; "theme-dark" becomes a soft mint wash (kept for structure) ---
s = open('index.css', encoding='utf8').read()
s = re.sub(r':root \{.*?--ease-out', """:root {
  /* LIGHT — white page, fresh green */
  --bg: 255 255 255;
  --bg2: 246 251 248;
  --bg3: 229 243 235;
  --fg: 19 58 40;
  --silver: 64 98 81;
  --mist: 112 141 126;
  --accent: 46 139 87;
  --accent2: 80 176 124;
  --ease-out""", s, count=1, flags=re.S)
s = re.sub(r'\.theme-dark \{.*?\n\}', """.theme-dark {
  /* soft mint wash — still light, used for hero / footer / feature bands */
  --bg: 240 249 244;
  --bg2: 228 244 236;
  --bg3: 211 235 221;
  --fg: 19 58 40;
  --silver: 64 98 81;
  --mist: 104 135 119;
  --accent: 46 139 87;
  --accent2: 80 176 124;
  color: rgb(var(--fg));
}""", s, count=1, flags=re.S)
s = re.sub(r'\.glass \{.*?\n\}\n', """.glass {
  background: linear-gradient(135deg, rgb(255 255 255 / 0.75), rgb(255 255 255 / 0.4) 55%, rgb(var(--accent) / 0.08));
  border: 1px solid rgb(255 255 255 / 0.9);
  outline: 1px solid rgb(var(--accent) / 0.12);
  outline-offset: -2px;
  backdrop-filter: blur(14px) saturate(1.2);
  -webkit-backdrop-filter: blur(14px) saturate(1.2);
  box-shadow: 0 1px 0 rgb(255 255 255 / 0.9) inset, 0 24px 60px -28px rgb(var(--accent) / 0.35);
}
""", s, count=1, flags=re.S)
open('index.css', 'w', encoding='utf8').write(s)

# --- logo: colour versions on light backgrounds ---
rw('components/Logo.tsx', [("qadri-mark-white.png", "qadri-mark-color.png"), ("qadri-logo-white.png", "qadri-logo-color.png"), ("qadri-wordmark-white.png", "qadri-wordmark-color.png")])
rw('components/Preloader.tsx', [("/brand/qadri-mark-white.png", "/brand/qadri-mark-color.png"), ("url(/brand/qadri-mark-white.png)", "url(/brand/qadri-mark-color.png)")])
rw('components/Preloader.tsx', [("rgb(var(--accent) / 0.95) 50%", "rgba(255,255,255,0.95) 50%")])
rw('../index.html', [("qadri-mark-white.png", "qadri-mark-color.png")])

# --- misc dark leftovers ---
rw('components/ServiceVisual.tsx', [("from-[#06180f]/60 via-transparent to-[#06180f]/10", "from-[#e9f6ee]/50 via-transparent to-transparent")])
rw('components/LabScene.tsx', [
    ("args={['#0b2b1b']}", "args={['#eaf6ef']}"),
    ('color="#2c8a5c" toneMapped={false}', 'color="#cfeedd" toneMapped={false}'),
    ("'#1d5c38', '#0f3a24'", "'#a9d9bd', '#d4ecdd'"),
    ("<ambientLight intensity={0.6} />", "<ambientLight intensity={0.9} />"),
])
rw('components/LabScene.tsx', [("{ x: -1.6, c: '#ffffff', h: 3.4 }", "{ x: -1.6, c: '#2e8b57', h: 3.4 }"), ("{ x: 0, c: '#84d1ab', h: 5.4 }", "{ x: 0, c: '#1d6b44', h: 5.4 }")])
print('MISSES', miss)
