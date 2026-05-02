import type { Block } from 'payload';

import { fondField, titreField } from './_shared';

export const Prose: Block = {
  slug: 'prose',
  labels: { singular: 'Texte riche', plural: 'Textes riches' },
  fields: [
    titreField,
    fondField,
    {
      name: 'body',
      type: 'textarea',
      label: 'Contenu (Markdown)',
      required: true,
      admin: {
        description:
          'Markdown : ## titres, **gras**, *italique*, [lien](url), - listes…',
      },
    },
  ],
};
