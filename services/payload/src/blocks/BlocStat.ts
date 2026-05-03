import type { Block } from 'payload';

import { fondField, titreField } from './_shared';
import { thumbBlocStat } from './_thumbnails';

export const BlocStat: Block = {
  slug: 'stats',
  labels: { singular: 'Bandeau de chiffres', plural: 'Bandeaux de chiffres' },
  imageURL: thumbBlocStat,
  imageAltText: 'Aperçu : bandeau avec 4 chiffres-clés alignés',
  fields: [
    titreField,
    fondField,
    {
      name: 'intro',
      type: 'textarea',
      required: false,
      label: 'Texte introductif (optionnel)',
    },
    {
      name: 'stats',
      type: 'array',
      required: true,
      labels: { singular: 'Stat', plural: 'Stats' },
      fields: [
        { name: 'valeur', type: 'text', required: true },
        { name: 'legende', type: 'text', required: true },
        { name: 'source', type: 'text', required: false },
      ],
    },
  ],
};
