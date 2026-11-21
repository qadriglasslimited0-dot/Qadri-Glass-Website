import GlassScene, { type SceneVariant } from './GlassScene'

const ORDER: SceneVariant[] = ['facade', 'slab', 'frame', 'ring', 'fluted']

/** Clearly-labelled stand-in for genuine photography: abstract glass visual + a "pending" tag. */
export default function GlassPlaceholder({
  label = 'Photography pending',
  index = 0,
  className = '',
}: {
  label?: string
  index?: number
  className?: string
}) {
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} role="img" aria-label={label}>
      <GlassScene variant={ORDER[index % ORDER.length]} seed={index} lite />
      <span className="absolute bottom-4 left-4 border border-white/80 bg-white/70 px-3 py-1.5 font-wide text-[8px] uppercase tracking-[0.3em] text-mist">
        {label}
      </span>
    </div>
  )
}
