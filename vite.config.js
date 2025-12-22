import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/updateCacheData': 'http://localhost:3000',
      '/getWeather': 'http://localhost:3000',
      '/getCacheData': 'http://localhost:3000',
      '/getCacheDataByDestination': 'http://localhost:3000'
    }
  }
})
