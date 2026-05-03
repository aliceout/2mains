import type { Block } from 'payload';

import { couleurField, fondField, titreField } from './_shared';
import { thumbBlocValeurs } from './_thumbnails';

export const BlocValeurs: Block = {
  slug: 'valeurs',
  labels: { singular: 'Grille de valeurs', plural: 'Grilles de valeurs' },
  imageURL: thumbBlocValeurs,
  imageAltText: 'Aperçu : titre puis grille de 3 cartes-valeurs colorées',
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
