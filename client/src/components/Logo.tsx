type Props = { variant?: 'mark' | 'full' | 'word'; tone?: 'color' | 'white'; className?: string; alt?: string }

// Official logo files, untouched. "white" is the supplied reversed version for dark backgrounds.
const SRC = {
  color: {
    mark: '/brand/qadri-mark-color.png',
    full: '/brand/qadri-logo-color.png',
    word: '/brand/qadri-wordmark-color.png',
  },
  white: {
    mark: '/brand/qadri-mark-white.png',
    full: '/brand/qadri-logo-white.png',
    word: '/brand/qadri-wordmark-white.png',
  },
}
const SIZE = { mark: [667, 376], full: [667, 558], word: [603, 159] } as const

export default function Logo({ variant = 'mark', tone = 'color', className = '', alt = 'Qadri Glass' }: Props) {
  const [w, h] = SIZE[variant]
  return <img src={SRC[tone][variant]} width={w} height={h} alt={alt} className={className} decoding="async" draggable={false} />
}
