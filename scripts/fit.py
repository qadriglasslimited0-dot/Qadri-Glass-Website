import os, re
os.chdir(r'C:\Users\Dell\Desktop\AGENT\qadri-glass\client\src')
miss = []
def rw(p, pairs):
    s = open(p, encoding='utf8').read()
    for a, b in pairs:
        if a not in s: miss.append((p, a[:70]))
        s = s.replace(a, b)
    open(p, 'w', encoding='utf8').write(s)

rw('sections/Stats.tsx', [("text-[clamp(5rem,14vw,15rem)] font-extrabold leading-[0.9]", "text-[clamp(3.4rem,min(7.2vw,16svh),8rem)] font-extrabold leading-[0.95]")])
rw('sections/CTA.tsx', [("text-[clamp(2.8rem,8.4vw,9rem)]", "text-[clamp(2.4rem,5.6vw,6.2rem)]")])
rw('sections/ServicesStage.tsx', [("text-[clamp(2.2rem,4.6vw,4.8rem)]", "text-[clamp(2rem,min(3.9vw,7svh),4.2rem)]")])
rw('sections/Story.tsx', [("text-[clamp(3.5rem,min(6.6vw,20svh),8rem)]", "text-[clamp(3rem,min(5.8vw,18svh),7rem)]")])
rw('components/PageHeader.tsx', [('className="display h-xl max-w-[15ch]"', 'className="display max-w-[18ch] text-[clamp(2.6rem,min(7.4vw,13svh),8rem)]"')])
rw('sections/Hero.tsx', [("text-[clamp(2.8rem,min(9.6vw,17svh),11rem)]", "text-[clamp(2.6rem,min(8.8vw,16svh),10rem)]")])
rw('sections/MissionVision.tsx', [("text-[clamp(1.6rem,3.3vw,3.4rem)] font-semibold", "text-[clamp(1.5rem,2.9vw,3rem)] font-semibold")])
print('MISSES', miss)
