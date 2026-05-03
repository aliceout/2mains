import type { Block } from 'payload';

import { fondField } from './_shared';
import { thumbCitation } from './_thumbnails';

export const Citation: Block = {
  slug: 'citation',
  labels: { singular: 'Citation (carte)', plural: 'Citations (carte)' },
  imageURL: thumbCitation,
  imageAltText: 'Aperçu : guillemets avec citation et nom',
  fields: [
    fondField,
    { name: 'citation', type: 'textarea', required: true },
    { name: 'auteur', type: 'text', required: true },
    { name: 'role', type: 'text', required: false },
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'beige',
      options: [
        { label: 'Beige', value: 'beige' },
        { label: 'Violet', value: 'violet' },
        { label: 'Paper', value: 'paper' },
      ],
    },
    {
      name: 'fictif',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Marque la citation comme fictive (badge « À valider » côté site).',
      },
    },
  ],
};
