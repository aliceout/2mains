import type { Block } from 'payload';

import { fondField } from './_shared';
import { thumbFigure } from './_thumbnails';

export const Figure: Block = {
  slug: 'figure',
  labels: { singular: 'Figure (image centrée)', plural: 'Figures' },
  imageURL: thumbFigure,
  imageAltText: 'Aperçu : grande image centrée avec légende dessous',
  fields: [
    fondField,
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    { name: 'alt', type: 'text', required: false, label: 'Description (alt)' },
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
