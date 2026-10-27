import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// Tailwind se procesa vía PostCSS (postcss.config.mjs + src/styles/global.css).
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  // Astro 7 cambió el default a 'jsx', que elimina espacios entre elementos en línea.
  compressHTML: true,
  server: { port: 4321 },
  redirects: {
    '/membresias': '/suscripciones',
  },
});
