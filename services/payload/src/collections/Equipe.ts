import type { CollectionConfig } from 'payload';

import { authenticated } from '../access/authenticated';

/** Membres CA / bénévoles. Miroir Astro `equipe`. */
export const Equipe: CollectionConfig = {
  slug: 'equipe',
  labels: { singular: 'Membre équipe', plural: 'Équipe' },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'nom',
    defaultColumns: ['nom', 'role', 'ordre'],
    listSearchableFields: ['nom', 'role'],
  },
  defaultSort: 'ordre',
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "URL-safe, ex: 'audrey-relandeau'.",
      },
    },
    { name: 'nom', type: 'text', required: true, label: 'Nom complet' },
    { name: 'role', type: 'text', required: true, label: 'Rôle / fonction' },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'bio_courte',
      type: 'textarea',
      required: false,
      label: 'Bio courte',
    },
    {
      name: 'linkedin',
      type: 'text',
      required: false,
      label: 'URL LinkedIn (optionnel)',
    },
    {
      name: 'ordre',
      type: 'number',
      required: false,
      defaultValue: 0,
      admin: { description: "Plus petit = plus haut dans la liste." },
    },
    { name: 'draft', type: 'checkbox', defaultValue: false },
  ],
};
