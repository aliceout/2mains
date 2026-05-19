/**
 * Script de migration : `content/**\/*.md` → Payload (Postgres).
 *
 * Mode d'emploi :
 *   cd services/payload
 *   pnpm import:content
 *
 * Idempotent : skip toute entrée dont le slug existe déjà.
 *
 * Pour les images : upload de chaque chemin `/images/...` (et
 * `/uploads/...`) dans la collection Payload `media`. Le mapping
 * pathString → mediaId est mis en cache pour ne pas uploader la
 * même image deux fois.
 */
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import matter from 'gray-matter';
import { getPayload } from 'payload';

import config from '../src/payload.config';

// ─── Paths ──────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../..');
const CONTENT_DIR = path.join(REPO_ROOT, 'content');
const PUBLIC_DIR = path.join(REPO_ROOT, 'public');

// ─── Helpers ────────────────────────────────────────────────────
type Payload = Awaited<ReturnType<typeof getPayload>>;

/** Cache des images déjà uploadées : path → media doc id. */
const mediaCache = new Map<string, number | string>();

/**
 * Upload une image dans la collection `media` Payload depuis son
 * chemin URL (ex: `/images/lyon-sdf.jpg`). Retourne l'ID Payload.
 * Si le fichier physique n'existe pas, log + retourne null.
 */
async function uploadMedia(
  payload: Payload,
  urlPath: string | undefined,
  alt?: string,
): Promise<number | string | null> {
  if (!urlPath) return null;
  if (mediaCache.has(urlPath)) return mediaCache.get(urlPath)!;

  // Map "/images/foo.jpg" → "<repo>/public/images/foo.jpg"
  const relPath = urlPath.replace(/^\//, '');
  const physical = path.join(PUBLIC_DIR, relPath);

  try {
    await fs.access(physical);
  } catch {
    console.warn(`  ⚠ Fichier introuvable, skip : ${urlPath}`);
    return null;
  }

  const filename = path.basename(physical);
  const buffer = await fs.readFile(physical);

  try {
    const doc = await payload.create({
      collection: 'media',
      data: { alt: alt ?? filename, nom: filename },
      file: {
        data: buffer,
        mimetype: guessMime(filename),
        name: filename,
        size: buffer.length,
      },
    });
    mediaCache.set(urlPath, doc.id);
    return doc.id;
  } catch (err) {
    console.warn(`  ⚠ Upload media échoué pour ${urlPath} :`, err);
    return null;
  }
}

function guessMime(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
  };
  return map[ext] ?? 'application/octet-stream';
}

/** Liste les .md dans un dossier de content/. */
async function listMd(subdir: string): Promise<string[]> {
  const dir = path.join(CONTENT_DIR, subdir);
  try {
    const entries = await fs.readdir(dir);
    return entries
      .filter((e) => e.endsWith('.md'))
      .map((e) => path.join(dir, e));
  } catch {
    return [];
  }
}

/** Parse YAML + body d'un .md. */
async function readMd<T = Record<string, unknown>>(
  filepath: string,
): Promise<{ slug: string; data: T; body: string }> {
  const raw = await fs.readFile(filepath, 'utf-8');
  const { data, content } = matter(raw);
  const slug = path.basename(filepath, '.md');
  return { slug, data: data as T, body: content.trim() };
}

/** Vérifie si un slug existe déjà dans une collection. */
async function existsBySlug(
  payload: Payload,
  collection: string,
  slug: string,
): Promise<boolean> {
  const res = await payload.find({
    collection: collection as never,
    where: { slug: { equals: slug } } as never,
    limit: 1,
  });
  return res.totalDocs > 0;
}

// ─── Migrations par collection ──────────────────────────────────

async function migrateSite(payload: Payload) {
  console.log('\n→ Site (globals : identite + liens-externes + banderole-urgence)');
  const settings = await readMd(path.join(CONTENT_DIR, 'site/settings.md'));
  const d = settings.data as Record<string, unknown>;
  // Le global "site" a été splitté en 4 globals en mai 2026
  // (cf migration 20260518_164916_split_site_global). On dispatche
  // les champs du markdown sur les 3 globals "contenu" (identité,
  // liens externes, banderole). Le 4e (parametres) n'a pas de
  // valeur initiale dans le markdown — ses toggles techniques sont
  // initialisés par défaut.
  await payload.updateGlobal({
    slug: 'identite',
    data: {
      nom_asso: d.nom_asso,
      url: d.url,
      accroche_globale: d.accroche_globale,
      mission: d.mission,
      directeur_publication: d.directeur_publication,
      siren: d.siren ?? '',
      rna: d.rna ?? '',
      adresse: d.adresse ?? '',
    } as never,
  });
  await payload.updateGlobal({
    slug: 'liens-externes',
    data: {
      reseaux: (d.reseaux as Record<string, string>) ?? {},
    } as never,
  });
  const banderole = (d.banderole_urgence as Record<string, unknown> | undefined) ?? {};
  await payload.updateGlobal({
    slug: 'banderole-urgence',
    data: {
      active: banderole.active ?? false,
      message: banderole.message,
      couleur: banderole.couleur ?? 'orange',
    } as never,
  });
  console.log('  ✓ Settings importés (3 globals)');
}

