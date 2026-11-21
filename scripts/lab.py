import os
os.chdir(r'C:\Users\Dell\Desktop\AGENT\qadri-glass\client\src')
p = 'components/LabScene.tsx'
s = open(p, encoding='utf8').read()
old = s[s.index("  const ref = useRef<THREE.Group>(null)\n  useFrame("):s.index("  const mat = (")]
new = """  const ref = useRef<THREE.Group>(null)
  const gl = useThree((st) => st.gl)
  // drag-to-rotate (horizontal drag turns the glass; vertical still scrolls the page on touch)
  const drag = useRef({ yaw: 0, pitch: 0, down: false, x: 0, y: 0, last: 0 })
  useEffect(() => {
    const el = gl.domElement
    const d = drag.current
    const down = (e: PointerEvent) => {
      d.down = true
      d.x = e.clientX
      d.y = e.clientY
      el.setPointerCapture?.(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!d.down) return
      d.yaw += (e.clientX - d.x) * 0.012
      d.pitch = THREE.MathUtils.clamp(d.pitch + (e.clientY - d.y) * 0.006, -0.7, 0.7)
      d.x = e.clientX
      d.y = e.clientY
      d.last = performance.now()
    }
    const up = () => {
      d.down = false
    }
    el.style.cursor = 'grab'
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [gl])
  useFrame(({ pointer, clock }, dt) => {
    const g = ref.current
    if (!g) return
    const d = drag.current
    const calm = reducedMotion() ? 0 : 1
    const idle = performance.now() - d.last > 2500 && !d.down
    if (idle) d.yaw += dt * 0.25 * calm
    const ty = d.yaw + pointer.x * 0.25 + Math.sin(clock.elapsedTime * 0.4) * 0.1 * calm
    const tx = d.pitch - pointer.y * 0.18
    const k = 1 - Math.pow(0.01, dt)
    g.rotation.y += (ty - g.rotation.y) * k
    g.rotation.x += (tx - g.rotation.x) * k
  })
"""
s = s.replace(old, new)
s = s.replace("import { Canvas, useFrame } from '@react-three/fiber'", "import { Canvas, useFrame, useThree } from '@react-three/fiber'")
open(p, 'w', encoding='utf8').write(s)
print('ok')
