import type { Block } from 'payload';

import { fondField, titreField } from './_shared';

export const StatMajeste: Block = {
  slug: 'stat-majeste',
  labels: { singular: 'Statistique en majesté', plural: 'Stats en majesté' },
  fields: [
    titreField,
    fondField,
    {
      name: 'chiffre',
      type: 'text',
      required: true,
      admin: { description: 'Court : 90 %, 1/3, ×4…' },
    },
    {
      name: 'texte',
      type: 'textarea',
      label: 'Texte explicatif',
      required: true,
      admin: {
        description:
          'Une à deux phrases. *italique* pour mettre en valeur un chiffre secondaire.',
      },
    },
    { name: 'source', type: 'text', required: false },
    { name: 'eyebrow', type: 'text', defaultValue: '— constat' },
    {
      name: 'variant',
      type: 'select',
      label: 'Couleur du chiffre',
      required: true,
      defaultValue: 'orange',
      options: [
        { label: 'Orange', value: 'orange' },
        { label: 'Violet', value: 'violet' },
      ],
    },
  ],
};
