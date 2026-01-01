/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#020916',
        accent: {
          DEFAULT: '#70FF00',
          600: '#0fea00'
        }
      },
      fontFamily: {
        dmsans: ['DM Sans', 'sans-serif']
      },
      boxShadow: {
        'inner-light': 'inset 0 2px 0 0 rgba(255,255,255,0.15)',
        'inner-light-sm': 'inset 0 1px 0 0 rgba(255,255,255,0.15)',
      }
    },
  },
  plugins: [],
}
