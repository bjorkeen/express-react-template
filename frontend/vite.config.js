import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; 

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, 
    strictPort: true,
    port: 3000, 
    proxy: {
      '/api': {
        target: 'http://my-app-backend:5050',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});