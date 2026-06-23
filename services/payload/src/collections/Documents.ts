import type { CollectionConfig } from 'payload';

import { authenticated } from '../access/authenticated';

/** Documents (rapports, projet associatif, etc.). Miroir Astro `documents`. */
export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Document', plural: 'Documents' },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
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
      label: 'Fichier (PDF)',
      admin: {
        description:
          'Glisse-dépose ton PDF dans le cadre ci-dessous, ou clique "Choose from existing" pour réutiliser un fichier déjà uploadé. Pour télécharger / remplacer un PDF existant, clique sur la vignette ou son nom une fois affichée.',
      },
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
