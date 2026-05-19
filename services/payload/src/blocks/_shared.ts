// Champs réutilisables entre les blocs.
//
// On reproduit fidèlement les enums du `content.config.ts` Astro
// (les noms de fond et couleurs « historiques »), pour que le
// script de migration Phase 2 puisse copier les valeurs YAML sans
// transformation.
//
// `satisfies Field` (vs `: Field`) préserve les types littéraux —
// nécessaire pour que les blocs qui spread (`{ ...titreField, label }`)
// gardent le narrowing sur `type: 'text'` et trouvent `label` dans
// TextField au lieu de tomber sur RowField (sans label).
import type { Field } from 'payload';
import {
  lexicalEditor,
  FixedToolbarFeature,
  ParagraphFeature,
  HeadingFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  LinkFeature,
  UnorderedListFeature,
  OrderedListFeature,
} from '@payloadcms/richtext-lexical';

/**
 * Helper pour les champs richText partagés (toolbar fixe, features
 * restreintes au strict minimum dont une rédactrice non-tech a besoin :
 * gras / italique / souligné / barré / titres h2-h3 / listes / liens).
 *
 * Pas de BlocksFeature / UploadFeature / RelationshipFeature : ces
 * affordances génèrent des "+" / drag-handles / slash menus qui
 * perturbent les rédactrices. Le rendu visuel est custom-stylé dans
 * AdminStyles.tsx pour aligner sur les textareas du reste du formulaire.
 *
 * Pattern d'usage dans un bloc/collection :
 *
 *   {
 *     name: 'body_rich',
 *     type: 'richText',
 *     label: 'Contenu',
 *     ...richTextFieldEditor(),
 *   }
 */
export function richTextFieldEditor() {
  return {
    editor: lexicalEditor({
      features: [
        ParagraphFeature(),
        HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
        BoldFeature(),
        ItalicFeature(),
        UnderlineFeature(),
        StrikethroughFeature(),
        UnorderedListFeature(),
        OrderedListFeature(),
        LinkFeature(),
        FixedToolbarFeature(),
      ],
    }),
  };
}

/**
 * Construit le dual-field (richText + textarea legacy) pour un champ.
 * Pendant la période de migration, le frontend rend le richText si
 * rempli, sinon retombe sur marked.parse(legacy). Une fois la prod
 * vérifiée, le champ legacy sera retiré par une migration Phase 3.
 *
 * @example
 *   ...richTextWithLegacy({
 *     name: 'body',           // nom historique → devient body_rich + body
 *     label: 'Contenu',
 *     legacyLabel: 'Contenu (Markdown) — héritage, ne plus utiliser',
 *   })
 */
export function richTextWithLegacy(opts: {
  /** Nom historique du champ. Devient `<name>_rich` (nouveau) + `<name>` (legacy). */
  name: string;
  /** Label affiché pour le nouveau champ richText. */
  label: string;
  /** Label du champ legacy markdown — typiquement "<...> (Markdown) — héritage". */
  legacyLabel?: string;
  /** Description affichée sous le champ richText. */
  description?: string;
}): Field[] {
  const legacyLabel =
    opts.legacyLabel ?? `${opts.label} (Markdown) — héritage, ne plus utiliser`;
  return [
    {
      name: `${opts.name}_rich`,
      type: 'richText',
      label: opts.label,
      required: false,
      ...richTextFieldEditor(),
      admin: {
        description:
          opts.description ??
          `Éditeur visuel avec barre d'outils. Si rempli, écrase l'ancien champ "${legacyLabel}".`,
      },
    },
    {
      name: opts.name,
      type: 'textarea',
      label: legacyLabel,
      required: false,
      admin: {
        description:
          `Champ historique en markdown. À ignorer pour les nouvelles entrées — ` +
          `utilise le champ "${opts.label}" au-dessus. Sera supprimé après migration complète.`,
      },
    },
  ];
}

export const fondField = {
  name: 'fond',
  type: 'select',
  required: false,
  options: [
    { label: 'Paper (défaut)', value: 'paper' },
    { label: 'Beige (cream)', value: 'beige' },
    { label: 'Violet', value: 'violet' },
    { label: 'Orange', value: 'orange' },
    { label: 'Magenta (rose)', value: 'magenta' },
    { label: 'Vert (moss)', value: 'vert' },
    { label: 'Bleu (mauve)', value: 'bleu' },
  ],
} satisfies Field;

export const couleurField = {
  name: 'couleur',
  type: 'select',
  required: false,
  options: [
    { label: 'Orange', value: 'orange' },
    { label: 'Violet', value: 'violet' },
    { label: 'Magenta', value: 'magenta' },
    { label: 'Vert', value: 'vert' },
    { label: 'Bleu', value: 'bleu' },
  ],
} satisfies Field;

/** Eyebrow / sous-titre court avec un tiret. */
export const titreField = {
  name: 'titre',
  type: 'text',
  label: 'Titre de la section',
  required: false,
} satisfies Field;

/** Bouton d'action — sous-objet réutilisé dans Cta, Hero, Formats, etc.
 *  Texte (= label affiché) et URL (= href) sont en required:false côté
 *  schéma car Payload n'a pas de "tout-ou-rien" sur les groups
 *  optionnels : si on les marquait required, un bloc SANS bouton serait
 *  quand même rejeté. La cohérence (texte+url ensemble) est validée
 *  côté UI/UX.
 *  Slugs `label`/`href`/`externe` conservés tels quels pour ne pas
 *  invalider la DB existante. */
export const ctaFields = [
  {
    name: 'label',
    type: 'text',
    required: false,
    label: 'Texte du bouton',
  },
  {
    name: 'href',
    type: 'text',
    required: false,
    label: 'URL (interne ex. /contact, ou externe https://...)',
  },
  {
    name: 'externe',
    type: 'checkbox',
    defaultValue: false,
    label: 'Lien externe (ouvre dans un nouvel onglet)',
  },
] satisfies Field[];
