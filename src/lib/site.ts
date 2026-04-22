// Helper pour charger les paramètres globaux depuis la collection `site`.
// Utilisé par les pages et composants pour éviter le code dur.
import { getCollection, getEntry } from 'astro:content';

export async function getSiteSettings() {
  let entry = await getEntry('site', 'settings');
  if (!entry) {
    // Fallback : prendre la première entrée disponible (en cas d'id différent)
    const all = await getCollection('site');
    if (all.length === 0) {
      throw new Error(
        "content/site/settings.md introuvable — vérifier content/site/ et src/content/config.ts",
      );
    }
    entry = all[0];
  }
  return entry.data;
}

export type SiteSettings = Awaited<ReturnType<typeof getSiteSettings>>;

// La navigation reste en dur — elle relève de la structure du site, pas
// du contenu. Pour la modifier, éditer ce fichier.
export type NavItem = {
  label: string;
  /** Si absent, l'élément est un « parent de dropdown » : pas de navigation,
   *  juste un trigger visuel pour les enfants. Les enfants sont listés dans
   *  `children`. Utilisé quand le parent ne représente pas une page en propre. */
  href?: string;
  children?: NavItem[];
};

// Fil d'Ariane calculé depuis le pathname + l'arbre de navigation.
// Retourne [] pour la home — pas de breadcrumb affiché sur /.
export function getBreadcrumbs(
  pathname: string,
): { label: string; href: string }[] {
  const clean = pathname.replace(/\/$/, '');
  if (clean === '' || clean === '/') return [];

  function findLabel(href: string, items: NavItem[]): string | null {
    for (const item of items) {
      if (item.href === href) return item.label;
      if (item.children) {
        const found = findLabel(href, item.children);
        if (found) return found;
      }
    }
    return null;
  }

  const segments = clean.split('/').filter(Boolean);
  const crumbs = [{ label: 'Accueil', href: '/' }];
  let acc = '';
  for (const seg of segments) {
    acc += '/' + seg;
    const label =
      findLabel(acc, navigation) ??
      seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
    crumbs.push({ label, href: acc });
  }
  return crumbs;
}

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
  {
    label: 'Actualités',
    // Parent sans href : juste un trigger de dropdown, pas une page en propre.
    children: [
      { label: 'Blog', href: '/actualites' },
      { label: 'Agenda', href: '/agenda' },
    ],
  },
];
