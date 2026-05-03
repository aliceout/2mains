import type { Block } from 'payload';

import { fondField, titreField } from './_shared';
import { thumbGalerie } from './_thumbnails';

export const Galerie: Block = {
  slug: 'galerie',
  labels: { singular: 'Galerie', plural: 'Galeries' },
  imageURL: thumbGalerie,
  imageAltText: 'Aperçu : grille de 6 photos en mosaïque',
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
    },
    {
      name: 'lightbox',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: "Active l'ouverture en plein écran au clic.",
      },
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      labels: { singular: 'Image', plural: 'Images' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        { name: 'alt', type: 'text', required: false, label: 'Description (alt)' },
        { name: 'legende', type: 'text', required: false },
      ],
    },
  ],
};
