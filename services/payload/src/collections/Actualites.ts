import type { CollectionConfig } from 'payload';

import { authenticated } from '../access/authenticated';
import { richTextWithLegacy } from '../blocks/_shared';

/**
 * Articles de blog. Miroir de la collection Astro `actualites`,
 * avec un body markdown (textarea) pour rester compatible avec le
 * pipeline de rendu actuel.
 */
export const Actualites: CollectionConfig = {
  slug: 'actualites',
  labels: { singular: 'Actualité', plural: 'Actualités' },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'auteur', 'updatedAt'],
    listSearchableFields: ['title', 'auteur'],
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Titre' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "Identifiant URL, ex: 'lancement-association'.",
      },
    },
    ...richTextWithLegacy({ name: 'description', label: 'Description (chapô)' }),
    { name: 'date', type: 'date', required: true, label: 'Date de publication' },
    { name: 'auteur', type: 'text', required: false },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Image de couverture',
    },
    {
      name: 'cover_alt',
      type: 'text',
      required: false,
      admin: { description: "Alt override (sinon on prend l'alt de la media)." },
    },
    {
      name: 'tags',
      type: 'array',
      required: false,
      labels: { singular: 'Tag', plural: 'Tags' },
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
    ...richTextWithLegacy({ name: 'body', label: 'Corps de l\'article' }),
    {
      name: 'draft',
      type: 'checkbox',
      defaultValue: false,
      label: 'Brouillon (masqué en prod)',
    },
  ],
};
