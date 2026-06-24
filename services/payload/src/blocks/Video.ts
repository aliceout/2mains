import type { Block } from 'payload';

import { fondField, titreField } from './_shared';
import { thumbVideo } from './_thumbnails';

/**
 * Bloc vidéo — embed YouTube ou Vimeo en « click-to-load » (aucun cookie
 * ni script tiers tant que le visiteur n'a pas cliqué sur ▶, cf.
 * Video.astro). Audrey colle l'URL de la vidéo ; la plateforme et l'id
 * sont détectés automatiquement côté frontend.
 *
 * Pas de thumbnail dédié dans la palette (bloc simple).
 */
export const Video: Block = {
  slug: 'video',
  labels: { singular: 'Vidéo', plural: 'Vidéos' },
  imageURL: thumbVideo,
  imageAltText: 'Aperçu : écran vidéo avec bouton lecture',
  fields: [
    titreField,
    fondField,
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'Lien de la vidéo (YouTube ou Vimeo)',
      admin: {
        description:
          'Colle l\'adresse complète de la vidéo, ex : https://www.youtube.com/watch?v=… ou https://vimeo.com/… ' +
          'Astuce : mets la vidéo en « non répertoriée » sur YouTube/Vimeo pour qu\'elle reste invisible des recherches mais lisible ici.',
      },
    },
    {
      name: 'legende',
      type: 'text',
      required: false,
      label: 'Légende (optionnelle)',
    },
  ],
};
