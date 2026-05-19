import type { Block } from 'payload';

import { couleurField, fondField, richTextWithLegacy, titreField } from './_shared';
import { thumbChiffreDetail } from './_thumbnails';

export const ChiffreDetail: Block = {
  slug: 'chiffre-detail',
  labels: { singular: 'Chiffre + explication', plural: 'Chiffres + explication' },
  imageURL: thumbChiffreDetail,
  imageAltText: 'Aperçu : un chiffre à gauche, texte d\'explication à droite',
  fields: [
    titreField,
    fondField,
    {
      name: 'chiffre',
      type: 'text',
      required: true,
      admin: { description: 'Ex: 90 %, 1/3, 7 M+' },
    },
    ...richTextWithLegacy({ name: 'texte', label: 'Explication' }),
    { name: 'source', type: 'text', required: false },
    {
      name: 'alignement',
      type: 'select',
      required: true,
      defaultValue: 'gauche',
      options: [
        { label: 'Gauche', value: 'gauche' },
        { label: 'Droite', value: 'droite' },
      ],
    },
    couleurField,
  ],
};
