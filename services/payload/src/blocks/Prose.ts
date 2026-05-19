import type { Block } from 'payload';

import { fondField, richTextField, titreField } from './_shared';
import { thumbProse } from './_thumbnails';

export const Prose: Block = {
  slug: 'prose',
  labels: { singular: 'Texte riche', plural: 'Textes riches' },
  imageURL: thumbProse,
  imageAltText: 'Aperçu : paragraphe de texte avec un titre',
  fields: [
    titreField,
    fondField,
    richTextField({ name: 'body', label: 'Contenu' }),
  ],
};
