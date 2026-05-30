import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'capacitor-vendor': ['@capacitor/core', '@capacitor/app', '@capacitor/browser'],
        },
      },
    },
  },
  server: {
    // Standardize on Vite's default port to avoid “wrong server” confusion.
    // If 5173 is taken, Vite will fail (strictPort) so you *know* you're not on the wrong port.
    port: 5173,
    strictPort: true,
    open: true,
  },
});
