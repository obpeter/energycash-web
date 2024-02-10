/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'

import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/energystore': {
        target: 'http://localhost:9081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/energystore/, ''),
      },
      '/cash': {
        target: 'http://localhost:9095',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cash/, ''),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
