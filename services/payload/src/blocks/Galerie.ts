import type { Block } from 'payload';

import { fondField, titreField } from './_shared';

export const Galerie: Block = {
  slug: 'galerie',
  labels: { singular: 'Galerie', plural: 'Galeries' },
  fields: [
    titreField,
    fondField,
    {
      name: 'colonnes',
      type: 'select',
      required: true,
      defaultValue: '3',
      options: [
        { label: '2 colonnes', value: '2' },
        { label: '3 colonnes', value: '3' },
        { label: '4 colonnes', value: '4' },
      ],
    },
    {
      name: 'lightbox',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: "Active l'ouverture en plein écran au clic.",
      },
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      labels: { singular: 'Image', plural: 'Images' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        { name: 'alt', type: 'text', required: true, label: 'Description (alt)' },
        { name: 'legende', type: 'text', required: false },
      ],
    },
  ],
};
