import type { Block } from 'payload';

import { couleurField, fondField, titreField } from './_shared';
import { thumbEtapes } from './_thumbnails';

export const Etapes: Block = {
  slug: 'etapes',
  labels: { singular: 'Étapes numérotées', plural: 'Étapes numérotées' },
  imageURL: thumbEtapes,
  imageAltText: 'Aperçu : 4 ronds numérotés alignés horizontalement',
  fields: [
    titreField,
    fondField,
    couleurField,
    {
      name: 'etapes',
      type: 'array',
      required: true,
      labels: { singular: 'Étape', plural: 'Étapes' },
      fields: [
        { name: 'titre', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: false },
      ],
    },
  ],
};
