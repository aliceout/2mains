import type { Block } from 'payload';

import { fondField, titreField } from './_shared';
import { thumbEquipe } from './_thumbnails';

export const Equipe: Block = {
  slug: 'equipe',
  labels: {
    singular: 'Notre équipe (trombi CA)',
    plural: 'Trombis équipe',
  },
  imageURL: thumbEquipe,
  imageAltText: 'Aperçu : trombinoscope avec 7 portraits sur 2 lignes',
  fields: [
    {
      ...titreField,
      defaultValue: 'Notre équipe',
    },
    fondField,
    {
      name: 'intro',
      type: 'textarea',
      required: false,
      label: 'Texte introductif (optionnel)',
    },
    {
      name: 'forme',
      type: 'select',
      required: true,
      defaultValue: 'rond',
      options: [
        { label: 'Rond', value: 'rond' },
        { label: 'Carré', value: 'carre' },
      ],
    },
    {
      name: 'colonnes',
      type: 'select',
      required: true,
      defaultValue: '4',
      options: [
        { label: '2 colonnes', value: '2' },
        { label: '3 colonnes', value: '3' },
        { label: '4 colonnes', value: '4' },
      ],
    },
    {
      name: 'ids',
      type: 'relationship',
      relationTo: 'equipe',
      hasMany: true,
      required: false,
      label: 'Filtrer par membres (optionnel)',
      admin: {
        description:
          'Laisse vide pour afficher tous les membres. Sinon sélectionne ' +
          'ceux que tu veux afficher dans la liste déroulante.',
      },
    },
  ],
};
