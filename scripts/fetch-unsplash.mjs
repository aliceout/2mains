#!/usr/bin/env node
// Téléchargement des images Unsplash hotlinkées en local.
//
// Sveltia CMS intègre nativement la recherche Unsplash. Quand Audrey
// sélectionne une photo, Sveltia insère l'URL hotlink (images.unsplash.com/…)
// dans le frontmatter. Cet hotlink expose chaque visiteur du site à
// Unsplash — IP remontée, tracking possible. Sur un site adressé à des
// femmes potentiellement en situation de violences, on ne veut pas ça.
//
// Ce script tourne avant le build :
// - scan récursif de content/ pour trouver les URLs `images.unsplash.com`
// - pour chaque URL unique : hash → fichier local
//   public/uploads/unsplash/<hash>.jpg (téléchargé si absent)
// - manifest src/data/unsplash-manifest.json mappant URL → chemin local
//
// SmartImage consomme ce manifest en priorité avant le manifest
// d'optimisation : si l'image vient d'Unsplash, il bascule sur le fichier
// local, qui est ensuite traité par optimize-images.mjs comme n'importe
// quelle image uploadée (WebP + AVIF + srcset).
//
// Le manifest est commité dans le repo (avec {} initial) ; les fichiers
// téléchargés sont dans .gitignore.
//
// Pas besoin de clé API Unsplash : on récupère juste les URLs d'images
// publiques via HTTP. L'attribution photographe est à renseigner par
// Audrey dans le champ `credit` ou équivalent du bloc (Sveltia affiche
// un dialogue « copier les crédits » au moment de la sélection).

import {
  readdirSync,
  statSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readFileSync,
} from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { createHash } from 'node:crypto';

const CONTENT_DIR = 'content';
const OUT_DIR = 'public/uploads/unsplash';
const MANIFEST = 'src/data/unsplash-manifest.json';

// Les URLs Unsplash contiennent toujours images.unsplash.com et un
// identifiant de photo stable.
const UNSPLASH_URL_RE =
  /https:\/\/images\.unsplash\.com\/[a-zA-Z0-9\-_\/\.?=&%]+/g;

function* walkMarkdown(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) yield* walkMarkdown(full);
    else if (s.isFile() && extname(entry).toLowerCase() === '.md') yield full;
  }
}

function collectUrls() {
  const urls = new Set();
  for (const file of walkMarkdown(CONTENT_DIR)) {
    const text = readFileSync(file, 'utf8');
    const matches = text.match(UNSPLASH_URL_RE);
    if (matches) for (const m of matches) urls.add(m);
  }
  return [...urls];
}

function hashUrl(url) {
  return createHash('sha1').update(url).digest('hex').slice(0, 12);
}

async function downloadOne(url, localPath) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} sur ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (!existsSync(dirname(localPath))) {
    mkdirSync(dirname(localPath), { recursive: true });
  }
  writeFileSync(localPath, buf);
}

async function main() {
  const urls = collectUrls();
  if (urls.length === 0) {
    console.log('[fetch-unsplash] Aucune URL Unsplash dans content/.');
    writeFileSync(MANIFEST, '{}\n', 'utf8');
    return;
  }

  const manifest = {};
  let downloaded = 0;
  let cached = 0;

  for (const url of urls) {
    const hash = hashUrl(url);
    const localPath = join(OUT_DIR, `${hash}.jpg`);
    const localUrl = `/uploads/unsplash/${hash}.jpg`;
    manifest[url] = localUrl;

    if (existsSync(localPath)) {
      cached++;
      continue;
    }
    try {
      await downloadOne(url, localPath);
      downloaded++;
    } catch (err) {
      console.warn(`[fetch-unsplash] Échec ${url} : ${err.message}`);
      delete manifest[url]; // on laisse le hotlink en fallback
    }
  }

  if (!existsSync(dirname(MANIFEST))) {
    mkdirSync(dirname(MANIFEST), { recursive: true });
  }
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(
    `[fetch-unsplash] ${downloaded} téléchargée(s), ${cached} déjà en cache. Manifest : ${MANIFEST}.`,
  );
}

await main();
