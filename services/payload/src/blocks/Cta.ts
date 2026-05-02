import type { Block } from 'payload';

import { ctaFields, fondField } from './_shared';

export const Cta: Block = {
  slug: 'cta',
  labels: { singular: 'Bandeau CTA', plural: 'Bandeaux CTA' },
  fields: [
    fondField,
    { name: 'titre', type: 'text', required: true },
    { name: 'corps', type: 'textarea', required: false },
    {
      name: 'cta_primaire',
      type: 'group',
      required: false,
      fields: ctaFields,
    },
    {
      name: 'cta_secondaire',
      type: 'group',
      required: false,
      fields: ctaFields,
    },
  ],
};
