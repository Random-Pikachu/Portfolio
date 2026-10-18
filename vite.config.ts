import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    // One entry now. Every route is prerendered from it by scripts/prerender.mjs.
    rollupOptions: { input: { main: resolve(__dirname, 'index.html') } },
  },
})
