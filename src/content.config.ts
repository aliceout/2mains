import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
  }),
});

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

const temoignages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/temoignages' }),
  schema: z.object({
    auteur: z.string(),
    role: z.string().optional(),
    contexte: z.enum(['participante', 'partenaire', 'professionnelle']),
    photo: z.string().optional(),
    ordre: z.number().default(0),
    fictif: z.boolean().default(false),
  }),
});

export const collections = {
  evenements,
  partenaires,
  equipe,
  documents,
  temoignages,
};
