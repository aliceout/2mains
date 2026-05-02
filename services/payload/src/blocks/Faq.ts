import type { Block } from 'payload';

import { fondField, titreField } from './_shared';

export const Faq: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ (accordéon)', plural: 'FAQ (accordéon)' },
  fields: [
    titreField,
    fondField,
    {
      name: 'questions',
      type: 'array',
      required: true,
      labels: { singular: 'Question', plural: 'Questions' },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'reponse', type: 'textarea', required: true },
      ],
    },
  ],
};
