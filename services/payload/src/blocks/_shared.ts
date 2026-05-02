// Champs réutilisables entre les blocs.
//
// On reproduit fidèlement les enums du `content.config.ts` Astro
// (les noms de fond et couleurs « historiques »), pour que le
// script de migration Phase 2 puisse copier les valeurs YAML sans
// transformation.
import type { Field } from 'payload';

export const fondField: Field = {
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
};

export const couleurField: Field = {
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
};

/** Eyebrow / sous-titre court avec un tiret. */
export const titreField: Field = {
  name: 'titre',
  type: 'text',
  label: 'Titre de la section',
  required: false,
};

/** Lien / CTA — sous-objet réutilisé dans cta, formats, etc.
 *  Label et href sont en required:false côté schéma car Payload
 *  n'a pas de "tout-ou-rien" sur les groups optionnels : si on les
 *  marquait required, un format SANS cta serait quand même rejeté.
 *  La cohérence (label+href ensemble) est validée côté UI/UX. */
export const ctaFields: Field[] = [
  { name: 'label', type: 'text', required: false },
  { name: 'href', type: 'text', required: false },
  { name: 'externe', type: 'checkbox', defaultValue: false },
];
