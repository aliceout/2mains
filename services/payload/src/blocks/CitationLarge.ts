import type { Block } from 'payload';

import { fondField } from './_shared';

export const CitationLarge: Block = {
  slug: 'citation-large',
  labels: {
    singular: 'Citation pleine largeur',
    plural: 'Citations pleine largeur',
  },
  fields: [
    fondField,
    { name: 'citation', type: 'textarea', required: true },
    { name: 'auteur', type: 'text', required: false },
    { name: 'role', type: 'text', required: false },
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'paper',
      options: [
        { label: 'Orange', value: 'orange' },
        { label: 'Violet', value: 'violet' },
        { label: 'Beige', value: 'beige' },
        { label: 'Paper', value: 'paper' },
      ],
    },
  ],
};
