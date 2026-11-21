type Props = { variant?: 'mark' | 'full' | 'word'; className?: string; alt?: string }

const SRC = {
  mark: '/brand/qadri-mark-color.png',
  full: '/brand/qadri-logo-color.png',
  word: '/brand/qadri-wordmark-color.png',
}
const SIZE = { mark: [667, 376], full: [667, 558], word: [603, 159] } as const

export default function Logo({ variant = 'mark', className = '', alt = 'Qadri Glass' }: Props) {
  const [w, h] = SIZE[variant]
  return <img src={SRC[variant]} width={w} height={h} alt={alt} className={className} decoding="async" draggable={false} />
}
