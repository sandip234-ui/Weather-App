/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        exile: ['"Exile"', 'sans-serif'],
        jost: ['"Jost"', 'sans-serif'],
        kapakana: ['"Kapakana"', 'sans-serif'],
        libre: ['"Libre Baskerville"', 'serif'],
        poppins: ['"Poppins"', 'sans-serif'],
        roboto: ['"Roboto"', 'sans-serif'],
        lubrifont: ['"WDXL Lubrifont TC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}