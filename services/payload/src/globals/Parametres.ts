import type { GlobalConfig } from 'payload';

import { isAdminOrRoot } from '../access/roles';

/**
 * Global "Paramètres" — toggles techniques/UX du site.
 *
 * - commit_info : champ ui qui affiche le SHA Git de la version déployée
 * - noindex : empêche l'indexation par les moteurs de recherche
 * - gate_password : mot de passe d'accès "site en construction"
 * - no_cache : désactive le cache navigateur (recette client)
 *
 * Issu du split de l'ancien global `site`.
 */
export const Parametres: GlobalConfig = {
  slug: 'parametres',
  label: 'Paramètres',
  admin: {
    description:
      'Toggles techniques : indexation moteurs de recherche, page de garde ' +
      'pendant la refonte, cache navigateur.',
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
      name: 'commit_info',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/CommitInfo#default',
        },
      },
    },
    {
      name: 'noindex',
      type: 'checkbox',
      defaultValue: false,
      label: 'Empêcher l\'indexation par les moteurs de recherche',
      admin: {
        description:
          'Si coché, le site entier devient invisible pour Google, Bing, etc. ' +
          'Utile pendant une refonte ou pour une instance de staging. ' +
          'Le toggle ajoute `Disallow: /` à robots.txt, un `<meta name="robots" content="noindex, nofollow">` ' +
          'sur toutes les pages, et un header HTTP `X-Robots-Tag`.',
      },
    },
    {
      name: 'gate_password',
      type: 'text',
      required: false,
      label: 'Mot de passe d\'accès au site (mode "site en construction")',
      admin: {
        description:
          'Si renseigné, le site entier est masqué derrière une page de garde ' +
          'qui demande ce mot de passe. Laisser vide pour désactiver. ' +
          'Idéal pour une période de refonte ou de pré-lancement entre proches — ' +
          'pas pour de la vraie sécurité. /cms/admin reste toujours accessible.',
      },
    },
    {
      name: 'no_cache',
      type: 'checkbox',
      defaultValue: false,
      label: 'Désactiver le cache navigateur',
      admin: {
        description:
          'Si coché, chaque page est servie avec des headers `Cache-Control: ' +
          'no-store` qui forcent les navigateurs à refetch à chaque visite. ' +
          'Utile pendant une recette client (Audrey voit toutes les modifs ' +
          'immédiatement sans Ctrl+F5). À désactiver une fois le site stabilisé : ' +
          'le cache est ce qui rend le site rapide.',
      },
    },
  ],
};
