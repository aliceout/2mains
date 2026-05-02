import type { Block } from 'payload';

import { fondField, titreField } from './_shared';

export const Equipe: Block = {
  slug: 'equipe',
  labels: {
    singular: 'Notre équipe (trombi CA)',
    plural: 'Trombis équipe',
  },
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
      type: 'array',
      required: false,
      label: 'Filtrer par membres (optionnel)',
      admin: {
        description:
          'Laisse vide pour afficher tous. Sinon liste les slugs (ex: audrey-relandeau).',
      },
      fields: [{ name: 'slug', type: 'text', required: true }],
    },
  ],
};
