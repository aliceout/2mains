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

export type NavItem = {
  label: string;
  /** Si absent, l'item est un parent de dropdown non cliquable (trigger
   *  visuel uniquement). Les enfants sont dans `children`. */
  href?: string;
  children?: NavItem[];
};

// Navigation principale — structure inspirée de la spec d'Audrey
// (chat WA 10/10/25 ligne 349 : segmentation par type d'interlocuteur)
// avec parents de dropdown non cliquables. Le bouton « Faire un don » en
// haut à droite (externe HelloAsso) est rendu séparément dans le Header.
export const navigation: NavItem[] = [
  { label: 'Accueil', href: '/' },
  {
    label: "L'association",
    // Parent non cliquable : on ne navigue pas sur cette entrée, on survole
    // pour ouvrir le dropdown.
    children: [
      { label: 'Qui sommes-nous', href: '/association/qui-sommes-nous' },
      { label: 'Nos interventions', href: '/association/interventions' },
      { label: 'Notre équipe', href: '/association/equipe' },
      { label: 'Isolement corporel', href: '/isolement-corporel' },
      { label: 'Témoignages', href: '/pour/temoignages' },
      { label: 'Nos documents', href: '/association/documents' },
      { label: 'Financeurs et partenaires', href: '/association/financeurs' },
    ],
  },
  { label: "Structure d'accueil", href: '/pour/structures' },
  { label: 'Femme concernée', href: '/pour/femmes' },
  { label: 'Entreprise', href: '/pour/entreprises' },
  {
    label: 'Actualités',
    children: [
      { label: 'Blog', href: '/actualites' },
      { label: 'Agenda', href: '/agenda' },
    ],
  },
];

// Labels pour le fil d'Ariane sur les pages hors-top-nav (footer, contenu
// standalone). Évite le fallback moche « Benevolat » au lieu de
// « Devenir bénévole ».
const breadcrumbLabels: Record<string, string> = {
  '/agir': 'Agir avec nous',
  '/agir/benevolat': 'Devenir bénévole',
  '/agir/praticiennes': 'Praticien·nes solidaires',
  '/soutenir': 'Soutenir',
  '/soutenir/dons': 'Faire un don',
  '/soutenir/mecenat': 'Mécénat entreprises',
  '/contact': 'Nous écrire',
  '/accessibilite': 'Accessibilité',
  '/mentions-legales': 'Mentions légales',
  '/politique-confidentialite': 'Politique de confidentialité',
  '/isolement-corporel/impense': 'Un impensé social',
  '/isolement-corporel/toucher': 'Le toucher relationnel',
  '/isolement-corporel/ressources': 'Ressources',
};

function findNavLabel(href: string, items: NavItem[]): string | null {
  for (const item of items) {
    if (item.href === href) return item.label;
    if (item.children) {
      const found = findNavLabel(href, item.children);
      if (found) return found;
    }
  }
  return null;
}

// Fil d'Ariane calculé depuis le pathname. Cherche d'abord dans la nav,
// puis dans breadcrumbLabels, puis fallback titlecase du slug.
export function getBreadcrumbs(
  pathname: string,
): { label: string; href: string }[] {
  const clean = pathname.replace(/\/$/, '');
  if (clean === '' || clean === '/') return [];

  const segments = clean.split('/').filter(Boolean);
  const crumbs = [{ label: 'Accueil', href: '/' }];
  let acc = '';
  for (const seg of segments) {
    acc += '/' + seg;
    const label =
      findNavLabel(acc, navigation) ??
      breadcrumbLabels[acc] ??
      seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
    crumbs.push({ label, href: acc });
  }
  return crumbs;
}

// true si l'item top-level doit être surligné : soit son propre href matche,
// soit un enfant matche (route courante dans la même catégorie).
export function matchesItem(pathname: string, item: NavItem): boolean {
  const clean = pathname.replace(/\/$/, '') || '/';
  if (item.href === '/') return clean === '/';
  const hrefs = [
    item.href,
    ...(item.children?.map((c) => c.href) ?? []),
  ].filter((h): h is string => Boolean(h));
  return hrefs.some(
    (href) => clean === href || clean.startsWith(href + '/'),
  );
}
