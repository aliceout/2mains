import type { Block } from 'payload';

import { fondField, richTextField, titreField } from './_shared';
import { thumbTextePhoto } from './_thumbnails';

export const TextePhoto: Block = {
  slug: 'texte-photo',
  labels: { singular: 'Texte + photo', plural: 'Blocs texte + photo' },
  imageURL: thumbTextePhoto,
  imageAltText: 'Aperçu : photo à gauche, paragraphe à droite',
  fields: [
    titreField,
    fondField,
    richTextField({ name: 'texte', label: 'Texte' }),
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
      label: 'Description image (alt)',
    },
    {
      name: 'image_legende',
      type: 'text',
      required: false,
      label: 'Légende',
    },
    {
      name: 'image_credit',
      type: 'text',
      required: false,
      label: 'Crédit photo',
    },
    {
      name: 'position',
      type: 'select',
      required: true,
      defaultValue: 'droite',
      options: [
        { label: 'Image à droite', value: 'droite' },
        { label: 'Image à gauche', value: 'gauche' },
      ],
    },
    {
      name: 'ratio',
      type: 'select',
      required: true,
      defaultValue: '50-50',
      options: [
        { label: '50/50', value: '50-50' },
        { label: '2/3 texte', value: '2-tiers-texte' },
        { label: '2/3 image', value: '2-tiers-image' },
      ],
    },
  ],
};
