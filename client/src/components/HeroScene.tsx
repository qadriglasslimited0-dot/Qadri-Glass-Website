import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { gsap, heroState, reducedMotion, whenReady } from '../lib/gsap'

const isMobile = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches
const SKY = '#f1f8f3'

/** A curved curtain-wall of light-green glass panes in satin aluminium frames. */
function Facade({ count }: { count: number }) {
  const R = 13
  const span = THREE.MathUtils.degToRad(count > 10 ? 116 : 94)
  const panels = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = (i / (count - 1) - 0.5) * span
        return { a, x: Math.sin(a) * R, z: R - Math.cos(a) * R - 4 }
      }),
    [count, span],
  )
  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#9fdcbb'),
        metalness: 0,
        roughness: 0.04,
        transparent: true,
        opacity: 0.5,
        envMapIntensity: 1.8,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        specularIntensity: 1,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [],
  )
  const frame = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8fa89a', metalness: 0.85, roughness: 0.38, envMapIntensity: 1.2 }), [])
  const H = 13
  return (
    <group position={[0, 0.2, 0]}>
      {panels.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]} rotation={[0, -p.a, 0]}>
          <mesh material={glass} renderOrder={2}>
            <boxGeometry args={[1.5, H, 0.06]} />
          </mesh>
          <mesh material={frame} position={[0.77, 0, 0]}>
            <boxGeometry args={[0.05, H + 0.2, 0.16]} />
          </mesh>
          {[-3.4, 1.9, 5.4].map((y) => (
            <mesh key={y} material={frame} position={[0, y, 0]}>
              <boxGeometry args={[1.5, 0.04, 0.12]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

/** Soft vertical bands of green behind the glass — what the panes "reflect" — gives depth without any neon. */
function Backdrop({ mobile }: { mobile: boolean }) {
  const bands = useMemo(() => {
    const cols = ['#6fbf93', '#9ad7b5', '#c6ebd6', '#4fa77b', '#b3e2c9', '#83cca3', '#dcf3e5']
    const n = mobile ? 9 : 16
    return Array.from({ length: n }, (_, i) => ({
      x: (i - n / 2) * 2.2 + 1,
      w: 1.2 + ((i * 5) % 4) * 0.5,
      h: 10 + ((i * 3) % 5) * 1.5,
      c: cols[(i * 3) % cols.length],
      o: 0.55 + ((i * 7) % 4) * 0.12,
    }))
  }, [mobile])
  return (
    <group position={[0, 0, -9]}>
      {bands.map((b, i) => (
        <mesh key={i} position={[b.x, 1, 0]}>
          <planeGeometry args={[b.w, b.h]} />
          <meshBasicMaterial color={b.c} transparent opacity={b.o} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, 3, -1]}>
        <planeGeometry args={[40, 24]} />
        <meshBasicMaterial color="#e6f4ec" />
      </mesh>
    </group>
  )
}

function Rig() {
  const intro = useRef({ v: 1 })
  const look = useRef(new THREE.Vector3(0, 0.6, 0))
  useEffect(() => {
    if (reducedMotion()) {
      intro.current.v = 0
      return
    }
    const off = whenReady(() => {
      gsap.to(intro.current, { v: 0, duration: 4, ease: 'expo.out' })
    })
    return () => {
      off()
    }
  }, [])
  useFrame(({ camera, clock }, dt) => {
    const t = clock.elapsedTime
    const calm = reducedMotion() ? 0 : 1
    const p = heroState.progress
    const k = 1 - Math.pow(0.002, dt)
    const tx = heroState.mx * 1.4 + Math.sin(t * 0.13) * 0.7 * calm
    const ty = 0.8 + heroState.my * 0.45 + Math.sin(t * 0.17) * 0.18 * calm + p * 1.2
    const tz = 15.5 - p * 8 + intro.current.v * 9
    camera.position.x += (tx - camera.position.x) * k
    camera.position.y += (ty - camera.position.y) * k
    camera.position.z += (tz - camera.position.z) * k
    look.current.set(heroState.mx * -0.5, 0.7 + p * 1.6, 0)
    camera.lookAt(look.current)
  })
  return null
}

export default function HeroScene() {
  const mobile = isMobile()
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [dpr, setDpr] = useState(mobile ? 1 : 1.25)
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={dpr}
        camera={{ position: [0, 0.8, 24], fov: mobile ? 52 : 38, near: 0.1, far: 80 }}
        gl={{ antialias: !mobile, powerPreference: 'high-performance', alpha: false, stencil: false }}
        onCreated={({ gl }) => gl.setClearColor(SKY)}
        aria-hidden="true"
      >
        <fog attach="fog" args={[SKY, 18, 46]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 10, 7]} intensity={1.6} color="#ffffff" />
        <Environment resolution={256} frames={1}>
          <color attach="background" args={['#eaf6ef']} />
          <Lightformer form="rect" intensity={5} color="#ffffff" position={[-9, 3, 4]} rotation={[0, Math.PI / 2.4, 0]} scale={[2, 16, 1]} />
          <Lightformer form="rect" intensity={3.4} color="#d6f5e4" position={[8, 2, 3]} rotation={[0, -Math.PI / 2.4, 0]} scale={[1.4, 16, 1]} />
          <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 9, 2]} rotation={[Math.PI / 2, 0, 0]} scale={[14, 3, 1]} />
          <Lightformer form="rect" intensity={1.6} color="#bfe8d0" position={[2, 1, -9]} scale={[20, 2, 1]} />
        </Environment>

        <Backdrop mobile={mobile} />
        <Facade count={mobile ? 9 : 15} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6.4, -2]}>
          <planeGeometry args={[70, 50]} />
          <meshStandardMaterial color="#dcece2" metalness={0.25} roughness={0.22} envMapIntensity={1.2} />
        </mesh>
        <Rig />
        {/* Drops render resolution automatically on slower GPUs so the hero never stutters. */}
        <PerformanceMonitor onDecline={() => setDpr(0.75)} onIncline={() => setDpr(mobile ? 1 : 1.25)} flipflops={2} />
      </Canvas>
    </div>
  )
}
