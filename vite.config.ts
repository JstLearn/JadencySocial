import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('three')) return 'three-vendor';
          if (id.includes('@react-three')) return 'r3f-vendor';
          if (id.includes('gsap')) return 'gsap-vendor';
          if (id.includes('i18next') || id.includes('react-i18next')) return 'i18n-vendor';
          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
