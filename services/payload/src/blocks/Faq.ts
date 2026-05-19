import type { Block } from 'payload';

import { fondField, richTextField, titreField } from './_shared';
import { thumbFaq } from './_thumbnails';

export const Faq: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ (accordéon)', plural: 'FAQ (accordéon)' },
  imageURL: thumbFaq,
  imageAltText: 'Aperçu : 3 lignes question/réponse en accordéon',
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
        richTextField({ name: 'reponse', label: 'Réponse' }),
      ],
    },
  ],
};
