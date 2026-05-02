import type { GlobalConfig } from 'payload';

/**
 * Paramètres globaux du site (singleton). Miroir Astro
 * collection `site` (un seul document `settings.md`).
 *
 * Attention : les URLs HelloAsso, SMTP credentials, etc. ne vivent
 * PAS ici — elles sont dans Infisical (env vars du runtime). Ici
 * on stocke uniquement ce qui doit être éditable par Audrey
 * sans avoir à contacter l'équipe technique.
 */
export const Site: GlobalConfig = {
  slug: 'site',
  label: 'Paramètres du site',
  admin: {
    description:
      'Identité, mission, contact, réseaux. Pas de credentials ici — ' +
      'voir Infisical pour les SMTP, HelloAsso, etc.',
  },
  // Lecture publique : Astro SSR doit pouvoir lire ces settings sans
  // authentification. Modification : authentifié seulement (default).
  access: {
    read: () => true,
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
