// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Astro ne charge pas .env pour SON PROPRE fichier de config (Vite le
// fait pour le runtime, mais la config tourne avant Vite). On charge
// manuellement via l'API Node native (≥ 20.6). En CI/Docker, ADDRESS
// est déjà dans process.env (workflow env / build-arg), donc le
// loadEnvFile silencieusement échoue et on tombe sur la valeur déjà
// présente.
try {
  process.loadEnvFile('.env');
} catch {
  // pas de .env → on s'attend à process.env déjà rempli (CI, Docker).
}

// `site:` est lu au BUILD (sitemap, RSS, URLs absolues). Doit être
// fourni via la var d'env `ADDRESS` :
//  - en dev : .env (chargé ci-dessus)
//  - en build CI : workflow l'injecte sur le step `pnpm build`
//  - en build Docker : Dockerfile.site reçoit ADDRESS en build-arg
//
// Normalisation : Infisical peut stocker la valeur sans schème (juste
// `domaine.tld`). On préfixe `https://` si absent ; les valeurs déjà
// préfixées (incl. `http://` en dev local) sont conservées.
const RAW_ADDRESS = process.env.ADDRESS;
if (!RAW_ADDRESS) {
  throw new Error(
    "ADDRESS env var manquante. Astro a besoin de l'URL publique au build " +
      '(sitemap, RSS, JSON-LD). Renseigne-la dans .env (dev) ou en build-arg (Docker).',
  );
}
const SITE = /^https?:\/\//.test(RAW_ADDRESS) ? RAW_ADDRESS : `https://${RAW_ADDRESS}`;

// Domaine public déclaré en `allowedDomains` : indispensable pour que
// le check CSRF d'Astro (security.checkOrigin) reconnaisse les POST
// venant du navigateur quand on est derrière un reverse proxy.
// Sans ça, Astro ignore les `X-Forwarded-Host` de nginx et compare le
// `Origin` du navigateur (= domaine public) avec l'upstream interne
// (= 127.0.0.1:8064), ce qui ne matche jamais → 403 "Cross-site POST
// form submissions are forbidden". Concret : le form de /gate.astro
// échouait en prod.
const SITE_URL = new URL(SITE);
const allowedDomains = [
  {
    hostname: SITE_URL.hostname,
    protocol: SITE_URL.protocol.replace(/:$/, ''),
  },
];

export default defineConfig({
  site: SITE,
  security: {
    allowedDomains,
  },
  trailingSlash: 'ignore',
  // SSR via Node : chaque requête tape Payload (réseau docker
  // interne en prod, localhost:3001 en dev). Pas de rebuild CI
  // à chaque save d'Audrey — édition instantanément visible.
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  build: {
    format: 'directory',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/admin') &&
        !page.includes('/status') &&
        !page.includes('/demo'),
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
