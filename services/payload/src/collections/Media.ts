import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { compressPdf } from '../lib/compress-pdf'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Média', plural: 'Médias' },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'nom',
    defaultColumns: ['nom', 'alt', 'filename', 'mimeType'],
    listSearchableFields: ['nom', 'alt', 'filename'],
  },
  fields: [
    {
      name: 'nom',
      type: 'text',
      required: true,
      label: 'Nom',
      admin: {
        description:
          "Nom court qui identifie le média dans la bibliothèque (ex: « Portrait Audrey 2024 »).",
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Texte alternatif',
      admin: {
        description:
          "Description de l'image pour l'accessibilité (lecteurs d'écran) et le SEO.",
      },
    },
  ],
  hooks: {
    // PDF volumineux : recompression à 200 DPI, on ne garde que la version
    // réduite (cf. lib/compress-pdf). Les images, elles, sont gérées par
    // `upload.resizeOptions`/`formatOptions` ci-dessous (sharp).
    beforeOperation: [
      async ({ args, operation, req }) => {
        const file = req.file
        if (
          (operation === 'create' || operation === 'update') &&
          file?.mimetype === 'application/pdf'
        ) {
          const smaller = await compressPdf(file.data)
          if (smaller) {
            file.data = smaller
            file.size = smaller.length
          }
        }
        return args
      },
    ],
  },
  // Compression des images à l'upload : on ne stocke QUE la version réduite.
  // Bridées à 2000px de large (jamais agrandies) + webp q80 — gros gain de
  // poids, invisible à l'écran. Les PDF passent à travers (gérés par le hook).
  // ponytail: webp global ; un SVG serait rasterisé — OK pour des logos
  // affichés à taille fixe. Ajouter une exclusion par mimeType si ça gêne.
  upload: {
    resizeOptions: { width: 2000, fit: 'inside', withoutEnlargement: true },
    formatOptions: { format: 'webp', options: { quality: 80 } },
  },
}
