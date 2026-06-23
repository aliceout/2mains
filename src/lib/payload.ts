/**
 * Client Payload CMS pour Astro SSR.
 *
 * Tape l'API REST de Payload via le réseau docker interne en prod
 * (`http://payload:3001/cms/api/...`) ou localhost en dev. Tous les
 * appels sont server-side (Astro SSR) — le navigateur du visiteur
 * ne contacte jamais Payload directement.
 */

const INTERNAL_URL =
  // En prod, set par Infisical/compose : http://payload:3001
  process.env.PAYLOAD_INTERNAL_URL ??
  // En dev, Payload tourne sur localhost:3001
  'http://localhost:3001';

/** URL de base de l'API REST Payload (ajoute `/cms/api`). */
const API_BASE = `${INTERNAL_URL.replace(/\/$/, '')}/cms/api`;

/** URL publique pour servir les fichiers media (côté browser).
 *  Normalise ADDRESS : Infisical peut stocker la valeur sans schème
 *  (ex: `2mainsdefemmes.org`). On préfixe `https://` si absent ;
 *  les valeurs déjà préfixées sont conservées. */
const RAW_PUBLIC = process.env.ADDRESS ?? 'http://localhost:3001';
const PUBLIC_URL = /^https?:\/\//.test(RAW_PUBLIC)
  ? RAW_PUBLIC
  : `https://${RAW_PUBLIC}`;

/**
 * Construit l'URL publique d'une image Payload depuis son `filename`
 * (champ `media.filename` retourné par l'API).
 *
 * Ex : `mediaUrl('lyon-sdf.jpg')` → `${ADDRESS}/cms/api/media/file/lyon-sdf.jpg`
 */
export function mediaUrl(filename: string | undefined | null): string | null {
  if (!filename) return null;
  return `${PUBLIC_URL.replace(/\/$/, '')}/cms/api/media/file/${encodeURIComponent(filename)}`;
}

/**
 * Si un champ upload Payload a été populated (depth >= 1), il
 * contient un objet `media` avec `filename`. Helper qui extrait
 * l'URL publique en gérant les cas null / unpopulated.
 */
export function uploadedImageUrl(
  field: { filename?: string } | string | number | null | undefined,
): string | null {
  if (!field) return null;
  if (typeof field === 'string' || typeof field === 'number') {
    // Field non-populated — juste l'ID. Le caller doit faire un
    // refetch avec depth=1 ou un find sur la collection media.
    return null;
  }
  return mediaUrl(field.filename);
}

// ─── Fetch generics ─────────────────────────────────────────────

type FindResult<T> = {
  docs: T[];
  totalDocs: number;
  page: number;
  totalPages: number;
};

async function fetchPayload<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Payload fetch ${url} failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

/**
 * Récupère un document d'une collection par son slug. Retourne null
 * si pas trouvé. Avec `depth=2` les uploads sont populated en objets
 * (donc `media.filename` accessible).
 */
export async function fetchBySlug<T = unknown>(
  collection: string,
  slug: string,
  depth = 2,
): Promise<T | null> {
  const data = await fetchPayload<FindResult<T>>(
    `/${collection}?where[slug][equals]=${encodeURIComponent(slug)}&depth=${depth}&limit=1`,
  );
  return data.docs[0] ?? null;
}

/** Variante pour `pages` — passe par fetchBySlug avec un cast confortable. */
export async function fetchPage<T = unknown>(
  slug: string,
  depth = 2,
): Promise<T | null> {
  return fetchBySlug<T>('pages', slug, depth);
}

/**
 * Récupère tous les documents d'une collection (sans pagination,
 * en supposant que les collections asso restent < 100 entrées).
 */
export async function fetchCollection<T = unknown>(
  collection: string,
  options: {
    depth?: number;
    limit?: number;
    sort?: string;
    where?: string;
  } = {},
): Promise<T[]> {
  const { depth = 2, limit = 100, sort, where } = options;
  const params = new URLSearchParams();
  params.set('depth', String(depth));
  params.set('limit', String(limit));
  if (sort) params.set('sort', sort);
  if (where) params.set('where', where);
  const data = await fetchPayload<FindResult<T>>(
    `/${collection}?${params.toString()}`,
  );
  return data.docs;
}

