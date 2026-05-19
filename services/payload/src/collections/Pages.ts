import type { CollectionConfig } from 'payload';

import { authenticated } from '../access/authenticated';
import { allBlocks } from '../blocks';
import { richTextField } from '../blocks/_shared';

/**
 * Collection des pages éditoriales du site (homepage, qui-sommes-nous,
 * structures, femmes, etc.). Reproduit fidèlement le schéma Astro
 * `pages` du content.config.ts pour permettre une migration 1:1.
 *
 * Champs miroirs :
 *  - title       (Astro: title)
 *  - description (Astro: description, pour SEO)
 *  - slug        (Astro: clé du fichier markdown, ex: 'accueil')
 *  - hero        (Astro: hero {titre, sousTitre, accroche, variant, cta_*})
 *  - sections    (Astro: sections[], discriminated union → blocks Payload)
 *  - noindex     (Astro: noindex)
 *
 * Les pages sont identifiées par leur `slug`, qui sert aussi de
 * paramètre de route Astro (Astro fait `getEntry('pages', slug)`).
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    listSearchableFields: ['title', 'slug'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titre de la page',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          "Identifiant URL-safe, ex: 'accueil', 'qui-sommes-nous'. Sert à matcher la route Astro.",
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Description SEO',
      admin: { description: '~150 caractères, affiché dans Google.' },
    },
    {
      name: 'noindex',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Si coché, demande aux moteurs de ne pas indexer.' },
    },
    {
      name: 'hero',
      type: 'group',
      label: 'Hero (en-tête)',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Décocher si la page commence directement par les sections.' },
        },
        { name: 'titre', type: 'text', required: false, admin: { description: 'Astuce : *italique* sur un mot pour l\'accent serif.' } },
        { name: 'sousTitre', type: 'text', required: false, label: 'Eyebrow / sur-titre' },
        richTextField({ name: 'accroche', label: 'Accroche' }),
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'beige',
          options: [
            { label: 'Beige (orange accent)', value: 'beige' },
            { label: 'Orange', value: 'orange' },
            { label: 'Violet', value: 'violet' },
            { label: 'Magenta (rose accent)', value: 'magenta' },
            { label: 'Vert (moss accent)', value: 'vert' },
            { label: 'Bleu (mauve accent)', value: 'bleu' },
          ],
        },
        {
          name: 'cta_primaire',
          type: 'group',
          label: 'Bouton principal',
          fields: [
            { name: 'label', type: 'text', label: 'Texte du bouton' },
            { name: 'href', type: 'text', label: 'URL (interne ex. /contact, ou externe https://...)' },
            { name: 'externe', type: 'checkbox', defaultValue: false, label: 'Lien externe (ouvre dans un nouvel onglet)' },
          ],
        },
        {
          name: 'cta_secondaire',
          type: 'group',
          label: 'Bouton secondaire (facultatif)',
          fields: [
            { name: 'label', type: 'text', label: 'Texte du bouton' },
            { name: 'href', type: 'text', label: 'URL (interne ex. /contact, ou externe https://...)' },
            { name: 'externe', type: 'checkbox', defaultValue: false, label: 'Lien externe (ouvre dans un nouvel onglet)' },
          ],
        },
      ],
    },
    {
      name: 'sections',
      type: 'blocks',
      label: 'Sections de la page',
      blocks: allBlocks,
      admin: {
        description:
          'Compose la page en empilant des sections. Chaque section est un type de bloc différent.',
      },
    },
  ],
};
