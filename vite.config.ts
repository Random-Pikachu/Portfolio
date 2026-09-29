import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    // One entry per page type rather than a router: the photo manifest, the
    // notes and the detail sheets never load on the home page. Rollup shares
    // the React chunk between them automatically.
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        photography: resolve(__dirname, 'photography.html'),
        blog: resolve(__dirname, 'blog.html'),
        work: resolve(__dirname, 'work.html'),
      },
    },
  },
})
