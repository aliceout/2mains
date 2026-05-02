import type { CollectionConfig } from 'payload';

/** Documents (rapports, projet associatif, etc.). Miroir Astro `documents`. */
export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Document', plural: 'Documents' },
  admin: {
    useAsTitle: 'titre',
    defaultColumns: ['titre', 'categorie', 'date', 'a_paraitre'],
    listSearchableFields: ['titre'],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    { name: 'titre', type: 'text', required: true },
    {
      name: 'categorie',
      type: 'select',
      required: true,
      options: [
        { label: 'Projet associatif', value: 'projet associatif' },
        { label: "Rapport d'activité", value: "rapport d'activité" },
        { label: 'Ressource', value: 'ressource' },
        { label: 'Communication', value: 'communication' },
        { label: 'Présentation', value: 'présentation' },
      ],
    },
    {
      name: 'fichier',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: { description: "PDF ou autre fichier téléchargeable." },
    },
    {
      name: 'date',
      type: 'date',
      required: false,
      admin: { description: 'Date de publication ou de référence du document.' },
    },
    {
      name: 'description_courte',
      type: 'textarea',
      required: false,
    },
    {
      name: 'a_paraitre',
      type: 'checkbox',
      defaultValue: false,
      label: 'À paraître',
      admin: { description: "Document annoncé mais pas encore publié." },
    },
    { name: 'draft', type: 'checkbox', defaultValue: false },
  ],
};
