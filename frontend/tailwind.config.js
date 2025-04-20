export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#4CAF50',
          600: '#3f9142',
          700: '#2f6f34',
          800: '#27562a',
          900: '#1a3a1c',
        },
      },
    },
  },
  plugins: [],
}