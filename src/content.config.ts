import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
]);

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    hero: heroSchema.optional(),
    sections: z.array(sectionSchema).default([]),
    noindex: z.boolean().default(false),
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
  evenements,
  partenaires,
  equipe,
  documents,
  temoignages,
  pages,
  site,
};
