import type { Block } from 'payload';

import { fondField, titreField } from './_shared';
import { thumbDeuxColonnes } from './_thumbnails';

export const DeuxColonnes: Block = {
  slug: 'deux-colonnes',
  labels: {
    singular: 'Deux colonnes (texte + picto/image)',
    plural: 'Blocs deux colonnes',
  },
  imageURL: thumbDeuxColonnes,
  imageAltText: 'Aperçu : deux colonnes parallèles avec picto et texte',
  fields: [
    titreField,
    fondField,
    {
      name: 'inverse',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Inverse l\'ordre (image à gauche, texte à droite).' },
    },
    {
      name: 'texte',
      type: 'textarea',
      required: true,
      label: 'Texte (Markdown)',
    },
    {
      name: 'picto_couleur',
      type: 'select',
      required: true,
      defaultValue: 'orange',
      options: [
        { label: 'Orange', value: 'orange' },
        { label: 'Violet', value: 'violet' },
        { label: 'Magenta', value: 'magenta' },
        { label: 'Vert', value: 'vert' },
        { label: 'Bleu', value: 'bleu' },
        { label: 'Beige', value: 'beige' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'image_alt',
      type: 'text',
      required: false,
      admin: { description: "Texte alternatif (override de l'alt de la media)." },
    },
  ],
};
