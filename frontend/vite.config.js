import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  // GitHub Pages publishes this repository below /dental006/.
  // Keep the local development server available at http://localhost:5173/.
  base: command === 'build' ? '/dental006/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': { target: 'http://localhost:8000', changeOrigin: true } },
  },
}))