/** Récupère un global Payload par son slug. */
export async function fetchGlobal<T = unknown>(
  slug: string,
  depth = 1,
): Promise<T> {
  return fetchPayload<T>(`/globals/${slug}?depth=${depth}`);
}

// ─── Transformations shape Payload → shape Astro legacy ─────────
//
// Pour minimiser les changements dans les composants Astro, on
// expose des helpers qui retournent la même shape qu'astro:content
// avant migration : { id, slug, data: {...} } pour les entries,
// data.sections[].type au lieu de blockType, etc.

/**
 * Extrait l'URL publique d'un champ upload Payload populated.
 * Accepte `null`, `undefined`, ou un objet `{filename}`.
 */
function imgUrl(
  field: { filename?: string } | string | number | null | undefined,
): string | undefined {
  if (!field) return undefined;
  if (typeof field === 'string' || typeof field === 'number') return undefined;
  return mediaUrl(field.filename) ?? undefined;
}

/** Désimbriquer [{field: 'val'}, ...] → ['val', ...]. */
function unwrapArray<T extends string>(
  arr: Array<Record<string, T>> | undefined,
  key: string,
): T[] | undefined {
  if (!arr) return undefined;
  return arr.map((o) => o[key]).filter((v): v is T => Boolean(v));
}

/**
 * Remplace toutes les valeurs `null` par `undefined`. Payload
 * sérialise les selects vides en null, mais les defaults ES6
 * (`{x = 'paper'} = props`) ne s'appliquent qu'à undefined →
 * les composants Astro plantent sur `null.bg`. Cette normalisation
 * garantit que les defaults marchent comme avant.
 */
function nullsToUndefined<T>(obj: T): T {
  if (obj === null) return undefined as T;
  if (Array.isArray(obj)) {
    return obj.map((v) => nullsToUndefined(v)) as T;
  }
  if (typeof obj === 'object' && obj !== null) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const cleaned = nullsToUndefined(v);
      if (cleaned !== undefined) out[k] = cleaned;
    }
    return out as T;
  }
  return obj;
}

/**
 * Sous-objet « lien » Payload (champ groupé `link`) : peut être
 * `type='page'` (relation vers Pages, populated avec depth >= 1) ou
 * `type='custom'` (URL libre, avec flag `externe` pour `target=_blank`).
 *
 * Ce shape vit dans Payload sous `cta_primaire.link`, `carte.link`,
 * `personne.link`, `format.cta.link`, etc. Le helper `resolveLink`
 * l'aplatit en `{href, externe}` pour que les composants Astro
 * consomment toujours les mêmes champs string/boolean qu'avant.
 */
export type PayloadLink = {
  type?: 'page' | 'custom';
  page?: number | { id: number; slug?: string } | null;
  url?: string | null;
  externe?: boolean | null;
};

/**
 * Aplatit un `PayloadLink` en `{href, externe}` consommable directement
 * par les composants Astro. `type='page'` résout le slug de la relation
 * populated ; `type='custom'` retombe sur `url`. `externe` n'a de sens
 * que pour les liens custom (les liens internes restent dans le site).
 */
export function resolveLink(
  link: PayloadLink | null | undefined,
): { href?: string; externe?: boolean } {
  if (!link) return {};
  if (link.type === 'page') {
    if (link.page && typeof link.page === 'object' && link.page.slug) {
      return { href: `/${link.page.slug}` };
    }
    return {};
  }
  // type === 'custom' ou non défini → fallback sur url + flag externe
  return {
    href: link.url ?? undefined,
    externe: link.externe ?? undefined,
  };
}

/**
 * Transforme un block Payload (sections[]) pour qu'il ait la shape
 * de l'ancienne section astro:content (discriminated union avec
 * `type` au lieu de `blockType`).
 */
