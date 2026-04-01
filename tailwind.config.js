/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ms-blue': 'var(--ms-blue)',
        'ms-accent': 'var(--ms-accent)',
        'ms-dark': 'var(--ms-dark)',
        'ms-navy': 'var(--ms-navy)',
        'ms-card': 'var(--ms-card)',
        'ms-green': 'var(--ms-green)',
        'ms-yellow': 'var(--ms-yellow)',
        'ms-purple': 'var(--ms-purple)',
        'ms-red': 'var(--ms-red)',
        'ms-orange': 'var(--ms-orange)',
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        dm: ['var(--font-dm-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
