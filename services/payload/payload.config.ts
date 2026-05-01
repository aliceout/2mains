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
  // Chemins ABSOLUS — l'admin et l'API vivent sous /cms/ via la
  // structure de fichiers `src/app/cms/(payload)/{admin,api}/...`.
  // Pas de basePath Next.js (cf. next.config.mjs) car ça casse les
  // assets Payload (issue #10534).
  routes: {
    admin: '/cms/admin',
    api: '/cms/api',
    graphQL: '/cms/graphql',
    graphQLPlayground: '/cms/graphql-playground',
  },

  // ─── Admin UI ──────────────────────────────────────────────
  admin: {
    user: 'users',
    importMap: {
      // Pointe vers le route group `(payload)` réel, pas vers la
      // racine du projet. Nécessaire depuis Payload 3.x quand
      // l'admin n'est pas à la racine.
      baseDir: path.resolve(dirname, 'src/app/cms/(payload)'),
      importMapFile: path.resolve(
        dirname,
        'src/app/cms/(payload)/admin/importMap.js',
      ),
    },
  },

  // ─── Editor par défaut (rich text) ─────────────────────────
  editor: lexicalEditor(),

  // ─── DB ────────────────────────────────────────────────────
  // On passe les fields séparément (pas de connectionString) pour
  // éviter tout problème d'URL-encoding si le password contient
  // des caractères spéciaux (@, :, /, $, etc.).
  db: postgresAdapter({
    pool: {
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST ?? 'localhost',
      port: Number.parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
      database: process.env.POSTGRES_DB,
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
