import type { Block } from 'payload';

import { ctaFields, fondField, richTextWithLegacy } from './_shared';
import { thumbCta } from './_thumbnails';

export const Cta: Block = {
  slug: 'cta',
  labels: {
    singular: 'Bandeau bouton d\'action',
    plural: 'Bandeaux bouton d\'action',
  },
  imageURL: thumbCta,
  imageAltText: 'Aperçu : titre avec un gros bouton d\'action centré',
  fields: [
    fondField,
    { name: 'titre', type: 'text', required: true },
    ...richTextWithLegacy({ name: 'corps', label: 'Sous-titre / corps' }),
    {
      name: 'cta_primaire',
      type: 'group',
      required: false,
      label: 'Bouton principal',
      fields: ctaFields,
    },
    {
      name: 'cta_secondaire',
      type: 'group',
      required: false,
      label: 'Bouton secondaire (facultatif)',
      fields: ctaFields,
    },
  ],
};
