import type { Block } from 'payload';

import { ctaFields, richTextField } from './_shared';

/**
 * Bloc spécifique à la page d'accueil : section « Soutenir » 2 colonnes,
 * gauche = message + boutons éditable, droite = liste des prochains
 * événements (rendue automatiquement par le composant Astro à partir
 * de la collection Évenements).
 *
 * Pas de thumbnail dédié (bloc spécifique accueil — pas dans la palette
 * générale de tous les blocks).
 */
export const SoutenirHome: Block = {
  slug: 'soutenir-home',
  labels: {
    singular: 'Soutenir (accueil)',
    plural: 'Soutenir (accueil)',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      required: false,
      label: 'Eyebrow / sur-titre',
      defaultValue: '— Soutenir',
    },
    {
      name: 'titre',
      type: 'text',
      required: true,
      label: 'Titre',
      admin: {
        description:
          "Astuce : *italique* sur un mot pour l'accent (ex: « grâce à *vous* »).",
      },
    },
    richTextField({
      name: 'corps',
      label: 'Paragraphe',
      description: 'Texte court sous le titre.',
      inline: true,
    }),
    {
      name: 'cta_primaire',
      type: 'group',
      label: 'Bouton principal',
      fields: ctaFields,
    },
    {
      name: 'cta_secondaire',
      type: 'group',
      label: 'Bouton secondaire',
      fields: ctaFields,
    },
  ],
};
