const SITE = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ?? ''

type Props = { title: string; description: string; path?: string; image?: string; jsonLd?: object }

/** React 19 hoists <title>/<meta>/<link> into <head>. */
export default function Seo({ title, description, path = '', image = '/brand/og-image.png', jsonLd }: Props) {
  const full = title.includes('Qadri Glass') ? title : `${title} — Qadri Glass`
  const url = SITE + path
  const img = image.startsWith('http') ? image : SITE + image
  return (
    <>
      <title>{full}</title>
      <meta name="description" content={description} />
      {SITE && <link rel="canonical" href={url} />}
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      {SITE && <meta property="og:url" content={url} />}
      <meta property="og:image" content={img} />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </>
  )
}
