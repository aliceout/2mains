import type { Block } from 'payload';

export const BandeauImage: Block = {
  slug: 'bandeau-image',
  labels: { singular: 'Bandeau image plein écran', plural: 'Bandeaux image' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    { name: 'alt', type: 'text', required: false, label: 'Description (alt)' },
    { name: 'titre', type: 'text', required: true },
    { name: 'sousTitre', type: 'text', required: false },
    {
      name: 'hauteur',
      type: 'select',
      required: true,
      defaultValue: 'moyenne',
      options: [
        { label: 'Petite', value: 'petite' },
        { label: 'Moyenne', value: 'moyenne' },
        { label: 'Grande', value: 'grande' },
      ],
    },
    {
      name: 'position_texte',
      type: 'select',
      required: true,
      defaultValue: 'centre',
      options: [
        { label: 'Gauche', value: 'gauche' },
        { label: 'Centre', value: 'centre' },
        { label: 'Droite', value: 'droite' },
      ],
    },
    {
      name: 'position_verticale',
      type: 'select',
      required: true,
      defaultValue: 'milieu',
      options: [
        { label: 'Haut', value: 'haut' },
        { label: 'Milieu', value: 'milieu' },
        { label: 'Bas', value: 'bas' },
      ],
    },
    {
      name: 'scrim',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Voile sombre pour la lisibilité du texte.' },
    },
  ],
};
