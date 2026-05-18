import type { GlobalConfig } from 'payload';

import { isAdminOrRoot } from '../access/roles';

/**
 * Global "Liens externes" — réseaux sociaux + URLs HelloAsso.
 *
 * Issu du split de l'ancien global `site`. On garde les noms de
 * sous-groupes (reseaux, helloasso) pour préserver les data via la
 * migration SQL.
 */
export const LiensExternes: GlobalConfig = {
  slug: 'liens-externes',
  label: 'Liens externes',
  admin: {
    description:
      'URLs externes : profils réseaux sociaux + campagnes HelloAsso. ' +
      'Ces liens apparaissent dans le footer + les boutons "Faire un don", ' +
      '"Adhérer", "Newsletter".',
    hidden: ({ user }) => {
      const role = (user as { role?: string } | null | undefined)?.role;
      return role !== 'admin' && role !== 'root';
    },
  },
  access: {
    read: () => true,
    update: isAdminOrRoot,
  },
  fields: [
    {
      name: 'reseaux',
      type: 'group',
      label: 'Réseaux sociaux',
      fields: [
        { name: 'facebook', type: 'text', required: false },
        { name: 'instagram', type: 'text', required: false },
        { name: 'linkedin', type: 'text', required: false },
      ],
    },
    {
      name: 'helloasso',
      type: 'group',
      label: 'Liens HelloAsso',
      admin: {
        description:
          'URLs publiques des campagnes HelloAsso. Visibles dans les ' +
          'boutons "Faire un don", "Adhérer", "Newsletter".',
      },
      fields: [
        {
          name: 'don',
          type: 'text',
          required: false,
          label: 'URL campagne don',
          defaultValue: 'https://www.helloasso.com/associations/2mains-de-femmes',
        },
        {
          name: 'adhesion',
          type: 'text',
          required: false,
          label: 'URL campagne adhésion',
        },
        {
          name: 'newsletter',
          type: 'text',
          required: false,
          label: 'URL campagne newsletter',
        },
      ],
    },
  ],
};
