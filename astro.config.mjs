// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://2mainsdefemmes.org',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-FR' },
      },
    }),
  ],
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
