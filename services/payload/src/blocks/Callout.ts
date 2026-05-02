import type { Block } from 'payload';

import { fondField, titreField } from './_shared';

export const Callout: Block = {
  slug: 'callout',
  labels: { singular: 'Encadré (callout)', plural: 'Encadrés' },
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
    {
      name: 'body',
      type: 'textarea',
      label: 'Contenu',
      required: true,
    },
  ],
};
