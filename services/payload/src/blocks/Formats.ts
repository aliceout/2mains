import type { Block } from 'payload';

import { couleurField, ctaFields, fondField, richTextWithLegacy, titreField } from './_shared';
import { thumbFormats } from './_thumbnails';

export const Formats: Block = {
  slug: 'formats',
  labels: { singular: 'Formats (cartes riches)', plural: 'Formats' },
  imageURL: thumbFormats,
  imageAltText: 'Aperçu : 2 grandes cartes avec puces et bouton',
  fields: [
    titreField,
    fondField,
    {
      name: 'colonnes',
      type: 'select',
      required: true,
      defaultValue: '2',
      options: [
        { label: '2 colonnes', value: '2' },
        { label: '3 colonnes', value: '3' },
      ],
    },
    {
      name: 'formats',
      type: 'array',
      required: true,
      labels: { singular: 'Format', plural: 'Formats' },
      fields: [
        { name: 'titre', type: 'text', required: true },
        ...richTextWithLegacy({ name: 'description', label: 'Description' }),
        {
          name: 'points',
          type: 'array',
          required: false,
          labels: { singular: 'Point', plural: 'Points' },
          fields: [{ name: 'point', type: 'text', required: true }],
        },
        couleurField,
        {
          name: 'cta',
          type: 'group',
          required: false,
          fields: ctaFields,
        },
      ],
    },
  ],
};
