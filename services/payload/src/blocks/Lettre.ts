import type { Block } from 'payload';

import { fondField, richTextWithLegacy, titreField } from './_shared';
import { thumbLettre } from './_thumbnails';

export const Lettre: Block = {
  slug: 'lettre',
  labels: { singular: 'Lettre adressée', plural: 'Lettres adressées' },
  imageURL: thumbLettre,
  imageAltText: 'Aperçu : feuille de lettre avec signature',
  fields: [
    titreField,
    fondField,
    {
      name: 'ouverture',
      type: 'text',
      defaultValue: 'Bonjour,',
      admin: { description: 'Première ligne, en italique.' },
    },
    ...richTextWithLegacy({
      name: 'corps',
      label: 'Corps de la lettre',
      description:
        "Plusieurs paragraphes ; mise en forme via la barre d'outils (gras, italique, listes, liens).",
    }),
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
