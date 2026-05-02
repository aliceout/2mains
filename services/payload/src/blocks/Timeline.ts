import type { Block } from 'payload';

import { fondField, titreField } from './_shared';

export const Timeline: Block = {
  slug: 'timeline',
  labels: { singular: 'Timeline', plural: 'Timelines' },
  fields: [
    titreField,
    fondField,
    {
      name: 'alignement',
      type: 'select',
      required: true,
      defaultValue: 'vertical',
      options: [
        { label: 'Vertical (toutes étapes à gauche)', value: 'vertical' },
        { label: 'Alterné (zigzag desktop)', value: 'alterne' },
      ],
    },
    {
      name: 'etapes',
      type: 'array',
      required: true,
      labels: { singular: 'Étape', plural: 'Étapes' },
      fields: [
        { name: 'date', type: 'text', required: true, admin: { description: 'Ex: 2024, Mars 2025, 15 juin…' } },
        { name: 'titre', type: 'text', required: true },
        { name: 'texte', type: 'textarea', required: false },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        { name: 'image_alt', type: 'text', required: false },
      ],
    },
  ],
};
