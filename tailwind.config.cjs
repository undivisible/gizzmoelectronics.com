/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,svelte,ts,js}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Instrument Sans', 'Chivo', 'system-ui', 'sans-serif']
      },
      colors: {
        surface: '#0b0b0b'
      }
    }
  },
  plugins: []
};
