import { Component, type ReactNode } from 'react'

export function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return Boolean(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

/** Catches WebGL/Three runtime errors and shows a graceful static fallback. */
export class WebGLBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err: unknown) {
    console.warn('WebGL disabled:', err)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/** Soft gradient shown when WebGL is unavailable or while the 3D chunk loads. */
export function GlassFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(60% 70% at 70% 30%, rgb(var(--accent) / 0.22), transparent 60%), repeating-linear-gradient(100deg, rgb(var(--fg) / 0.045) 0 1px, transparent 1px 110px), linear-gradient(180deg, rgb(var(--bg2)), rgb(var(--bg)))',
      }}
    />
  )
}
