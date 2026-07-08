/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#023e8a',
          light: '#0077b6',
          dark: '#03045e',
        },
        accent: {
          DEFAULT: '#00b4d8',
          light: '#90e0ef',
          dark: '#0096c7',
        },
        midnight: {
          DEFAULT: '#0f172a',
          lighter: '#1e293b',
        }
      }
    },
  },
  plugins: [],
}
