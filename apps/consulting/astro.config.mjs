// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://consulting.fahrenba.ch',
  output: 'static',
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    resolve: {
      alias: {
        '@site': fileURLToPath(new URL('./site.config.ts', import.meta.url)),
      },
    },
    ssr: {
      noExternal: ['@fahrenbach/ui'],
    },
  },
});
