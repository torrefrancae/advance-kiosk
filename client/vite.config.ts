import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const BASE = '/sample/advance-kiosk/';

export default defineConfig({
  root: path.resolve(import.meta.dirname),
  base: BASE,
  plugins: [react()],
  resolve: {
    alias: {
      '@src': path.resolve(import.meta.dirname, 'src'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 3095,
    proxy: {
      '/sample/advance-kiosk/api': {
        target: 'http://127.0.0.1:3094',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: path.resolve(import.meta.dirname, '../backend/public/kiosk-dist'),
    emptyOutDir: true,
  },
});
