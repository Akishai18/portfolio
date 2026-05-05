// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Canonical base URL — drives <link rel="canonical">, og:url, the
  // sitemap.xml endpoint, and any `new URL(...)` usage in templates.
  // Update if you ever change the production domain.
  site: 'https://akishai.com',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});