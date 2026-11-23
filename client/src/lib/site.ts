/**
 * The public address of the website, used for canonical links, Open Graph and structured data.
 * It is fixed in code on purpose: an environment variable that disagrees with the domain's real primary host
 * (for example the bare domain while the site is served from www) would make every canonical tag point at a
 * redirect. qadriglass.com redirects to www.qadriglass.com, so www is the canonical host.
 * Change it here and in scripts/seo-data.mjs if the primary host ever changes.
 */
export const SITE_URL = 'https://www.qadriglass.com'
