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
  href?: string;
  children?: NavItem[];
};

// Navigation principale — structure choisie par Audrey (cf. chat WA
// 16/10/25 ligne 470 : 5 entrées, segmentées par type d'interlocuteur).
// Pas de dropdown : chaque entrée navigue vers sa page de catégorie, et
// la sous-navigation s'affiche via le composant SubNav sous le header
// (option 1 tranchée le 17/10).
export const navigation: NavItem[] = [
  { label: 'Accueil', href: '/' },
  {
    label: "L'association",
    href: '/association',
    children: [
      { label: 'Qui sommes-nous', href: '/association/qui-sommes-nous' },
      { label: 'Nos interventions', href: '/association/interventions' },
      { label: 'Notre équipe', href: '/association/equipe' },
      { label: 'Isolement corporel', href: '/isolement-corporel' },
      { label: 'Nos documents', href: '/association/documents' },
      { label: 'Financeurs et partenaires', href: '/association/financeurs' },
    ],
  },
  {
    label: 'Structures & femmes',
    href: '/pour',
    children: [
      { label: "Pour une structure d'accueil", href: '/pour/structures' },
      { label: 'Pour une femme concernée', href: '/pour/femmes' },
      { label: 'Ils nous ont fait confiance', href: '/pour/temoignages' },
    ],
  },
  { label: 'Entreprises', href: '/pour/entreprises' },
  { label: 'Faire un don', href: '/soutenir/dons' },
];

// Labels pour le fil d'Ariane sur les pages hors-top-nav (footer, contenu
// standalone). Évite le fallback moche « Benevolat » au lieu de
// « Devenir bénévole ».
const breadcrumbLabels: Record<string, string> = {
  '/agir': 'Agir avec nous',
  '/agir/benevolat': 'Devenir bénévole',
  '/agir/praticiennes': 'Praticien·nes solidaires',
  '/soutenir': 'Soutenir',
  '/soutenir/mecenat': 'Mécénat entreprises',
  '/agenda': 'Agenda',
  '/actualites': 'Actualités',
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

// Fil d'Ariane calculé depuis le pathname. Cherche d'abord dans
// navigation, puis dans la table breadcrumbLabels, puis fallback
// titlecase du slug.
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

// `true` si l'item est concerné par le pathname courant : soit son propre
// href matche (exact ou préfixe), soit un de ses enfants matche.
// Utilisé par le Header pour surligner l'onglet actif, et par SubNav pour
// décider quelle sous-nav afficher.
export function matchesItem(pathname: string, item: NavItem): boolean {
  const clean = pathname.replace(/\/$/, '') || '/';
  if (item.href === '/') return clean === '/';
  const hrefs = [
    item.href,
    ...(item.children?.map((c) => c.href) ?? []),
  ].filter((h): h is string => Boolean(h));
  // Pour éviter que /pour aspire /pour/entreprises (H4 dédié), on vérifie
  // qu'aucun autre item de la nav n'a un préfixe plus spécifique.
  const match = hrefs.some(
    (href) => clean === href || clean.startsWith(href + '/'),
  );
  if (!match) return false;
  // Vérifie qu'un autre item top-level n'a pas un match plus spécifique.
  for (const other of navigation) {
    if (other === item) continue;
    const otherMatch = matchesItemShallow(clean, other);
    if (!otherMatch) continue;
    const thisBest = longestMatch(clean, hrefs);
    const otherHrefs = [
      other.href,
      ...(other.children?.map((c) => c.href) ?? []),
    ].filter((h): h is string => Boolean(h));
    const otherBest = longestMatch(clean, otherHrefs);
    if (otherBest > thisBest) return false;
  }
  return true;
}

function matchesItemShallow(pathname: string, item: NavItem): boolean {
  const hrefs = [
    item.href,
    ...(item.children?.map((c) => c.href) ?? []),
  ].filter((h): h is string => Boolean(h));
  return hrefs.some(
    (href) => pathname === href || pathname.startsWith(href + '/'),
  );
}

function longestMatch(pathname: string, hrefs: string[]): number {
  let best = -1;
  for (const href of hrefs) {
    if (pathname === href || pathname.startsWith(href + '/')) {
      if (href.length > best) best = href.length;
    }
  }
  return best;
}

// Retourne l'item top-level dont la sous-navigation doit s'afficher pour
// le pathname courant. null si aucun (pages standalone hors catégorie).
export function getCurrentCategory(pathname: string): NavItem | null {
  for (const item of navigation) {
    if (!item.children || item.children.length === 0) continue;
    if (matchesItem(pathname, item)) return item;
  }
  return null;
}
