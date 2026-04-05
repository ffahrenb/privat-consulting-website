// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://psychologie.fahrenba.ch',
  output: 'static',
  integrations: [sitemap()],
});
