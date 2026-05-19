import type { Block } from 'payload';

import { fondField, richTextField } from './_shared';
import { thumbCitationLarge } from './_thumbnails';

export const CitationLarge: Block = {
  slug: 'citation-large',
  labels: {
    singular: 'Citation pleine largeur',
    plural: 'Citations pleine largeur',
  },
  imageURL: thumbCitationLarge,
  imageAltText: 'Aperçu : grands guillemets, citation large, attribution',
  fields: [
    fondField,
    richTextField({ name: 'citation', label: 'Citation' }),
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
