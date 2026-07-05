/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mapping your design system colors to Tailwind
        'medical-blue': '#003c90',
        'surface-bg': '#f7f9fb',
      },
      borderRadius: {
        'xl': '1.5rem', // From your 'xl' design spec
      }
    },
  },
  plugins: [],
}