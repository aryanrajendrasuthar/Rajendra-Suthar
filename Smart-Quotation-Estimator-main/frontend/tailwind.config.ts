/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#092516",
          accent: "#5BD891",
          accent2: "#49A06F"
        }
      }
    }
  },
  plugins: []
};