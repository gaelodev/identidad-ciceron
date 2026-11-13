// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

export default defineConfig({
  integrations: [vue()],
  // Listo para añadir inglés: agrega 'en' a locales y crea src/pages/en/.
  i18n: { defaultLocale: 'es', locales: ['es'], routing: { prefixDefaultLocale: false } },
  build: { format: 'directory' },
});
