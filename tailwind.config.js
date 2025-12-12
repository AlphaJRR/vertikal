/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        vertikal: {
          black: '#000000',
          gold: '#FFD700',
          surface: '#121212',
          primary: '#3B82F6',
          purple: '#9333EA',
        }
      }
    },
  },
  plugins: [],
}

