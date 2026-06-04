import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    //config tránh CROS trong Vite
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000', //tùy đổi theo cổng của DB
          changeOrigin: true,
          secure: false
        }
      }
    }
  },
})
