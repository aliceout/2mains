import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

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
  upload: true,
}
