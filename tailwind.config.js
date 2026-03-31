/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ms-blue': '#0078D4',
        'ms-accent': '#50E6FF',
        'ms-dark': '#050F1C',
        'ms-navy': '#0A1628',
        'ms-card': '#0D1F35',
        'ms-green': '#6DC947',
        'ms-yellow': '#FFB900',
        'ms-purple': '#7B68EE',
        'ms-red': '#D13438',
        'ms-orange': '#D83B01',
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        dm: ['var(--font-dm-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
