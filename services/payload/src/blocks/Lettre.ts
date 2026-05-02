import type { Block } from 'payload';

import { fondField, titreField } from './_shared';

export const Lettre: Block = {
  slug: 'lettre',
  labels: { singular: 'Lettre adressée', plural: 'Lettres adressées' },
  fields: [
    titreField,
    fondField,
    {
      name: 'ouverture',
      type: 'text',
      defaultValue: 'Bonjour,',
      admin: { description: 'Première ligne, en italique.' },
    },
    {
      name: 'corps',
      type: 'textarea',
      label: 'Corps de la lettre',
      required: true,
      admin: {
        description:
          "Plusieurs paragraphes (séparés par lignes vides). *italique* pour l'accent.",
      },
    },
    {
      name: 'signature',
      type: 'text',
      defaultValue: "— l'équipe.",
    },
    {
      name: 'variant',
      type: 'select',
      label: "Couleur d'accent",
      required: true,
      defaultValue: 'orange',
      options: [
        { label: 'Orange', value: 'orange' },
        { label: 'Violet', value: 'violet' },
      ],
    },
  ],
};
