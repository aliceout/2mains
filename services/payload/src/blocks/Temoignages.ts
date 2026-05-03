import type { Block } from 'payload';

import { fondField, titreField } from './_shared';
import { thumbTemoignages } from './_thumbnails';

export const Temoignages: Block = {
  slug: 'temoignages',
  labels: { singular: 'Témoignages (mosaïque)', plural: 'Témoignages' },
  imageURL: thumbTemoignages,
  imageAltText: 'Aperçu : 2 cartes témoignages avec citation et auteur',
  fields: [
    {
      ...titreField,
      defaultValue: "Ce qu'elles en disent",
    },
    fondField,
    {
      name: 'contexte',
      type: 'select',
      required: false,
      label: 'Filtrer par contexte (optionnel)',
      options: [
        { label: 'Participantes', value: 'participante' },
        { label: 'Partenaires', value: 'partenaire' },
        { label: 'Professionnelles', value: 'professionnelle' },
      ],
    },
    {
      name: 'limite',
      type: 'number',
      required: true,
      defaultValue: 3,
      min: 1,
      max: 9,
    },
    {
      name: 'ids',
      type: 'array',
      required: false,
      label: 'Filtrer par entrées spécifiques (optionnel)',
      admin: {
        description:
          'Laisse vide pour tirer automatiquement. Sinon liste les slugs.',
      },
      fields: [{ name: 'slug', type: 'text', required: true }],
    },
  ],
};
