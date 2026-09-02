/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  important: "#root",
  corePlugins: {
    preflight: false,
    container: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}