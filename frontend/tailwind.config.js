/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#E65C00', light: '#FF8C00', dark: '#B34500' },
        accent: { DEFAULT: '#22c55e', dark: '#16a34a' },
      },
      fontFamily: { sans: ['Inter','system-ui','sans-serif'], display: ['Rajdhani','sans-serif'] },
    },
  },
  plugins: [],
};
