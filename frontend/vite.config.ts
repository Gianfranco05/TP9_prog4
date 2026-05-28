import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'wielder-stir-appetite.ngrok-free.dev'
    ]
  }
})