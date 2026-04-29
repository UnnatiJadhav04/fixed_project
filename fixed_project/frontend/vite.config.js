import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// FIX: Backend runs on port 8100 (uvicorn ... --port 8100)
// Original had 8101, which meant all frontend API calls would fail with ECONNREFUSED
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://127.0.0.1:8100',
      '/users': 'http://127.0.0.1:8100',
      '/email-accounts': 'http://127.0.0.1:8100',
      '/keywords': 'http://127.0.0.1:8100',
      '/alerts': 'http://127.0.0.1:8100',
    },
  },
})
