import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        portfolioHome: resolve(__dirname, 'portfolio-home.html'),
        nuveda360: resolve(__dirname, 'nuveda-360.html'),
        calf: resolve(__dirname, 'calf.html'),
        nucoach: resolve(__dirname, 'nu-coach.html'),
        phantasm: resolve(__dirname, 'phantasm.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
});
