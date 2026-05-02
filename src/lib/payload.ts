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

/** URL publique pour servir les fichiers media (côté browser). */
const PUBLIC_URL =
  process.env.ASTRO_PUBLIC_PAYLOAD_URL ??
  process.env.PAYLOAD_PUBLIC_SERVER_URL ??
  'http://localhost:3001';

/**
 * Construit l'URL publique d'une image Payload depuis son `filename`
 * (champ `media.filename` retourné par l'API).
 *
 * Ex : `mediaUrl('lyon-sdf.jpg')` → `https://2mainsdefemmes.org/cms/api/media/file/lyon-sdf.jpg`
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

/** Récupère le global Site (paramètres). */
export async function fetchSite<T = unknown>(depth = 1): Promise<T> {
  return fetchPayload<T>(`/globals/site?depth=${depth}`);
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

  // Portraits.personnes[].photo
  if (blockType === 'portraits' && Array.isArray(out.personnes)) {
    out.personnes = (out.personnes as Array<Record<string, unknown>>).map(
      (p) => ({
        ...p,
        photo: imgUrl(p.photo as { filename?: string }),
      }),
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
  if (blockType === 'formats' && Array.isArray(out.formats)) {
    out.formats = (out.formats as Array<Record<string, unknown>>).map((f) => ({
      ...f,
      points: unwrapArray(
        f.points as Array<Record<string, string>> | undefined,
        'point',
      ) ?? [],
    }));
  }

  // temoignages/equipe.ids : [{slug}] → string[]
  if (
    (blockType === 'temoignages' || blockType === 'equipe') &&
    Array.isArray(out.ids)
  ) {
    out.ids = unwrapArray(
      out.ids as Array<Record<string, string>>,
      'slug',
    );
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
  return {
    id: cleaned.slug,
    slug: cleaned.slug,
    data: {
      title: cleaned.title,
      description: cleaned.description,
      noindex: cleaned.noindex,
      hero: cleaned.hero?.enabled === false ? undefined : cleaned.hero,
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
