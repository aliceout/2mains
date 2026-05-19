// Helper pour charger les paramètres globaux du site.
//
// Le contenu éditable vient de 5 globals Payload distincts (split fait
// en mai 2026 pour rendre l'UI admin moins surchargée) :
//   - identite          : nom, URL, accroche, mission, mentions légales
//   - parametres        : toggles techniques (noindex, gate, no_cache)
//   - navigation        : header (nav + boutons) + colonnes footer
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
  /** Mission markdown legacy. */
  mission?: string;
  /** Mission Lexical (nouveau richText). Si rempli, écrase mission. */
  mission_rich?: unknown;
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
  /** Message markdown legacy. */
  message?: string;
  /** Message Lexical (nouveau richText). Si rempli, écrase message. */
  message_rich?: unknown;
  couleur?: 'orange' | 'violet' | 'magenta';
};

/** Sous-objet « lien » du global Navigation. Côté Payload : `type` peut
 *  être 'page' (relation vers Pages, populated avec depth >= 1) ou
 *  'custom' (URL libre). Le helper `resolveLink` réduit ça à un
 *  simple `href` string pour les composants. */
type PayloadLink = {
  type?: 'page' | 'custom';
  page?: number | { id: number; slug?: string } | null;
  url?: string | null;
};

type NavigationGlobal = {
  header_nav?: Array<{
    label: string;
    is_dropdown?: boolean;
    link?: PayloadLink;
    children?: Array<{ label: string; link?: PayloadLink }>;
  }>;
  header_buttons?: Array<{
    label: string;
    link?: PayloadLink;
  }>;
  footer_columns?: Array<{
    title: string;
    links?: Array<{
      label: string;
      link?: PayloadLink;
      highlight?: boolean;
    }>;
  }>;
};

/** Item de la nav header consommé par les composants (lien résolu). */
export type NavItem = {
  label: string;
  /** Si absent, l'item est un parent de dropdown non cliquable (trigger
   *  visuel uniquement). Les enfants sont dans `children`. */
  href?: string;
  children?: NavItem[];
};

/** Un des 3 boutons d'action du header (Blog / Rejoindre / Soutenir). */
export type HeaderButton = {
  label: string;
  href: string;
};

/** Une colonne de liens du footer. */
export type FooterColumn = {
  title: string;
  links: Array<{
    label: string;
    href: string;
    highlight?: boolean;
  }>;
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
    /** Navigation principale du header (items + dropdowns). */
    header_nav: NavItem[];
    /** Les 3 boutons d'action à droite du header. */
    header_buttons: HeaderButton[];
    /** Colonnes de liens du footer. */
    footer_columns: FooterColumn[];
  };

/** Résout un lien Payload (`{type, page, url}`) en string `href`.
 *  Retourne `undefined` si rien d'exploitable (lien vide ou populated
 *  partiellement). */
