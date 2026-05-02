import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Actualites } from './collections/Actualites'
import { Evenements } from './collections/Evenements'
import { Equipe } from './collections/Equipe'
import { Temoignages } from './collections/Temoignages'
import { Partenaires } from './collections/Partenaires'
import { Documents } from './collections/Documents'
import { Site } from './globals/Site'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Admin sous /cms/admin via la file structure (src/app/cms/(payload)).
  // Routes Payload absolues — pas de basePath Next.js (ça casse les
  // chemins d'assets, cf payloadcms/payload#10534).
  routes: {
    admin: '/cms/admin',
    api: '/cms/api',
    graphQL: '/cms/graphql',
    graphQLPlayground: '/cms/graphql-playground',
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, 'app/cms/(payload)'),
      importMapFile: path.resolve(
        dirname,
        'app/cms/(payload)/admin/importMap.js',
      ),
    },
  },
  collections: [
    Pages,
    Actualites,
    Evenements,
    Equipe,
    Temoignages,
    Partenaires,
    Documents,
    Users,
    Media,
  ],
  globals: [Site],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Postgres via fields séparés (évite les problèmes d'URL-encoding
  // quand POSTGRES_PASSWORD a des caractères spéciaux).
  db: postgresAdapter({
    pool: {
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST ?? 'localhost',
      port: Number.parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
      database: process.env.POSTGRES_DB,
    },
  }),
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  sharp,
  plugins: [],
})
