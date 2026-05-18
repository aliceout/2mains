import type { GlobalConfig } from 'payload';

import { isAdminOrRoot } from '../access/roles';

/**
 * Global "Banderole d'urgence" — bandeau d'alerte affiché en haut de
 * toutes les pages quand `active = true`.
 *
 * Issu du split de l'ancien global `site` (où c'était un sous-groupe
 * `banderole_urgence`). On déstructure les champs au top-level du
 * global pour éviter la redondance de noms.
 */
export const BanderoleUrgence: GlobalConfig = {
  slug: 'banderole-urgence',
  label: 'Banderole d\'urgence',
  admin: {
    group: 'Paramètres',
    description:
      'Bandeau d\'alerte affiché en haut de toutes les pages. Activable et ' +
      'éditable indépendamment du reste, pour ne pas avoir à toucher au site ' +
      'en code en cas de message urgent à passer.',
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
      name: 'active',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Active la banderole sur toutes les pages.' },
    },
    {
      name: 'message',
      type: 'textarea',
      required: false,
      admin: {
        description:
          'Markdown inline supporté (**gras**, *italique*, [lien](url)).',
      },
    },
    {
      name: 'couleur',
      type: 'select',
      defaultValue: 'orange',
      options: [
        { label: 'Orange', value: 'orange' },
        { label: 'Violet', value: 'violet' },
        { label: 'Magenta', value: 'magenta' },
      ],
    },
  ],
};
