/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#245C45',
          dark: '#1C4936',
          light: '#2D7256',
        },
        secondary: {
          DEFAULT: '#8BAF99',
          light: '#A3C1AF',
          dark: '#739D83',
        },
        background: '#F7F8F5',
        surface: '#FFFFFF',
        text: {
          main: '#202923',
          secondary: '#778078',
        },
        border: '#E5E9E5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 2px 4px 0 rgba(36, 92, 69, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        card: '0.5rem',
      },
    },
  },
  plugins: [],
}