function transformBlock(rawBlock: Record<string, unknown>): Record<string, unknown> {
  const b = nullsToUndefined(rawBlock);
  const { blockType, blockName: _bn, id: _id, ...rest } = b;
  const out: Record<string, unknown> = { ...rest, type: blockType };

  // Numérique : `colonnes` est un string Payload (select), on
  // remet en number pour matcher le schéma Astro original.
  if (typeof out.colonnes === 'string') {
    out.colonnes = Number.parseInt(out.colonnes, 10);
  }
  if (typeof out.limite === 'string') {
    out.limite = Number.parseInt(out.limite, 10);
  }

  // Image directe (figure, texte-photo, deux-colonnes, bandeau-image)
  if (out.image && typeof out.image === 'object') {
    out.image = imgUrl(out.image as { filename?: string });
  }

  // Galerie.images[].image
  if (blockType === 'galerie' && Array.isArray(out.images)) {
    out.images = (out.images as Array<Record<string, unknown>>).map((img) => ({
      ...img,
      image: imgUrl(img.image as { filename?: string }),
    }));
  }

  // Portraits.personnes[].photo + aplatissement du lien
  // (personne.link → personne.lien + personne.externe ; on conserve
  // `lien_label` tel quel, c'est juste un texte libre)
  if (blockType === 'portraits' && Array.isArray(out.personnes)) {
    out.personnes = (out.personnes as Array<Record<string, unknown>>).map(
      (p) => {
        const resolved = resolveLink(p.link as PayloadLink | undefined);
        const { link: _l, ...rest } = p;
        return {
          ...rest,
          photo: imgUrl(p.photo as { filename?: string }),
          lien: resolved.href,
          externe: resolved.externe,
        };
      },
    );
  }

  // Timeline.etapes[].image
  if (blockType === 'timeline' && Array.isArray(out.etapes)) {
    out.etapes = (out.etapes as Array<Record<string, unknown>>).map((e) => ({
      ...e,
      image: imgUrl(e.image as { filename?: string }),
    }));
  }

  // Formats.formats[].points : [{point}] → string[]
  // + Formats.formats[].cta.link : aplatissement en cta.href + cta.externe
  // (le bloc Formats consomme f.cta.href / f.cta.externe ; on garde
  // f.cta.label intact)
  if (blockType === 'formats' && Array.isArray(out.formats)) {
    out.formats = (out.formats as Array<Record<string, unknown>>).map((f) => {
      const cta = f.cta as Record<string, unknown> | undefined;
      let flatCta: Record<string, unknown> | undefined = cta;
      if (cta) {
        const resolved = resolveLink(cta.link as PayloadLink | undefined);
        const { link: _l, ...rest } = cta;
        flatCta = { ...rest, href: resolved.href, externe: resolved.externe };
      }
      return {
        ...f,
        cta: flatCta,
        points: unwrapArray(
          f.points as Array<Record<string, string>> | undefined,
          'point',
        ) ?? [],
      };
    });
  }

  // Cta.cta_primaire / cta_secondaire : aplatissement du sous-objet
  // `link` (relation page OU url custom + externe) → `href` + `externe`
  // directement sur le CTA, pour rester compatible avec Hero.astro &
  // co qui lisent `s.cta_primaire.href` / `s.cta_primaire.externe`.
  if (blockType === 'cta') {
    for (const key of ['cta_primaire', 'cta_secondaire'] as const) {
      const c = out[key] as Record<string, unknown> | undefined;
      if (c) {
        const resolved = resolveLink(c.link as PayloadLink | undefined);
        const { link: _l, ...rest } = c;
        out[key] = { ...rest, href: resolved.href, externe: resolved.externe };
      }
    }
  }

  // Cartes.cartes[].link : aplatissement en carte.href + carte.externe.
  // On conserve `carte.cta` tel quel (c'est le label du lien, pas le
  // lien lui-même — cf. BlocCartes.astro qui lit `c.href` + `c.cta`).
  if (blockType === 'cartes' && Array.isArray(out.cartes)) {
    out.cartes = (out.cartes as Array<Record<string, unknown>>).map((c) => {
      const resolved = resolveLink(c.link as PayloadLink | undefined);
      const { link: _l, ...rest } = c;
      return { ...rest, href: resolved.href, externe: resolved.externe };
    });
  }

  // temoignages/equipe.ids : maintenant des relations hasMany. Selon
  // la profondeur de fetch, Payload renvoie soit un array d'IDs bruts
  // (depth 0), soit un array de docs populated (depth >= 1). On
  // normalise en array de string IDs pour pouvoir filtrer simplement
  // dans le PageRenderer.
  if (
    (blockType === 'temoignages' || blockType === 'equipe') &&
    Array.isArray(out.ids)
  ) {
    out.ids = (out.ids as Array<unknown>)
      .map((item) => {
        if (item === null || item === undefined) return null;
        if (typeof item === 'object' && 'id' in item) {
          return String((item as { id: number | string }).id);
        }
        return String(item);
      })
      .filter((v): v is string => v !== null);
  }

  return out;
}

