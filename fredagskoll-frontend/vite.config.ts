import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'react-vendor';
            }

            return 'vendor';
          }

          if (
            id.includes('temadagarByDate.json') ||
            id.includes('themeDayPriorityByDate.json')
          ) {
            return 'theme-day-data';
          }

          if (
            id.includes('nationalDaysByDate.json') ||
            id.includes('nationalDayNations.') ||
            id.includes('nationalDaySignificances')
          ) {
            return 'national-day-data';
          }

          if (
            id.includes('themeDayTranslations.') ||
            id.includes('celebrations.en.json') ||
            id.includes('celebrations.pt-BR.json')
          ) {
            return 'locale-data';
          }
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    css: true,
    exclude: ['tests/**', 'node_modules/**'],
  },
});
