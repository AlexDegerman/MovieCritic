import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: 'src/test/setup.js',
  },
  server: {
    proxy: {
      '/api': 'https://moviecritic-103b.onrender.com'
    }
  }
})
