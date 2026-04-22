import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ---------- Actualités (blog) ----------
const actualites = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/actualites' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    auteur: z.string().optional(),
    cover: z.string().optional(),
    cover_alt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// ---------- Évènements (agenda) ----------
const evenements = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/evenements' }),
  schema: z.object({
    title: z.string(),
    date_debut: z.coerce.date(),
    date_fin: z.coerce.date().optional(),
    lieu: z.string(),
    adresse: z.string().optional(),
    cover: z.string().optional(),
    public: z.enum(['tout public', 'professionnels', 'femmes concernées', 'adhérents']),
    gratuit: z.boolean().default(true),
    inscription_url: z.string().optional(),
    fictif: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// ---------- Partenaires / financeurs ----------
const partenaires = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/partenaires' }),
  schema: z.object({
    nom: z.string(),
    type: z.enum([
      'financeur public',
      'financeur privé',
      'partenaire associatif',
      'réseau',
    ]),
    logo: z.string().optional(),
    url: z.string().optional(),
    description_courte: z.string().optional(),
    ordre: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

// ---------- Équipe / CA ----------
const equipe = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/equipe' }),
  schema: z.object({
    nom: z.string(),
    role: z.string(),
    photo: z.string().optional(),
    bio_courte: z.string().optional(),
    linkedin: z.string().optional(),
    ordre: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

// ---------- Documents ----------
const documents = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/documents' }),
  schema: z.object({
    titre: z.string(),
    categorie: z.enum([
      'projet associatif',
      "rapport d'activité",
      'ressource',
      'communication',
      'présentation',
    ]),
    fichier: z.string().optional(),
    date: z.coerce.date().optional(),
    description_courte: z.string().optional(),
    a_paraitre: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// ---------- Témoignages ----------
const temoignages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/temoignages' }),
  schema: z.object({
    auteur: z.string(),
    role: z.string().optional(),
    contexte: z.enum(['participante', 'partenaire', 'professionnelle']),
    photo: z.string().optional(),
    ordre: z.number().default(0),
    fictif: z.boolean().default(false),
    // Ajout d'un indicateur "mise en avant home" pour choisir la citation
    // affichée en page d'accueil.
    a_la_une: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// ---------- Pages ----------
// Chaque page est un fichier markdown avec un frontmatter structuré.
// Le corps markdown est affiché dans la zone "prose". Des `sections`
// supplémentaires typées permettent d'empiler cartes, valeurs, stats,
// citations et CTA par-dessus le corps.
const heroSchema = z.object({
  titre: z.string(),
  sousTitre: z.string().optional(),
  accroche: z.string().optional(),
  variant: z
    .enum(['orange', 'violet', 'beige', 'magenta', 'vert', 'bleu'])
    .default('beige'),
  cta_primaire: z
    .object({
      label: z.string(),
      href: z.string(),
      externe: z.boolean().default(false),
    })
    .optional(),
  cta_secondaire: z
    .object({
      label: z.string(),
      href: z.string(),
      externe: z.boolean().default(false),
    })
    .optional(),
});

const fondEnum = z
  .enum(['paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu'])
  .optional();

const couleurEnum = z.enum(['orange', 'violet', 'magenta', 'vert', 'bleu']).optional();

const sectionSchema = z.discriminatedUnion('type', [
  // Texte riche (markdown)
  z.object({
    type: z.literal('prose'),
    titre: z.string().optional(),
    fond: fondEnum,
    body: z.string(),
  }),
  // Grille de cartes
  z.object({
    type: z.literal('cartes'),
    titre: z.string().optional(),
    fond: fondEnum,
    colonnes: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
    cartes: z.array(
      z.object({
        titre: z.string(),
        description: z.string(),
        href: z.string().optional(),
        cta: z.string().optional(),
        couleur: couleurEnum,
      }),
    ),
  }),
  // Grille de valeurs
  z.object({
    type: z.literal('valeurs'),
    titre: z.string().optional(),
    fond: fondEnum,
    valeurs: z.array(
      z.object({
        nom: z.string(),
        description: z.string(),
        couleur: couleurEnum,
      }),
    ),
  }),
  // Chiffres clés
  z.object({
    type: z.literal('stats'),
    titre: z.string().optional(),
    fond: fondEnum,
    intro: z.string().optional(),
    stats: z.array(
      z.object({
        valeur: z.string(),
        legende: z.string(),
        source: z.string().optional(),
      }),
    ),
  }),
  // Citation / témoignage mis en avant
  z.object({
    type: z.literal('citation'),
    fond: fondEnum,
    citation: z.string(),
    auteur: z.string(),
    role: z.string().optional(),
    variant: z.enum(['beige', 'violet', 'paper']).default('beige'),
    fictif: z.boolean().default(false),
  }),
  // Bandeau CTA
  z.object({
    type: z.literal('cta'),
    fond: fondEnum,
    titre: z.string(),
    corps: z.string().optional(),
    cta_primaire: z
      .object({
        label: z.string(),
        href: z.string(),
        externe: z.boolean().default(false),
      })
      .optional(),
    cta_secondaire: z
      .object({
        label: z.string(),
        href: z.string(),
        externe: z.boolean().default(false),
      })
      .optional(),
  }),
  // Étapes numérotées
  z.object({
    type: z.literal('etapes'),
    titre: z.string().optional(),
    fond: fondEnum,
    couleur: couleurEnum,
    etapes: z.array(
      z.object({
        titre: z.string(),
        description: z.string().optional(),
      }),
    ),
  }),
  // Deux colonnes (texte + picto/image)
  z.object({
    type: z.literal('deux-colonnes'),
    titre: z.string().optional(),
    fond: fondEnum,
    inverse: z.boolean().default(false),
    texte: z.string(),
    picto_couleur: z
      .enum(['orange', 'violet', 'magenta', 'vert', 'bleu', 'beige'])
      .default('orange'),
    image: z.string().optional(),
    image_alt: z.string().optional(),
  }),
  // FAQ (accordéon)
  z.object({
    type: z.literal('faq'),
    titre: z.string().optional(),
    fond: fondEnum,
    questions: z.array(
      z.object({
        question: z.string(),
        reponse: z.string(),
      }),
    ),
  }),
  // Encadré coloré (callout)
  z.object({
    type: z.literal('callout'),
    fond: fondEnum,
    ton: z.enum(['info', 'important', 'astuce', 'note']).default('info'),
    titre: z.string().optional(),
    body: z.string(),
  }),
  // Gros chiffre + explication
  z.object({
    type: z.literal('chiffre-detail'),
    titre: z.string().optional(),
    fond: fondEnum,
    chiffre: z.string(),
    texte: z.string(),
    source: z.string().optional(),
    alignement: z.enum(['gauche', 'droite']).default('gauche'),
    couleur: couleurEnum,
  }),
  // Grille de formats (cartes riches avec points)
  z.object({
    type: z.literal('formats'),
    titre: z.string().optional(),
    fond: fondEnum,
    colonnes: z.union([z.literal(2), z.literal(3)]).default(2),
    formats: z.array(
      z.object({
        titre: z.string(),
        description: z.string().optional(),
        points: z.array(z.string()).default([]),
        couleur: couleurEnum,
        cta: z
          .object({
            label: z.string(),
            href: z.string(),
            externe: z.boolean().default(false),
          })
          .optional(),
      }),
    ),
  }),
  // Citation pleine largeur
  z.object({
    type: z.literal('citation-large'),
    fond: fondEnum,
    citation: z.string(),
    auteur: z.string().optional(),
    role: z.string().optional(),
    variant: z.enum(['orange', 'violet', 'beige', 'paper']).default('paper'),
  }),
  // Texte + photo côte à côte
  z.object({
    type: z.literal('texte-photo'),
    titre: z.string().optional(),
    fond: fondEnum,
    texte: z.string(),
    image: z.string(),
    image_alt: z.string(),
    image_legende: z.string().optional(),
    image_credit: z.string().optional(),
    position: z.enum(['gauche', 'droite']).default('droite'),
    ratio: z
      .enum(['50-50', '2-tiers-texte', '2-tiers-image'])
      .default('50-50'),
  }),
  // Image centrée avec légende
  z.object({
    type: z.literal('figure'),
    fond: fondEnum,
    image: z.string(),
    alt: z.string(),
    legende: z.string().optional(),
    credit: z.string().optional(),
    taille: z.enum(['petite', 'moyenne', 'grande']).default('moyenne'),
  }),
  // Galerie (2/3/4 colonnes, lightbox optionnelle)
  z.object({
    type: z.literal('galerie'),
    titre: z.string().optional(),
    fond: fondEnum,
    colonnes: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
    lightbox: z.boolean().default(false),
    images: z.array(
      z.object({
        image: z.string(),
        alt: z.string(),
        legende: z.string().optional(),
      }),
    ),
  }),
  // Bandeau pleine largeur image + titre overlay
  z.object({
    type: z.literal('bandeau-image'),
    image: z.string(),
    alt: z.string(),
    titre: z.string(),
    sousTitre: z.string().optional(),
    hauteur: z.enum(['petite', 'moyenne', 'grande']).default('moyenne'),
    position_texte: z.enum(['gauche', 'centre', 'droite']).default('centre'),
    position_verticale: z
      .enum(['haut', 'milieu', 'bas'])
      .default('milieu'),
    scrim: z.boolean().default(true),
  }),
  // Portraits (grille personnes)
  z.object({
    type: z.literal('portraits'),
    titre: z.string().optional(),
    fond: fondEnum,
    colonnes: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
    forme: z.enum(['rond', 'carre']).default('rond'),
    personnes: z.array(
      z.object({
        nom: z.string(),
        role: z.string().optional(),
        photo: z.string().optional(),
        photo_alt: z.string().optional(),
        bio: z.string().optional(),
        lien: z.string().optional(),
        lien_label: z.string().optional(),
      }),
    ),
  }),
  // Frise chronologique
  z.object({
    type: z.literal('timeline'),
    titre: z.string().optional(),
    fond: fondEnum,
    alignement: z.enum(['vertical', 'alterne']).default('vertical'),
    etapes: z.array(
      z.object({
        date: z.string(),
        titre: z.string(),
        texte: z.string().optional(),
        image: z.string().optional(),
        image_alt: z.string().optional(),
      }),
    ),
  }),
]);

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    hero: heroSchema.optional(),
    sections: z.array(sectionSchema).default([]),
    noindex: z.boolean().default(false),
    toc: z.boolean().default(false),
  }),
});

// ---------- Paramètres globaux du site ----------
const site = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/site' }),
  schema: z.object({
    nom_asso: z.string(),
    url: z.string(),
    accroche_globale: z.string(),
    mission: z.string(),
    email_contact: z.string(),
    telephone: z.string(),
    adresse: z.string(),
    helloasso_don: z.string(),
    helloasso_adhesion: z.string().optional(),
    directeur_publication: z.string(),
    siren: z.string().optional(),
    rna: z.string().optional(),
    reseaux: z.object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      linkedin: z.string().optional(),
    }),
    banderole_urgence: z
      .object({
        active: z.boolean().default(false),
        message: z.string().optional(),
        couleur: z.enum(['orange', 'violet', 'magenta']).default('orange'),
      })
      .optional(),
  }),
});

export const collections = {
  actualites,
  evenements,
  partenaires,
  equipe,
  documents,
  temoignages,
  pages,
  site,
};
