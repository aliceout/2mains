// Configuration globale du site.
// Ces valeurs seront déplaçables dans une collection CMS `site/settings.md`.

export const site = {
  name: '2mains de femmes',
  url: 'https://2mainsdefemmes.org',
  tagline: 'Se (re)toucher pour se (re)lier',
  mission:
    "Nous agissons contre l'isolement corporel des femmes par le toucher relationnel.",
  contact: {
    email: 'contact@2mainsdefemmes.org',
    phone: '06 07 08 57 66',
    address: 'Tiers-lieu La Médiane, 255 rue de Créqui, 69003 Lyon',
  },
  helloasso: {
    don: 'https://www.helloasso.com/associations/2mains-de-femmes',
    adhesion:
      'https://www.helloasso.com/associations/2mains-de-femmes/adhesions/adhesion-a-l-association-2mains-de-femmes',
  },
  social: {
    facebook: 'https://www.facebook.com/2mainsdefemmes',
    instagram: 'https://www.instagram.com/2mainsdefemmes',
    linkedin: '',
  },
  legal: {
    siren: '', // TODO Audrey
    rna: '', // TODO Audrey (numéro W…)
    directeurPublication: 'Audrey Relandeau',
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export const navigation: NavItem[] = [
  { label: 'Accueil', href: '/' },
  {
    label: "L'association",
    href: '/association',
    children: [
      { label: 'Qui sommes-nous', href: '/association/qui-sommes-nous' },
      { label: 'Nos interventions', href: '/association/interventions' },
      { label: 'Notre équipe', href: '/association/equipe' },
      { label: 'Nos documents', href: '/association/documents' },
      { label: 'Financeurs et partenaires', href: '/association/financeurs' },
    ],
  },
  {
    label: 'Isolement corporel',
    href: '/isolement-corporel',
    children: [
      { label: 'Un impensé social', href: '/isolement-corporel/impense' },
      { label: 'Le toucher relationnel', href: '/isolement-corporel/toucher' },
      { label: 'Ressources', href: '/isolement-corporel/ressources' },
    ],
  },
  {
    label: 'Nos activités',
    href: '/pour',
    children: [
      { label: "Pour une structure d'accueil", href: '/pour/structures' },
      { label: 'Pour une entreprise', href: '/pour/entreprises' },
      { label: 'Pour une femme concernée', href: '/pour/femmes' },
      { label: 'Ils nous ont fait confiance', href: '/pour/temoignages' },
    ],
  },
  {
    label: 'Agir',
    href: '/agir',
    children: [
      { label: 'Devenir bénévole', href: '/agir/benevolat' },
      { label: 'Praticien·nes solidaires', href: '/agir/praticiennes' },
    ],
  },
  {
    label: 'Soutenir',
    href: '/soutenir',
    children: [
      { label: 'Faire un don', href: '/soutenir/dons' },
      { label: 'Mécénat entreprises', href: '/soutenir/mecenat' },
    ],
  },
];
