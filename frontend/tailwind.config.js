/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ircc': {
          'red': '#AF3C43',
          'blue': '#26374A',
          'gray': '#5B6A72',
          'light': '#F5F5F5'
        }
      }
    },
  },
  plugins: [],
}
