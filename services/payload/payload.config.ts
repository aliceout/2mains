// Payload 3 — config principale du service `2mains-payload`.
//
// Les collections, blocks et globaux sont importés depuis ./src.
// On démarre vide en Phase 1.1 (juste users + media en built-in
// Payload), on remplit au fil des phases suivantes.

import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  // ─── Routing ────────────────────────────────────────────────
  // Les `routes` ci-dessous sont *relatives au basePath Next.js*
  // (`/cms` cf. next.config.mjs). Donc URLs publiques :
  //   admin        → /cms/admin
  //   api REST     → /cms/api
  //   graphQL      → /cms/graphql
  // Pas besoin de préfixer ici, Next.js s'en occupe via basePath.
  routes: {
    admin: '/admin',
    api: '/api',
    graphQL: '/graphql',
    graphQLPlayground: '/graphql-playground',
  },

  // ─── Admin UI ──────────────────────────────────────────────
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  // ─── Editor par défaut (rich text) ─────────────────────────
  editor: lexicalEditor(),

  // ─── DB ────────────────────────────────────────────────────
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URI ||
        `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST ?? 'localhost'}:${process.env.POSTGRES_PORT ?? 5432}/${process.env.POSTGRES_DB}`,
    },
  }),

  // ─── Collections ───────────────────────────────────────────
  // Phase 1.1 : minimum viable. On remplira en phases suivantes.
  collections: [
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email' },
      fields: [],
    },
  ],

  // ─── Globaux ───────────────────────────────────────────────
  globals: [],

  // ─── Secret pour signer les sessions ───────────────────────
  secret: process.env.PAYLOAD_SECRET || '',

  // ─── Génération automatique des types TS ───────────────────
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },

  // ─── URL serveur publique (pour les liens absolus) ─────────
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',

  // ─── CORS / CSRF ───────────────────────────────────────────
  // Astro front (qui fetch côté server) tape Payload via le
  // réseau docker interne — pas un origin browser. Mais on ouvre
  // tout de même au domaine public pour les requêtes d'admin.
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:4321',
  ].filter(Boolean),
  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:4321',
  ].filter(Boolean),
});
