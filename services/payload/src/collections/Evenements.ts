import type { CollectionConfig } from 'payload';

/** Événements / agenda. Miroir Astro `evenements`. */
export const Evenements: CollectionConfig = {
  slug: 'evenements',
  labels: { singular: 'Événement', plural: 'Événements' },
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date_debut', 'lieu', 'gratuit'],
    listSearchableFields: ['title', 'lieu'],
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Titre' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    { name: 'date_debut', type: 'date', required: true, label: 'Début' },
    { name: 'date_fin', type: 'date', required: false, label: 'Fin (optionnel)' },
    { name: 'lieu', type: 'text', required: true },
    { name: 'adresse', type: 'text', required: false },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Image',
    },
    {
      name: 'public',
      type: 'select',
      required: true,
      options: [
        { label: 'Tout public', value: 'tout public' },
        { label: 'Professionnels', value: 'professionnels' },
        { label: 'Femmes concernées', value: 'femmes concernées' },
        { label: 'Adhérents', value: 'adhérents' },
      ],
    },
    {
      name: 'gratuit',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'inscription_url',
      type: 'text',
      required: false,
      label: 'URL d\'inscription (HelloAsso, Eventbrite, etc.)',
    },
    {
      name: 'body',
      type: 'textarea',
      required: false,
      label: 'Description longue (Markdown, optionnel)',
    },
    {
      name: 'fictif',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Événement de démonstration — badge « À valider ».' },
    },
    {
      name: 'draft',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
};
