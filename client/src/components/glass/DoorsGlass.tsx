import { useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useMotion } from '../../hooks/useMotion'
import { Slab, Stage } from './kit'

/**
 * Closing section: a pair of glass doors swinging open onto light - "begin a project".
 * The doors open with scroll as the section arrives, light pours across the floor, and the whole doorway
 * keeps a slow sway; the pointer tilts it on desktop. If a contact photo is set in the admin it is what you
 * see through the doors.
 */
export default function DoorsGlass({ photo, className = '' }: { photo?: string; className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useMotion(root, ({ reduced, desktop }) => {
    const el = root.current
    if (!el) return
    const trigger = el.closest('section') ?? el
    const q = gsap.utils.selector(el)
    const scene = q('[data-scene]')[0]
    const sway = q('[data-sway]')[0]
    const L = q('[data-leaf="l"]')[0]
    const R = q('[data-leaf="r"]')[0]
    const light = q('[data-light]')[0]
    const spill = q('[data-spill]')[0]
    gsap.set(L, { transformOrigin: '0% 50%' })
    gsap.set(R, { transformOrigin: '100% 50%' })
    gsap.set(scene, { rotationX: 3, rotationY: -12 })
    if (reduced) {
      gsap.set(L, { rotationY: -52 })
      gsap.set(R, { rotationY: 52 })
      return
    }
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger, start: 'top 85%', end: 'center 45%', scrub: true } })
    tl.fromTo(L, { rotationY: 0 }, { rotationY: -58, duration: 1 }, 0)
      .fromTo(R, { rotationY: 0 }, { rotationY: 58, duration: 1 }, 0)
      .fromTo(light, { opacity: 0.25, scale: 0.9 }, { opacity: 1, scale: 1.04, duration: 1 }, 0)
      .fromTo(spill, { opacity: 0, scaleX: 0.35 }, { opacity: 1, scaleX: 1, duration: 1 }, 0.1)
      .fromTo(scene, { rotationY: -30 }, { rotationY: -12, duration: 1 }, 0)
    const amb = [
      gsap.to(sway, { rotationY: 4, duration: 7, yoyo: true, repeat: -1, ease: 'sine.inOut' }),
      gsap.fromTo(light, { filter: 'brightness(1)' }, { filter: 'brightness(1.08)', duration: 3.4, yoyo: true, repeat: -1, ease: 'sine.inOut' }),
    ]
    let off = () => {}
    if (desktop && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const ry = gsap.quickTo(el, 'rotationZ', { duration: 1.4, ease: 'power3.out' })
      const mv = (e: PointerEvent) => ry((e.clientX / window.innerWidth - 0.5) * 3)
      window.addEventListener('pointermove', mv, { passive: true })
      off = () => window.removeEventListener('pointermove', mv)
    }
    return () => {
      tl.kill()
      amb.forEach((a) => a.kill())
      off()
    }
  })

  const leaf = (side: 'l' | 'r') => (
    <Slab data={{ leaf: side }} x={side === 'l' ? 114 : 280} y={76} w={166} h={494} t={14} delay={side === 'l' ? 0 : 1.5}>
      <span aria-hidden="true" className="absolute inset-x-0 top-[52%] h-[3px] bg-white/70" />
      <span aria-hidden="true" className="absolute inset-x-0 top-[18px] h-[2px] bg-white/55" />
      <span aria-hidden="true" className={`absolute top-[44%] h-[110px] w-[7px] rounded-full bg-white/90 shadow-[0_0_0_1px_rgba(26,90,51,0.35)] ${side === 'l' ? 'right-[12px]' : 'left-[12px]'}`} />
    </Slab>
  )

  return (
    <div ref={root} className={className} aria-hidden="true">
      <Stage w={560} h={620} perspective={1700}>
        <div data-scene className="glass-scene absolute inset-0">
          <div data-sway className="glass-scene absolute inset-0">
            {/* floor shadow */}
            <div className="absolute" style={{ left: 40, top: 560, width: 480, height: 90, background: 'radial-gradient(ellipse at center, rgb(8 50 30 / 0.45), transparent 68%)', transform: 'translateZ(-20px)' }} />
            {/* light spilling out across the floor */}
            <div data-spill className="absolute" style={{ left: 114, top: 570, width: 332, height: 300, background: 'linear-gradient(180deg, rgb(255 255 255 / 0.85), rgb(190 238 214 / 0.35) 55%, transparent)', transformOrigin: '50% 0', transform: 'rotateX(90deg)', clipPath: 'polygon(0 0, 100% 0, 118% 100%, -18% 100%)' }} />
            {/* the light behind the doors */}
            <div data-light className="absolute overflow-hidden" style={{ left: 114, top: 76, width: 332, height: 494, background: 'linear-gradient(180deg, #FFFFFF 0%, #DFF6EA 45%, #A9E3C6 100%)', transform: 'translateZ(-70px)' }}>
              {photo && <img src={photo} alt="" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-90" />}
              <span className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 15%, rgb(255 255 255 / 0.85), transparent 60%)' }} />
            </div>

            {/* frame */}
            <Slab className="slab-frame" x={86} y={42} w={388} h={34} t={30} sheen={false} />
            <Slab className="slab-frame" x={86} y={76} w={28} h={500} t={30} sheen={false} />
            <Slab className="slab-frame" x={446} y={76} w={28} h={500} t={30} sheen={false} />

            {leaf('l')}
            {leaf('r')}
          </div>
        </div>
      </Stage>
    </div>
  )
}
