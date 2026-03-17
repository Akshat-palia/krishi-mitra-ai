/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
  fontFamily: {
    sans: ["Inter", "sans-serif"],
    hindi: ["Noto Serif Devanagari", "serif"],
  },
},
  },
  plugins: [],
}
