import type { Block } from 'payload';

import { couleurField, fondField, linkField, richTextField, titreField } from './_shared';
import { thumbBlocCartes } from './_thumbnails';

export const BlocCartes: Block = {
  slug: 'cartes',
  labels: { singular: 'Grille de cartes', plural: 'Grilles de cartes' },
  imageURL: thumbBlocCartes,
  imageAltText: 'Aperçu : grille de 3 cartes colorées',
  fields: [
    titreField,
    fondField,
    {
      name: 'colonnes',
      type: 'select',
      required: true,
      defaultValue: '3',
      options: [
        { label: '2 colonnes', value: '2' },
        { label: '3 colonnes', value: '3' },
        { label: '4 colonnes', value: '4' },
      ],
      // Non effaçable : un select obligatoire vidé bloque la sauvegarde.
      admin: { isClearable: false },
    },
    {
      name: 'cartes',
      type: 'array',
      required: true,
      labels: { singular: 'Carte', plural: 'Cartes' },
      fields: [
        { name: 'titre', type: 'text', required: true },
        richTextField({ name: 'description', label: 'Description' }),
        linkField(),
        { name: 'cta', type: 'text', required: false, label: 'Texte du lien' },
        couleurField,
      ],
    },
  ],
};
