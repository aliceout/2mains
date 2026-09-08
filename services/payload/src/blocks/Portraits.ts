import type { Block } from 'payload';

import { fondField, linkField, richTextField, titreField } from './_shared';
import { thumbPortraits } from './_thumbnails';

export const Portraits: Block = {
  slug: 'portraits',
  labels: { singular: 'Portraits (grille personnes)', plural: 'Portraits' },
  imageURL: thumbPortraits,
  imageAltText: 'Aperçu : 4 portraits ronds avec nom dessous',
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
      // Non effaçable : un select obligatoire vidé bloque la sauvegarde.
      admin: { isClearable: false },
    },
    {
      name: 'forme',
      type: 'select',
      required: true,
      defaultValue: 'rond',
      options: [
        { label: 'Rond', value: 'rond' },
        { label: 'Carré', value: 'carre' },
      ],
      // Non effaçable : un select obligatoire vidé bloque la sauvegarde.
      admin: { isClearable: false },
    },
    {
      name: 'personnes',
      type: 'array',
      required: true,
      labels: { singular: 'Personne', plural: 'Personnes' },
      fields: [
        { name: 'nom', type: 'text', required: true },
        { name: 'role', type: 'text', required: false },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        { name: 'photo_alt', type: 'text', required: false },
        richTextField({ name: 'bio', label: 'Bio' }),
        linkField({ label: 'Lien' }),
        { name: 'lien_label', type: 'text', required: false, label: 'Texte du lien' },
      ],
    },
  ],
};
