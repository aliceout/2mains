import type { Field, GlobalConfig } from 'payload';

import { isAdminOrRoot } from '../access/roles';

/**
 * Sous-objet « lien » réutilisé partout dans le global Navigation
 * (header nav, header buttons, footer columns).
 *
 * Deux modes : `type='page'` (relation vers la collection Pages, suit
 * automatiquement les renommages de slug) ou `type='custom'` (URL libre,
 * pour les routes spéciales comme /agenda, /actualites, /contact, ou
 * pour les liens externes https://...).
 */
const linkField: Field = {
  name: 'link',
  type: 'group',
  label: 'Destination',
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'custom',
      options: [
        { label: 'Page du site (sélection)', value: 'page' },
        { label: 'URL ou chemin libre', value: 'custom' },
      ],
      admin: {
        description:
          "« Page du site » = lien suit automatiquement si la page est renommée. " +
          "« URL libre » = pour les sections du site qui ne sont pas des Pages (/agenda, " +
          "/actualites, /contact, /documents) ou pour les liens externes (https://...).",
      },
    },
    {
      name: 'page',
      type: 'relationship',
      relationTo: 'pages',
      label: 'Page',
      admin: {
        condition: (_, sibling) => sibling?.type === 'page',
      },
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL ou chemin',
      admin: {
        condition: (_, sibling) => sibling?.type === 'custom',
        placeholder: '/agenda  ou  https://exemple.org',
      },
    },
  ],
};

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: {
    group: 'Paramètres',
    description:
      "Navigation principale (header), boutons d'action du header, et colonnes de liens du footer.",
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
      name: 'header_nav',
      type: 'array',
      label: 'Navigation principale (header)',
      labels: { singular: 'Item', plural: 'Items' },
      admin: {
        description:
          "Items de la barre de navigation du header. Un item peut être un lien direct, " +
          "ou un menu déroulant avec des sous-liens.",
      },
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Libellé' },
        {
          name: 'is_dropdown',
          type: 'checkbox',
          defaultValue: false,
          label: 'Menu déroulant (avec sous-liens)',
        },
        {
          ...linkField,
          admin: {
            ...linkField.admin,
            condition: (_, sibling) => sibling?.is_dropdown !== true,
          },
        },
        {
          name: 'children',
          type: 'array',
          label: 'Sous-liens',
          labels: { singular: 'Sous-lien', plural: 'Sous-liens' },
          admin: {
            condition: (_, sibling) => sibling?.is_dropdown === true,
          },
          fields: [
            { name: 'label', type: 'text', required: true, label: 'Libellé' },
            linkField,
          ],
        },
      ],
    },
    {
      name: 'header_buttons',
      type: 'array',
      label: "Boutons d'action (header)",
      labels: { singular: 'Bouton', plural: 'Boutons' },
      maxRows: 3,
      admin: {
        description:
          "Les 3 boutons colorés à droite du header. Le visuel (icône + couleur) " +
          "est figé par position : 1er = violet « Le blog », 2e = magenta « Nous " +
          "rejoindre », 3e = orange « Nous soutenir ». Tu peux modifier le libellé " +
          "(utilisé pour l'accessibilité) et la destination de chaque bouton.",
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Libellé (accessibilité)',
          admin: {
            description:
              "Lu par les lecteurs d'écran (aria-label). Le texte visible est " +
              "intégré dans l'icône SVG du bouton.",
          },
        },
        linkField,
      ],
    },
    {
      name: 'footer_columns',
      type: 'array',
      label: 'Colonnes du footer',
      labels: { singular: 'Colonne', plural: 'Colonnes' },
      maxRows: 4,
      admin: {
        description:
          "Colonnes de liens affichées dans le pied de page (au-dessus de la " +
          "version). Chaque colonne a un titre et une liste de liens.",
      },
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Titre' },
        {
          name: 'links',
          type: 'array',
          label: 'Liens',
          labels: { singular: 'Lien', plural: 'Liens' },
          fields: [
            { name: 'label', type: 'text', required: true, label: 'Libellé' },
            linkField,
            {
              name: 'highlight',
              type: 'checkbox',
              defaultValue: false,
              label: 'Mettre en avant (couleur orange)',
            },
          ],
        },
      ],
    },
  ],
};
