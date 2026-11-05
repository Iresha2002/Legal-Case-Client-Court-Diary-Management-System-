import process from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // In Docker on Windows, file change events do not reach the container,
      // so compose.dev.yaml sets VITE_USE_POLLING=true to check files on a timer.
      usePolling: process.env.VITE_USE_POLLING === 'true',
    },
  },
})