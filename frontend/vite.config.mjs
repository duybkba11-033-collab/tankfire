import { defineConfig } from 'vite';

const backendTarget = process.env.VITE_PROXY_TARGET || 'http://127.0.0.1:3001';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: backendTarget,
        changeOrigin: true
      },
      '/socket.io': {
        target: backendTarget,
        changeOrigin: true,
        ws: true
      }
    }
  }
});
