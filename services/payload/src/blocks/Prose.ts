import type { Block } from 'payload';

import { fondField, titreField } from './_shared';
import { thumbProse } from './_thumbnails';

export const Prose: Block = {
  slug: 'prose',
  labels: { singular: 'Texte riche', plural: 'Textes riches' },
  imageURL: thumbProse,
  imageAltText: 'Aperçu : paragraphe de texte avec un titre',
  fields: [
    titreField,
    fondField,
    // Nouveau champ rich text Lexical (toolbar gras/italique/titres/listes/liens).
    // Coexiste temporairement avec l'ancien `body` markdown pendant la
    // période de migration. Le frontend rend body_rich si rempli,
    // sinon retombe sur marked.parse(body). Une fois toutes les
    // entries migrées (cf script services/payload/scripts/migrate-prose-to-richtext.ts
    // — Phase 2), on supprimera `body`.
    {
      name: 'body_rich',
      type: 'richText',
      label: 'Contenu',
      required: false,
      admin: {
        description:
          'Éditeur visuel avec barre d\'outils (gras, italique, titres, listes, liens). ' +
          'Si rempli, écrase l\'ancien champ "Contenu (Markdown)".',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Contenu (Markdown) — héritage, ne plus utiliser',
      required: false,
      admin: {
        description:
          'Champ historique en markdown. À ignorer pour les nouvelles entrées — ' +
          'utilise le champ "Contenu" au-dessus. Sera supprimé après migration complète.',
      },
    },
  ],
};
