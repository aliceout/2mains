import type { Block } from 'payload';

/**
 * Bloc « Liste des partenaires » : affiche automatiquement la collection
 * Partenaires, groupée par type, avec 3 présentations distinctes
 * (financeurs / partenaires associatifs / réseaux). Le contenu de chaque
 * partenaire (nom, logo, site, description, type) s'édite dans la
 * collection « Partenaires » ; ce bloc ne pilote que les titres de
 * section et le texte additionnel.
 *
 * Rendu par PartenairesListe.astro — logos + liens (carte cliquable)
 * gérés là.
 */
export const PartenairesListe: Block = {
  slug: 'liste-partenaires',
  labels: { singular: 'Liste des partenaires', plural: 'Listes de partenaires' },
  fields: [
    {
      name: 'titre_financeurs',
      type: 'text',
      label: 'Titre — section financeurs',
      defaultValue: 'Nos financeurs',
    },
    {
      name: 'titre_partenaires',
      type: 'text',
      label: 'Titre — section partenaires associatifs',
      defaultValue: 'Nos partenaires associatifs et médico-sociaux',
    },
    {
      name: 'texte_partenaires',
      type: 'textarea',
      label: 'Texte sous les partenaires associatifs (optionnel)',
    },
    {
      name: 'titre_reseaux',
      type: 'text',
      label: 'Titre — section réseaux',
      defaultValue: "Nos réseaux d'accompagnement",
    },
  ],
};
