#!/usr/bin/env node
// Pipeline d'optimisation images — génère AVIF + WebP en plusieurs tailles
// pour chaque image uploadée via le CMS dans public/uploads/.
//
// - Scan récursif de public/uploads/ (jpg/jpeg/png/webp)
// - Pour chaque image : variantes AVIF et WebP aux largeurs 400, 800,
//   1200, 1920 px (on skippe les largeurs supérieures à l'original)
// - Outputs dans public/uploads/optimized/<hash>/<width>.<format>
// - Manifest écrit dans src/data/image-manifest.json — consommé par
//   SmartImage qui sait alors rendre un <picture> avec sources AVIF +
//   WebP + fallback <img>.
//
// Le prebuild du package.json déclenche ce script avant `astro build`.
// Idempotent : ne ré-encode pas un fichier déjà généré.

import sharp from 'sharp';
import {
  readdirSync,
  statSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readFileSync,
} from 'node:fs';
import { join, extname, relative } from 'node:path';
import { createHash } from 'node:crypto';

const SRC_DIR = 'public/uploads';
const OUT_SUBDIR = 'optimized';
const OUT_DIR = join(SRC_DIR, OUT_SUBDIR);
const MANIFEST = 'src/data/image-manifest.json';
const WIDTHS = [400, 800, 1200, 1920];
const FORMATS = ['avif', 'webp'];

const SOURCE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function* walkSources(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      // skip the optimized output folder to avoid recursion
      if (full.includes(join(SRC_DIR, OUT_SUBDIR))) continue;
      yield* walkSources(full);
    } else if (s.isFile() && SOURCE_EXTS.has(extname(entry).toLowerCase())) {
      yield full;
    }
  }
}

function hashPath(inputPath) {
  return createHash('sha1').update(inputPath).digest('hex').slice(0, 10);
}

function urlFor(inputPath) {
  const rel = relative(SRC_DIR, inputPath).split(/[\\/]/).join('/');
  return `/uploads/${rel}`;
}

async function processOne(inputPath) {
  const buffer = readFileSync(inputPath);
  const meta = await sharp(buffer).metadata();
  const origWidth = meta.width ?? 0;
  const origHeight = meta.height ?? 0;

  const hash = hashPath(inputPath);
  const targetDir = join(OUT_DIR, hash);
  if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });

  const variants = { avif: [], webp: [] };

  for (const fmt of FORMATS) {
    for (const w of WIDTHS) {
      // Skip variants larger than the original
      if (origWidth && w > origWidth) continue;
      const outFile = join(targetDir, `${w}.${fmt}`);
      if (!existsSync(outFile)) {
        let pipeline = sharp(buffer).resize({ width: w, withoutEnlargement: true });
        if (fmt === 'avif') pipeline = pipeline.avif({ quality: 55, effort: 4 });
        else pipeline = pipeline.webp({ quality: 78 });
        await pipeline.toFile(outFile);
      }
      variants[fmt].push({
        width: w,
        path: `/uploads/${OUT_SUBDIR}/${hash}/${w}.${fmt}`,
      });
    }
  }

  return {
    original: urlFor(inputPath),
    width: origWidth,
    height: origHeight,
    variants,
  };
}

async function main() {
  const sources = [...walkSources(SRC_DIR)];
  if (sources.length === 0) {
    console.log(
      `[optimize-images] Aucune image dans ${SRC_DIR}/ — manifest vide.`,
    );
    writeFileSync(MANIFEST, '{}\n', 'utf8');
    return;
  }

  const manifest = {};
  let processed = 0;
  for (const file of sources) {
    try {
      const entry = await processOne(file);
      manifest[entry.original] = entry;
      processed++;
    } catch (err) {
      console.warn(`[optimize-images] Skip ${file} : ${err.message}`);
    }
  }

  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(
    `[optimize-images] ${processed} image(s) traitée(s), manifest écrit dans ${MANIFEST}.`,
  );
}

await main();
