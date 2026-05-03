import type { Block } from 'payload';

import { fondField, titreField } from './_shared';
import { thumbProse } from './_thumbnails';

export const Prose: Block = {
  slug: 'prose',
  labels: { singular: 'Texte riche', plural: 'Textes riches' },
  imageURL: thumbProse,
  imageAltText: 'Aperçu : paragraphe de texte avec un titre',
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
