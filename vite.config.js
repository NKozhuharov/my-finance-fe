import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      '@api': path.resolve('./src/api'),
      '@components': path.resolve('./src/components'),
      '@contexts': path.resolve('./src/contexts'),
      '@hooks': path.resolve('./src/hooks'),
      '@providers': path.resolve('./src/providers'),
      '@layouts': path.resolve('./src/layouts'),
      '@utils': path.resolve('./src/utils'),
    }
  }
})