/** Forme legacy d'une page (équivalent CollectionEntry<'pages'>).
 *
 * `hero` et `sections[*]` sont typés `any` parce que le shape précis
 * dépend du discriminant `type` (23 variantes possibles côté blocks).
 * Le typage strict est appliqué côté schémas Payload (validation au
 * write) et côté composants Astro (interface Props par bloc) — la
 * shape ici n'est qu'un payload dynamique pivot.
 */
export type LegacyPage = {
  id: string;
  slug: string;
  data: {
    title: string;
    description?: string;
    noindex?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hero?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sections: Array<any>;
  };
  body: string;
};

/**
 * Récupère une page Payload par slug et la transforme dans la
 * shape qu'astro:content rendait avant migration. Permet aux
 * composants Astro existants (PageRenderer notamment) de fonctionner
 * sans refactor profond.
 */
export async function fetchPageLegacy(slug: string): Promise<LegacyPage | null> {
  const page = await fetchPage<{
    slug: string;
    title: string;
    description?: string;
    noindex?: boolean;
    hero?: Record<string, unknown>;
    sections?: Array<Record<string, unknown>>;
  }>(slug, 2);
  if (!page) return null;
  const cleaned = nullsToUndefined(page);
  // Hero : aplatissement des sous-objets `link` des CTAs, comme pour
  // le block `cta` dans transformBlock. Le composant Hero.astro
  // consomme `hero.cta_primaire.href` + `hero.cta_primaire.externe`.
  let hero = cleaned.hero?.enabled === false ? undefined : cleaned.hero;
  if (hero) {
    const flatHero: Record<string, unknown> = { ...hero };
    for (const key of ['cta_primaire', 'cta_secondaire'] as const) {
      const c = flatHero[key] as Record<string, unknown> | undefined;
      if (c) {
        const resolved = resolveLink(c.link as PayloadLink | undefined);
        const { link: _l, ...rest } = c;
        flatHero[key] = {
          ...rest,
          href: resolved.href,
          externe: resolved.externe,
        };
      }
    }
    hero = flatHero;
  }
  return {
    id: cleaned.slug,
    slug: cleaned.slug,
    data: {
      title: cleaned.title,
      description: cleaned.description,
      noindex: cleaned.noindex,
      hero,
      sections: (cleaned.sections ?? []).map(transformBlock),
    },
    body: '',
  };
}

/**
 * Forme legacy d'un membre / témoignage / partenaire / etc. Avec la
 * data nested comme avant astro:content.
 */
export type LegacyEntry<T = Record<string, unknown>> = {
  id: string;
  slug: string;
  data: T;
  body: string;
};

/**
 * Récupère une collection Payload + transforme chaque doc en shape
 * legacy `{id, slug, data: {...}}`. Les uploads sont convertis en
 * URLs string (champs photo, cover, logo).
 */
export async function fetchCollectionLegacy<T = Record<string, unknown>>(
  collection: string,
  options: {
    sort?: string;
    limit?: number;
    where?: string;
  } = {},
): Promise<LegacyEntry<T>[]> {
  const docs = await fetchCollection<Record<string, unknown>>(
    collection,
    { ...options, depth: 2 },
  );
  return docs.map((d) => {
    const cleaned = nullsToUndefined(d);
    const { id, slug, body, ...rest } = cleaned;
    // Convertit les uploads en URLs.
    const data: Record<string, unknown> = { ...rest };
    for (const key of ['photo', 'cover', 'logo', 'fichier']) {
      if (data[key] && typeof data[key] === 'object') {
        data[key] = imgUrl(data[key] as { filename?: string });
      }
    }
    return {
      id: String(id),
      slug: (slug as string) ?? String(id),
      data: data as T,
      body: typeof body === 'string' ? body : '',
    };
  });
}

/**
 * Filtre les drafts pour les rendus publics. À appliquer après
 * fetchCollection sur les collections qui ont un champ `draft`.
 *
 * En dev local on peut tout afficher (override via
 * SHOW_DRAFTS=1) ; en prod on cache.
 */
export function filterPublished<T extends { draft?: boolean }>(
  docs: T[],
): T[] {
  if (process.env.SHOW_DRAFTS === '1') return docs;
  return docs.filter((d) => !d.draft);
}
