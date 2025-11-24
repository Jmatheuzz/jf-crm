/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'background-default': '#003636',
        'background-paper': '#004b49',
        'text-primary': '#ffffff',
        'text-secondary': '#f0f0f0',
        'primary-main': '#00a86b',
        'primary-dark': '#008756',
      }
    },
  },
  plugins: [],
}
