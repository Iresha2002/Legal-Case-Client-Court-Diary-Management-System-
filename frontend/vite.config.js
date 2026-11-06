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
    // The browser calls /api on the frontend's own address and Vite forwards it to the
    // backend, so there are no CORS problems in development. Docker sets the backend address.
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET ?? 'http://localhost:8080',
        // The browser sees a same-origin request, so drop its Origin header; otherwise the
        // backend's CORS check rejects addresses like http://127.0.0.1:5174 with 403.
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyRequest) => proxyRequest.removeHeader('origin'));
        },
      },
    },
  },
})