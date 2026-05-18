// Helper pour charger les paramètres globaux du site.
//
// Le contenu éditable vient de 4 globals Payload distincts (split fait
// en mai 2026 pour rendre l'UI admin moins surchargée) :
//   - identite          : nom, URL, accroche, mission, mentions légales
//   - parametres        : toggles techniques (noindex, gate, no_cache)
//   - liens-externes    : réseaux sociaux + URLs HelloAsso
//   - banderole-urgence : bandeau d'alerte top-of-page
// On les fetch en parallèle puis on les merge dans une seule structure
// `SiteSettings` pour ne pas casser les ~50 composants qui consomment
// ce shape.
//
// `email_contact` vient de l'env MAIL_TO (pas la peine de dupliquer
// dans Payload — le service mail l'a déjà).
import { fetchGlobal } from './payload';

type IdentiteGlobal = {
  nom_asso?: string;
  url?: string;
  accroche_globale?: string;
  mission?: string;
  directeur_publication?: string;
  siren?: string;
  rna?: string;
  adresse?: string;
};

type ParametresGlobal = {
  noindex?: boolean;
  gate_password?: string;
  no_cache?: boolean;
};

type LiensExternesGlobal = {
  reseaux?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  helloasso?: {
    don?: string;
    adhesion?: string;
    newsletter?: string;
  };
};

type BanderoleUrgenceGlobal = {
  active?: boolean;
  message?: string;
  couleur?: 'orange' | 'violet' | 'magenta';
};

/** Forme unifiée consommée par les composants Astro. Garde la même
 *  shape qu'avant le split de mai 2026 (banderole en sous-objet, etc.)
 *  pour ne pas avoir à refactor les consumers. */
export type SiteSettings = IdentiteGlobal &
  ParametresGlobal &
  LiensExternesGlobal & {
    banderole_urgence?: BanderoleUrgenceGlobal;
    helloasso_don: string;
    helloasso_adhesion?: string;
    helloasso_newsletter?: string;
    email_contact?: string;
  };

export async function getSiteSettings(): Promise<SiteSettings> {
  const [identite, parametres, liens, banderole] = await Promise.all([
    fetchGlobal<IdentiteGlobal>('identite'),
    fetchGlobal<ParametresGlobal>('parametres'),
    fetchGlobal<LiensExternesGlobal>('liens-externes'),
    fetchGlobal<BanderoleUrgenceGlobal>('banderole-urgence'),
  ]);

  // url : la valeur source de vérité c'est le champ `url` du global
  // Identité (saisie par Audrey via /cms/admin). Si elle n'a pas (encore)
  // été renseignée — typique en dev frais ou juste après une migration —
  // on retombe sur ADDRESS (env), puis sur localhost pour ne JAMAIS
  // throw "Invalid URL" côté composants qui font `new URL(..., settings.url)`.
  const url =
    identite.url ?? process.env.ADDRESS ?? 'http://localhost:3001';

  return {
    ...identite,
    url,
    ...parametres,
    reseaux: liens.reseaux,
    helloasso: liens.helloasso,
    // banderole_urgence reste un sous-objet dans SiteSettings (compat
    // avec Layout.astro qui lit `settings.banderole_urgence?.active`).
    banderole_urgence: banderole,
    // Aplatissement helloasso.* → helloasso_* pour rester compat avec
    // les composants existants (Header.astro, dons.astro, etc.).
    // Fallback HelloAsso : URL générique de l'asso si Audrey n'a pas
    // (encore) renseigné le champ dans /cms/admin. Reste hardcodée
    // parce que c'est un slug HelloAsso spécifique au compte.
    helloasso_don:
      liens.helloasso?.don ??
      'https://www.helloasso.com/associations/2mains-de-femmes',
    helloasso_adhesion: liens.helloasso?.adhesion,
    helloasso_newsletter: liens.helloasso?.newsletter,
    // Email de contact = MAIL_TO côté env. Si pas configuré, le champ
    // est `undefined` et les composants qui l'affichent doivent
    // gérer le cas (mailto silencieux, lien caché, etc.).
    email_contact: process.env.MAIL_TO || undefined,
  };
}

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
  // Note : les anciens enfants « Agir et soutenir » (bénévole, praticien·nes,
  // don, mécénat) sont maintenant accessibles via les 3 boutons d'action
  // du header (Blog / Agir / Soutenir) qui pointent vers /agir et /soutenir,
  // pages d'aiguillage qui listent ces sous-pages.
];

// Labels pour le fil d'Ariane sur les pages hors-top-nav (footer, contenu
// standalone). Évite le fallback moche « Benevolat » au lieu de
// « Devenir bénévole ».
const breadcrumbLabels: Record<string, string> = {
  '/qui-sommes-nous': 'Qui sommes-nous',
  '/publics-cible': 'Nos publics cible',
  '/interventions': 'Nos interventions',
  '/financeurs': 'Nos financeurs et réseaux',
  '/structures': 'Structure santé/social',
  '/femmes': 'Femme concernée',
  '/entreprises': 'Nos offres entreprises',
  '/agir': 'Agir',
  '/benevolat': 'Devenir bénévole',
  '/praticiennes': 'Réseau des praticien·ne·s',
  '/adherer': 'Adhérer',
  '/soutenir': 'Soutenir',
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
