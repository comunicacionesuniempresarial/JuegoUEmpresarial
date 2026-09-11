import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom')) return 'vendor-react';
          if (id.includes('node_modules/react-router')) return 'vendor-router';
          if (id.includes('node_modules/@supabase')) return 'vendor-supabase';
          if (id.includes('node_modules/jspdf')) return 'vendor-pdf';
          if (id.includes('node_modules/react/')) return 'vendor-react';
        },
      },
    },
    sourcemap: false,
  },
})
