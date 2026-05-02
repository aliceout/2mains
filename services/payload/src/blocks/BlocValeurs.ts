import type { Block } from 'payload';

import { couleurField, fondField, titreField } from './_shared';

export const BlocValeurs: Block = {
  slug: 'valeurs',
  labels: { singular: 'Grille de valeurs', plural: 'Grilles de valeurs' },
  fields: [
    titreField,
    fondField,
    {
      name: 'valeurs',
      type: 'array',
      required: true,
      labels: { singular: 'Valeur', plural: 'Valeurs' },
      fields: [
        { name: 'nom', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        couleurField,
      ],
    },
  ],
};
