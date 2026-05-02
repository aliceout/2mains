import type { CollectionConfig } from 'payload';

/** Partenaires / financeurs. Miroir Astro `partenaires`. */
export const Partenaires: CollectionConfig = {
  slug: 'partenaires',
  labels: { singular: 'Partenaire', plural: 'Partenaires' },
  access: { read: () => true },
  admin: {
    useAsTitle: 'nom',
    defaultColumns: ['nom', 'type', 'ordre'],
    listSearchableFields: ['nom'],
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
    { name: 'nom', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Financeur public', value: 'financeur public' },
        { label: 'Financeur privé', value: 'financeur privé' },
        { label: 'Partenaire associatif', value: 'partenaire associatif' },
        { label: 'Réseau', value: 'réseau' },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'url',
      type: 'text',
      required: false,
      label: 'Site web',
    },
    {
      name: 'description_courte',
      type: 'textarea',
      required: false,
    },
    {
      name: 'ordre',
      type: 'number',
      defaultValue: 0,
    },
    { name: 'draft', type: 'checkbox', defaultValue: false },
  ],
};
