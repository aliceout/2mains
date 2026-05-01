import { withPayload } from '@payloadcms/next/withPayload';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // PAS de basePath ici : avec Payload 3.84+, basePath casse les
  // chemins d'assets (issue payloadcms/payload#10534). On sert
  // l'admin sous /cms/admin en mettant le route group dans
  //   src/app/cms/(payload)/...
  // et en déclarant des routes absolues côté payload.config.ts.
  reactStrictMode: true,
  // Output standalone : le Dockerfile n'a qu'à copier le dossier
  // `.next/standalone` + `public/` pour avoir un runtime minimal.
  output: 'standalone',
  // Le repo a un pnpm-lock.yaml racine (Astro) ET un package-lock.json
  // dans services/payload (npm). Sans ça, Turbopack remonte au repo
  // racine et déclenche un warning ; on ancre explicitement.
  turbopack: {
    root: dirname,
  },
};

export default withPayload(nextConfig);
