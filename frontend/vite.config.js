import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // If you're using React

export default defineConfig({
  plugins: [
    react() // If you're using React
  ],
})