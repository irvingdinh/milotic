// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';

export default defineConfig({
  integrations: [preact()],
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
});