import type { Block } from 'payload';

import { fondField, richTextWithLegacy, titreField } from './_shared';
import { thumbCallout } from './_thumbnails';

export const Callout: Block = {
  slug: 'callout',
  labels: { singular: 'Encadré (callout)', plural: 'Encadrés' },
  imageURL: thumbCallout,
  imageAltText: 'Aperçu : encadré avec icône info à gauche',
  fields: [
    fondField,
    {
      name: 'ton',
      type: 'select',
      required: true,
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Important', value: 'important' },
        { label: 'Astuce', value: 'astuce' },
        { label: 'Note', value: 'note' },
      ],
    },
    { ...titreField, label: 'Titre (optionnel)' },
    ...richTextWithLegacy({ name: 'body', label: 'Contenu' }),
  ],
};
