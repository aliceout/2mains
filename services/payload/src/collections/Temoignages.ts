import type { CollectionConfig } from 'payload';

import { authenticated } from '../access/authenticated';
import { richTextWithLegacy } from '../blocks/_shared';

/**
 * Témoignages (participantes, partenaires, professionnel·les).
 * Miroir Astro `temoignages`. Le corps du témoignage est dans le
 * field `citation` (ex-body markdown du fichier .md d'origine).
 */
export const Temoignages: CollectionConfig = {
  slug: 'temoignages',
  labels: { singular: 'Témoignage', plural: 'Témoignages' },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'auteur',
    defaultColumns: ['auteur', 'role', 'contexte', 'a_la_une', 'ordre'],
    listSearchableFields: ['auteur', 'role'],
  },
  defaultSort: 'ordre',
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    { name: 'auteur', type: 'text', required: true, label: 'Auteur·e' },
    { name: 'role', type: 'text', required: false, label: 'Rôle / contexte personnel' },
    {
      name: 'contexte',
      type: 'select',
      required: true,
      options: [
        { label: 'Participante', value: 'participante' },
        { label: 'Partenaire', value: 'partenaire' },
        { label: 'Professionnelle', value: 'professionnelle' },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    ...richTextWithLegacy({ name: 'citation', label: 'Citation' }),
    {
      name: 'ordre',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'a_la_une',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Si coché, candidat à la mise en avant home (un seul à la fois).',
      },
    },
    {
      name: 'fictif',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Marque comme fictif (badge « À valider »).' },
    },
    { name: 'draft', type: 'checkbox', defaultValue: false },
  ],
};
