import type { Block } from 'payload';

import { fondField } from './_shared';

export const Figure: Block = {
  slug: 'figure',
  labels: { singular: 'Figure (image centrée)', plural: 'Figures' },
  fields: [
    fondField,
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    { name: 'alt', type: 'text', required: true, label: 'Description (alt)' },
    { name: 'legende', type: 'text', required: false },
    { name: 'credit', type: 'text', required: false },
    {
      name: 'taille',
      type: 'select',
      required: true,
      defaultValue: 'moyenne',
      options: [
        { label: 'Petite', value: 'petite' },
        { label: 'Moyenne', value: 'moyenne' },
        { label: 'Grande', value: 'grande' },
      ],
    },
  ],
};
