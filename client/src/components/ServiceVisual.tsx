import { useState } from 'react'
import { useSite } from '../lib/api'
import GlassScene, { type SceneVariant } from './GlassScene'

export const SERVICE_SCENE: Record<string, SceneVariant> = {
  'architectural-glass': 'facade',
  'custom-fabrication': 'slab',
  'professional-installation': 'frame',
  'decorative-solutions': 'fluted',
}

/** Service photo (public/images/services/<slug>.jpg) when available, otherwise the abstract glass scene. */
export default function ServiceVisual({ slug, className = '', alt = '', seed = 0, lite = false }: { slug: string; className?: string; alt?: string; seed?: number; lite?: boolean }) {
  const [photo, setPhoto] = useState<'loading' | 'ok' | 'none'>('loading')
  const { site } = useSite()
  const src = site[`image.service.${slug}`] || `/images/services/${slug}.jpg`
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {photo !== 'ok' && <GlassScene variant={SERVICE_SCENE[slug] ?? 'facade'} seed={seed} lite={lite} />}
      {photo !== 'none' && (
        <img
          key={src}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setPhoto('ok')}
          onError={() => setPhoto('none')}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${photo === 'ok' ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  )
}
