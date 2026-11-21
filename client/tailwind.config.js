/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`

// Semantic palette driven by CSS variables (see index.css).
// Light scope  = white page, deep-green ink.   .theme-dark scope = deep-green page, white ink.
// `white` is the foreground and `ink` the background, so utilities like text-white / bg-ink
// automatically invert inside a .theme-dark section.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        white: v('fg'),
        ink: v('bg'),
        coal: v('bg2'),
        char: v('bg3'),
        silver: v('silver'),
        mist: v('mist'),
        azure: v('accent'),
        mint: v('accent2'),
        forest: '#1d5c38',
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        wide: ['Syncopate', '"Inter Tight"', 'sans-serif'],
      },
      letterSpacing: { ultra: '0.42em' },
      transitionTimingFunction: { out: 'cubic-bezier(.16,1,.3,1)' },
    },
  },
  plugins: [],
}