function resolveLink(link: PayloadLink | undefined): string | undefined {
  if (!link) return undefined;
  if (link.type === 'page') {
    if (link.page && typeof link.page === 'object' && link.page.slug) {
      return `/${link.page.slug}`;
    }
    return undefined;
  }
  // type === 'custom' ou non défini → fallback sur url
  return link.url ?? undefined;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const [identite, parametres, navigation, liens, banderole] =
    await Promise.all([
      fetchGlobal<IdentiteGlobal>('identite'),
      fetchGlobal<ParametresGlobal>('parametres'),
      fetchGlobal<NavigationGlobal>('navigation'),
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

  // Helloasso : récupéré tôt pour pouvoir l'utiliser dans les fallbacks
  // de la navigation (les liens "Faire un don" / "Newsletter" du footer
  // par défaut pointent vers ces URLs).
  const helloassoDon =
    liens.helloasso?.don ??
    'https://www.helloasso.com/associations/2mains-de-femmes';

  // Navigation : résolution des liens Payload (`{type, page, url}`) en
  // simples `href` string. Si le global est vide (cas dev frais ou
  // premier deploy avant seed migration), on retombe sur les valeurs
  // historiques hardcodées (DEFAULT_HEADER_NAV, etc.) pour que le site
  // reste fonctionnel.
  const headerNav: NavItem[] =
    navigation.header_nav && navigation.header_nav.length > 0
      ? navigation.header_nav.map((item) => ({
          label: item.label,
          href: item.is_dropdown ? undefined : resolveLink(item.link),
          children: item.is_dropdown
            ? (item.children ?? []).map((c) => ({
                label: c.label,
                href: resolveLink(c.link),
              }))
            : undefined,
        }))
      : DEFAULT_HEADER_NAV;

  const headerButtons: HeaderButton[] =
    navigation.header_buttons && navigation.header_buttons.length > 0
      ? navigation.header_buttons.map((b) => ({
          label: b.label,
          href: resolveLink(b.link) ?? '#',
        }))
      : DEFAULT_HEADER_BUTTONS;

  const footerColumns: FooterColumn[] =
    navigation.footer_columns && navigation.footer_columns.length > 0
      ? navigation.footer_columns.map((col) => ({
          title: col.title,
          links: (col.links ?? []).map((l) => ({
            label: l.label,
            href: resolveLink(l.link) ?? '#',
            highlight: l.highlight === true ? true : undefined,
          })),
        }))
      : defaultFooterColumns(helloassoDon, liens.helloasso?.newsletter);

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
    helloasso_don: helloassoDon,
    helloasso_adhesion: liens.helloasso?.adhesion,
    helloasso_newsletter: liens.helloasso?.newsletter,
    // Email de contact = MAIL_TO côté env. Si pas configuré, le champ
    // est `undefined` et les composants qui l'affichent doivent
    // gérer le cas (mailto silencieux, lien caché, etc.).
    email_contact: process.env.MAIL_TO || undefined,
    header_nav: headerNav,
    header_buttons: headerButtons,
    footer_columns: footerColumns,
  };
}

// ─── Valeurs par défaut (fallback si le global Navigation est vide) ──
//
// Ces constantes reproduisent l'état hardcodé d'avant le global
// Navigation. Elles servent de safety net en dev frais (DB vide, seed
// pas appliqué) ou si Audrey vide accidentellement le global. Une fois
// le global rempli (à minima par la seed migration en prod), ces
// défauts ne sont jamais utilisés.

const DEFAULT_HEADER_NAV: NavItem[] = [
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
];

const DEFAULT_HEADER_BUTTONS: HeaderButton[] = [
  { label: "Le blog — actualités de l'association", href: '/actualites' },
  {
    label: 'Nous rejoindre — bénévolat, praticien·ne·s, adhésion',
    href: '/agir',
  },
  { label: 'Nous soutenir — don, mécénat', href: '/soutenir' },
];

function defaultFooterColumns(
  helloassoDon: string,
  helloassoNewsletter?: string,
): FooterColumn[] {
  return [
    {
      title: 'Actualités',
      links: [
        { label: 'Blog', href: '/actualites' },
        { label: 'Agenda', href: '/agenda' },
        { label: 'Nos documents cadres', href: '/documents' },
        { label: 'Nous contacter', href: '/contact' },
        { label: 'Faire un don →', href: helloassoDon, highlight: true },
      ],
    },
    {
      title: 'Infos légales',
      links: [
        { label: 'Mentions légales', href: '/mentions-legales' },
        { label: 'RGPD et confidentialité', href: '/rgpd' },
        { label: 'Accessibilité : non conforme', href: '/accessibilite' },
        {
          label: "S'inscrire à la newsletter →",
          href: helloassoNewsletter ?? helloassoDon,
        },
        { label: 'Admin', href: '/cms/admin' },
      ],
    },
  ];
}

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

// Fil d'Ariane calculé depuis le pathname. Cherche d'abord dans la nav
// (passée en argument car async — vient du global Navigation via
// getSiteSettings), puis dans breadcrumbLabels, puis fallback titlecase
// du slug.
export function getBreadcrumbs(
  pathname: string,
  nav: NavItem[] = DEFAULT_HEADER_NAV,
): { label: string; href: string }[] {
  const clean = pathname.replace(/\/$/, '');
  if (clean === '' || clean === '/') return [];

  const segments = clean.split('/').filter(Boolean);
  const crumbs = [{ label: 'Accueil', href: '/' }];
  let acc = '';
  for (const seg of segments) {
    acc += '/' + seg;
    const label =
      findNavLabel(acc, nav) ??
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
