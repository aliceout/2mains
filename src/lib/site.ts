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

// Navigation principale — refonte arborescence V2 (demande Audrey,
// PDF « Nouvelle orga »). « Accueil » sort du header (le clic sur le
// logo ramène à la home). « Agir et soutenir » remonte du footer
// vers le header. Documents descend dans le footer. Le bouton
// « Faire un don » (externe HelloAsso) est rendu séparément dans le
// Header.
export const navigation: NavItem[] = [
  {
    label: "L'association",
    children: [
      { label: 'Qui sommes-nous', href: '/qui-sommes-nous' },
      { label: 'Nos publics cible', href: '/publics-cible' },
      { label: 'Nos interventions', href: '/interventions' },
      { label: 'Nos financeurs et réseaux', href: '/financeurs' },
    ],
  },
  { label: "L'isolement corporel", href: '/isolement-corporel' },
  { label: 'Structure santé/social', href: '/structures' },
  { label: 'Femme concernée', href: '/femmes' },
  {
    label: 'Entreprise',
    children: [
      { label: 'Nos offres', href: '/entreprises' },
      { label: 'Mécénat entreprise', href: '/mecenat' },
    ],
  },
  {
    label: 'Agir et soutenir',
    children: [
      { label: 'Devenir bénévole', href: '/benevolat' },
      { label: 'Réseau des praticien·ne·s', href: '/praticiennes' },
      { label: 'Faire un don', href: '/dons' },
      { label: 'Mécénat entreprise', href: '/mecenat' },
    ],
  },
];

// Labels pour le fil d'Ariane sur les pages hors-top-nav (footer, contenu
// standalone). Évite le fallback moche « Benevolat » au lieu de
// « Devenir bénévole ».
const breadcrumbLabels: Record<string, string> = {
  '/qui-sommes-nous': 'Qui sommes-nous',
  '/publics-cible': 'Nos publics cible',
  '/interventions': 'Nos interventions',
  '/financeurs': 'Nos financeurs et réseaux',
  '/historique': 'Notre historique',
  '/structures': 'Structure santé/social',
  '/femmes': 'Femme concernée',
  '/entreprises': 'Nos offres entreprises',
  '/benevolat': 'Devenir bénévole',
  '/praticiennes': 'Réseau des praticien·ne·s',
  '/dons': 'Faire un don',
  '/mecenat': 'Mécénat entreprise',
  '/documents': 'Nos documents cadres',
  '/contact': 'Nous écrire',
  '/accessibilite': 'Accessibilité',
  '/mentions-legales': 'Mentions légales',
  '/rgpd': 'RGPD et confidentialité',
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