async function migrateEquipe(payload: Payload) {
  console.log('\n→ Équipe');
  const files = await listMd('equipe');
  for (const f of files) {
    const { slug, data } = await readMd(f);
    if (await existsBySlug(payload, 'equipe', slug)) {
      console.log(`  ↷ skip ${slug}`);
      continue;
    }
    const photoId = await uploadMedia(
      payload,
      data.photo as string | undefined,
      data.nom as string,
    );
    await payload.create({
      collection: 'equipe',
      data: {
        slug,
        nom: data.nom,
        role: data.role,
        photo: photoId,
        bio_courte: data.bio_courte ?? '',
        linkedin: data.linkedin ?? '',
        ordre: data.ordre ?? 0,
        draft: data.draft ?? false,
      } as never,
    });
    console.log(`  ✓ ${slug}`);
  }
}

async function migrateTemoignages(payload: Payload) {
  console.log('\n→ Témoignages');
  const files = await listMd('temoignages');
  for (const f of files) {
    const { slug, data, body } = await readMd(f);
    if (await existsBySlug(payload, 'temoignages', slug)) {
      console.log(`  ↷ skip ${slug}`);
      continue;
    }
    const photoId = await uploadMedia(payload, data.photo as string | undefined);
    await payload.create({
      collection: 'temoignages',
      data: {
        slug,
        auteur: data.auteur,
        role: data.role ?? '',
        contexte: data.contexte,
        photo: photoId,
        citation: body,
        ordre: data.ordre ?? 0,
        a_la_une: data.a_la_une ?? false,
        fictif: data.fictif ?? false,
        draft: data.draft ?? false,
      } as never,
    });
    console.log(`  ✓ ${slug}`);
  }
}

async function migratePartenaires(payload: Payload) {
  console.log('\n→ Partenaires');
  const files = await listMd('partenaires');
  for (const f of files) {
    const { slug, data } = await readMd(f);
    if (await existsBySlug(payload, 'partenaires', slug)) {
      console.log(`  ↷ skip ${slug}`);
      continue;
    }
    const logoId = await uploadMedia(payload, data.logo as string | undefined);
    await payload.create({
      collection: 'partenaires',
      data: {
        slug,
        nom: data.nom,
        type: data.type,
        logo: logoId,
        url: data.url ?? '',
        description_courte: data.description_courte ?? '',
        ordre: data.ordre ?? 0,
        draft: data.draft ?? false,
      } as never,
    });
    console.log(`  ✓ ${slug}`);
  }
}

async function migrateActualites(payload: Payload) {
  console.log('\n→ Actualités');
  const files = await listMd('actualites');
  for (const f of files) {
    const { slug, data, body } = await readMd(f);
    if (await existsBySlug(payload, 'actualites', slug)) {
      console.log(`  ↷ skip ${slug}`);
      continue;
    }
    const coverId = await uploadMedia(
      payload,
      data.cover as string | undefined,
      data.cover_alt as string,
    );
    const tags = Array.isArray(data.tags)
      ? (data.tags as string[]).map((t) => ({ tag: t }))
      : [];
    await payload.create({
      collection: 'actualites',
      data: {
        slug,
        title: data.title,
        description: data.description ?? '',
        date: data.date,
        auteur: data.auteur ?? '',
        cover: coverId,
        cover_alt: data.cover_alt ?? '',
        tags,
        body,
        draft: data.draft ?? false,
      } as never,
    });
    console.log(`  ✓ ${slug}`);
  }
}

async function migrateEvenements(payload: Payload) {
  console.log('\n→ Événements');
  const files = await listMd('evenements');
  for (const f of files) {
    const { slug, data, body } = await readMd(f);
    if (await existsBySlug(payload, 'evenements', slug)) {
      console.log(`  ↷ skip ${slug}`);
      continue;
    }
    const coverId = await uploadMedia(payload, data.cover as string | undefined);
    await payload.create({
      collection: 'evenements',
      data: {
        slug,
        title: data.title,
        date_debut: data.date_debut,
        date_fin: data.date_fin,
        lieu: data.lieu,
        adresse: data.adresse ?? '',
        cover: coverId,
        public: data.public,
        gratuit: data.gratuit ?? true,
        inscription_url: data.inscription_url ?? '',
        body,
        fictif: data.fictif ?? false,
        draft: data.draft ?? false,
      } as never,
    });
    console.log(`  ✓ ${slug}`);
  }
}

