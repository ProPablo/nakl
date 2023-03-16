/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: '#BBB7CD',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'lavender': '#D5D3DF',
      'french-gray': '#BBB7CD',
      'french-gray-lite': '#CCCAD7',
      'ultra-violet': '#5F588B',
      'dim-gray': '#6A6264',
      'white': '#fff',
      'black': '#71686B',
      'wisteria': '#A49CCD',
      'maize-crayola': '#F7C546',
    },
  },
  plugins: [
    require("daisyui"),
  ]

}