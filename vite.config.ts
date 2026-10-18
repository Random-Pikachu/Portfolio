import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    // Two entries rather than a router: the 27-photo manifest and the gallery
    // never load on the home page, and the home page bundle stays router-free.
    // Rollup shares the React chunk between them automatically.
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        photography: resolve(__dirname, 'photography.html'),
        // Phase 1 lab. Noindex, and dropped from the build before launch.
        lab: resolve(__dirname, 'lab.html'),
      },
    },
  },
})