async function migrateDocuments(payload: Payload) {
  console.log('\n→ Documents');
  const files = await listMd('documents');
  for (const f of files) {
    const { slug, data } = await readMd(f);
    if (await existsBySlug(payload, 'documents', slug)) {
      console.log(`  ↷ skip ${slug}`);
      continue;
    }
    const fichierId = await uploadMedia(
      payload,
      data.fichier as string | undefined,
      data.titre as string,
    );
    await payload.create({
      collection: 'documents',
      data: {
        slug,
        titre: data.titre,
        categorie: data.categorie,
        fichier: fichierId,
        date: data.date,
        description_courte: data.description_courte ?? '',
        a_paraitre: data.a_paraitre ?? false,
        draft: data.draft ?? false,
      } as never,
    });
    console.log(`  ✓ ${slug}`);
  }
}

// ─── Migration des Pages (le plus complexe : sections → blocks) ─

/** Transforme une section YAML en bloc Payload. */
async function transformSection(
  payload: Payload,
  section: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { type, ...rest } = section;
  const block: Record<string, unknown> = { ...rest, blockType: type };

  // Cas 1 : champ image direct (figure, texte-photo, deux-colonnes,
  // bandeau-image)
  if (rest.image && typeof rest.image === 'string') {
    block.image = await uploadMedia(payload, rest.image, rest.alt as string);
  }

  // Cas 2 : galerie.images[].image
  if (type === 'galerie' && Array.isArray(rest.images)) {
    block.images = await Promise.all(
      (rest.images as Array<Record<string, unknown>>).map(async (img) => ({
        ...img,
        image: await uploadMedia(payload, img.image as string, img.alt as string),
      })),
    );
  }

  // Cas 3 : portraits.personnes[].photo
  if (type === 'portraits' && Array.isArray(rest.personnes)) {
    block.personnes = await Promise.all(
      (rest.personnes as Array<Record<string, unknown>>).map(async (p) => ({
        ...p,
        photo: await uploadMedia(payload, p.photo as string, p.photo_alt as string),
      })),
    );
  }

  // Cas 4 : timeline.etapes[].image
  if (type === 'timeline' && Array.isArray(rest.etapes)) {
    block.etapes = await Promise.all(
      (rest.etapes as Array<Record<string, unknown>>).map(async (e) => ({
        ...e,
        image: e.image
          ? await uploadMedia(payload, e.image as string, e.image_alt as string)
          : undefined,
      })),
    );
  }

  // Cas 5 : formats.formats[].points = string[] → [{point}]
  if (type === 'formats' && Array.isArray(rest.formats)) {
    block.formats = (rest.formats as Array<Record<string, unknown>>).map(
      (fmt) => ({
        ...fmt,
        points: Array.isArray(fmt.points)
          ? (fmt.points as string[]).map((p) => ({ point: p }))
          : [],
      }),
    );
  }

  // Cas 6 : temoignages/equipe.ids = string[] → [{slug}]
  if ((type === 'temoignages' || type === 'equipe') && Array.isArray(rest.ids)) {
    block.ids = (rest.ids as string[]).map((slug) => ({ slug }));
  }

  return block;
}

async function migratePages(payload: Payload) {
  console.log('\n→ Pages');
  const files = await listMd('pages');
  for (const f of files) {
    const { slug, data } = await readMd(f);
    if (await existsBySlug(payload, 'pages', slug)) {
      console.log(`  ↷ skip ${slug}`);
      continue;
    }

    const sections = Array.isArray(data.sections)
      ? await Promise.all(
          (data.sections as Array<Record<string, unknown>>).map((s) =>
            transformSection(payload, s),
          ),
        )
      : [];

    const hero = data.hero
      ? { ...(data.hero as Record<string, unknown>), enabled: true }
      : { enabled: false };

    await payload.create({
      collection: 'pages',
      data: {
        slug,
        title: data.title,
        description: data.description ?? '',
        noindex: data.noindex ?? false,
        hero,
        sections,
      } as never,
    });
    console.log(`  ✓ ${slug} (${sections.length} sections)`);
  }
}

// ─── Main ───────────────────────────────────────────────────────

async function main() {
  console.log('🟢 Boot Payload local API…');
  const payload = await getPayload({ config });
  console.log(`📂 Repo : ${REPO_ROOT}`);

  await migrateSite(payload);
  await migrateEquipe(payload);
  await migrateTemoignages(payload);
  await migratePartenaires(payload);
  await migrateActualites(payload);
  await migrateEvenements(payload);
  await migrateDocuments(payload);
  await migratePages(payload);

  console.log('\n✅ Migration terminée.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Migration échouée :', err);
  process.exit(1);
});
