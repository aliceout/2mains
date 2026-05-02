import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // On reste en mode non-standalone : on a besoin du CLI payload + des
  // migrations + de la config source au runtime pour `payload migrate`
  // au boot du container. Le standalone trace ce qui est importé par
  // server.js mais pas le CLI bin/, donc on ne peut pas appliquer les
  // migrations en prod si on bundle minimal. ~300MB de plus en image,
  // OK pour ce projet.
  images: {
    localPatterns: [
      {
        pathname: '/cms/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
