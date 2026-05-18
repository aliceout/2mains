import type { GlobalConfig } from 'payload';

import { isAdminOrRoot } from '../access/roles';

/**
 * Global "Identité" — nom, URL canonique, mission, mentions légales.
 *
 * Issu du split de l'ancien global `site` (qui regroupait tout).
 * On garde les noms de colonnes pour préserver les data via la migration
 * SQL (cf migrations/<timestamp>_split_site_global.ts).
 */
export const Identite: GlobalConfig = {
  slug: 'identite',
  label: 'Identité',
  admin: {
    description:
      'Identité de l\'association : nom, URL canonique, accroche, mission, ' +
      'directeur·rice de publication, identifiants légaux, adresse postale.',
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
      admin: {
        description: 'Domaine racine, ex: https://votre-domaine.tld (sans slash final).',
      },
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
  ],
};
