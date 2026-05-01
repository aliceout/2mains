import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tout l'admin Payload + les API REST/GraphQL vivent sous /cms/*.
  // Le basePath Next.js s'occupe du préfixe automatiquement (URLs,
  // assets, manifest, etc.). Combiné avec routes par défaut Payload
  // (admin: '/admin', api: '/api'), on obtient bien /cms/admin et
  // /cms/api/... côté URL publique.
  basePath: '/cms',
  reactStrictMode: true,
  // Output standalone : le Dockerfile n'a qu'à copier le dossier
  // `.next/standalone` + `public/` pour avoir un runtime minimal.
  output: 'standalone',
};

export default withPayload(nextConfig);
