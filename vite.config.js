import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/widget.jsx'),
      name: 'FeatureRequestWidget',
      fileName: (format) => `feature-request-widget.${format}.js`,
      formats: ['umd', 'es'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'feature-request-widget.css';
          return assetInfo.name;
        },
      },
    },
  },
});
