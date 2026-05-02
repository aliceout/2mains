import type { GlobalConfig } from 'payload';

import { authenticated } from '../access/authenticated';

/**
 * Paramètres globaux du site (singleton). Miroir Astro
 * collection `site` (un seul document `settings.md`).
 *
 * Audrey édite tout ce qui est public et susceptible de changer
 * (URLs HelloAsso, réseaux sociaux, banderole d'urgence). Les
 * credentials SMTP restent dans Infisical — pas ici.
 */
export const Site: GlobalConfig = {
  slug: 'site',
  label: 'Paramètres du site',
  admin: {
    description:
      'Identité, mission, contact, réseaux, liens HelloAsso. ' +
      'Pas de credentials ici (SMTP, etc.) — ceux-là sont dans Infisical.',
  },
  // Lecture publique : Astro SSR doit pouvoir lire ces settings sans
  // authentification. Modification : authentifié seulement.
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'nom_asso',
      type: 'text',
      required: true,
      label: 'Nom de l\'association',
      defaultValue: '2mains de femmes',
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'URL canonique du site',
      defaultValue: 'https://2mainsdefemmes.org',
    },
    {
      name: 'accroche_globale',
      type: 'text',
      required: true,
      label: 'Accroche globale (slogan)',
    },
    {
      name: 'mission',
      type: 'textarea',
      required: true,
      label: 'Mission (texte court, footer/about)',
    },
    {
      name: 'directeur_publication',
      type: 'text',
      required: true,
      label: 'Directeur·rice de publication',
    },
    {
      name: 'siren',
      type: 'text',
      required: false,
      label: 'SIREN (optionnel)',
    },
    {
      name: 'rna',
      type: 'text',
      required: false,
      label: 'RNA (optionnel)',
    },
    {
      name: 'adresse',
      type: 'textarea',
      required: false,
      label: 'Adresse postale (mentions légales)',
    },
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
    {
      name: 'banderole_urgence',
      type: 'group',
      label: 'Banderole d\'urgence (haut de site)',
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
    },
  ],
};
