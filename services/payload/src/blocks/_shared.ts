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
export function richTextFieldEditor(opts?: { inline?: boolean }) {
  // Mode `inline` = pour les champs rendus sans wrapping <p> (banderole
  // d'urgence, mission asso au footer). On retire headings + listes pour
  // qu'Audrey ne puisse pas saisir des blocs qui seraient aplatis au
  // rendu (le frontend utilise lexicalToHtmlInline qui strip les <p>
  // mais ne peut pas correctement rendre une <ul> sans wrapping block).
  const features = opts?.inline
    ? [
        ParagraphFeature(),
        BoldFeature(),
        ItalicFeature(),
        UnderlineFeature(),
        StrikethroughFeature(),
        LinkFeature(),
        FixedToolbarFeature(),
      ]
    : [
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
      ];
  return { editor: lexicalEditor({ features }) };
}

/**
 * Construit un champ richText Lexical. Le nom de la colonne DB inclut
 * le suffixe `_rich` (héritage de la Phase 2 où le richText coexistait
 * avec un textarea markdown legacy — celui-ci a été supprimé en Phase 3).
 *
 * @example
 *   richTextField({ name: 'body', label: 'Contenu' })
 *   // → produit un champ Payload nommé `body_rich`
 */
export function richTextField(opts: {
  /** Nom logique du champ. La colonne DB sera `<name>_rich`. */
  name: string;
  /** Label affiché en admin. */
  label: string;
  /** Description optionnelle affichée sous le champ. */
  description?: string;
  /** Si true : toolbar restreinte (pas de listes/headings) pour les champs
   *  rendus en inline côté frontend (banderole, mission). */
  inline?: boolean;
}): Field {
  return {
    name: `${opts.name}_rich`,
    type: 'richText',
    label: opts.label,
    required: false,
    ...richTextFieldEditor({ inline: opts.inline }),
    admin: {
      description: opts.description,
    },
  };
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
 *  `label` est en required:false (Payload n'a pas de "tout-ou-rien" sur
 *  les groups optionnels : si on le marquait required, un bloc SANS
 *  bouton serait quand même rejeté). La cohérence (texte+lien ensemble)
 *  est validée côté UI/UX.
 *  Le lien lui-même est délégué à `linkField()` (group type/page/url/externe). */
export const ctaFields = [
  {
    name: 'label',
    type: 'text',
    required: false,
    label: 'Texte du bouton',
  },
  linkField({ label: 'Destination du bouton' }),
] satisfies Field[];

/**
 * Helper partagé pour les champs « lien » : permet à la rédactrice de
 * choisir entre une Page du site (relationship, suit les renommages de
 * slug) ou une URL/chemin libre (sections non-Pages comme /agenda,
 * /contact, ou liens externes https://...).
 *
 * Le frontend (transformBlock dans src/lib/payload.ts) aplatit ce groupe
 * en { href, externe } pour rester compatible avec les composants Astro
 * existants.
 */
export function linkField(opts?: {
  label?: string;
  description?: string;
  condition?: (data: Partial<Record<string, unknown>>, sibling: Partial<Record<string, unknown>>) => boolean;
}): Field {
  const base: Field = {
    name: 'link',
    type: 'group',
    label: opts?.label ?? 'Destination',
    fields: [
      {
        name: 'type',
        type: 'select',
        required: true,
        defaultValue: 'page',
        options: [
          { label: 'Page du site (sélection)', value: 'page' },
          { label: 'URL ou chemin libre', value: 'custom' },
        ],
        admin: {
          description:
            '« Page du site » = sélection dans la liste, suit automatiquement les renommages. ' +
            '« URL libre » = pour les sections du site qui ne sont pas des Pages (/agenda, ' +
            '/actualites, /contact, /documents) ou pour les liens externes (https://...).',
        },
      },
      {
        name: 'page',
        type: 'relationship',
        relationTo: 'pages',
        label: 'Page',
        admin: { condition: (_, sibling) => sibling?.type === 'page' },
      },
      {
        name: 'url',
        type: 'text',
        label: 'URL ou chemin',
        admin: {
          condition: (_, sibling) => sibling?.type === 'custom',
          description: 'Ex: /agenda, /contact, ou https://exemple.com',
        },
      },
      {
        name: 'externe',
        type: 'checkbox',
        defaultValue: false,
        label: 'Ouvrir dans un nouvel onglet',
        admin: { condition: (_, sibling) => sibling?.type === 'custom' },
      },
    ],
  };
  if (opts?.condition) {
    return { ...base, admin: { condition: opts.condition } } as Field;
  }
  return base;
}
