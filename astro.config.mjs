
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
export default defineConfig({
  output: 'server',
  integrations: [tailwind()],
  server: { port: 4321 },
});
