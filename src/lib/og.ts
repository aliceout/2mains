// Génération d'images Open Graph 1200×630 via satori + resvg.
// Réutilisé par /og/[slug].png.ts (pages de contenu) et
// /og/actualites/[slug].png.ts (articles de blog).
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

const FONT_DIR = path.join(
  process.cwd(),
  'node_modules/@fontsource/nunito/files',
);
const fontRegular = fs.readFileSync(
  path.join(FONT_DIR, 'nunito-latin-400-normal.woff'),
);
const fontBold = fs.readFileSync(
  path.join(FONT_DIR, 'nunito-latin-700-normal.woff'),
);

type NodeProps = {
  style?: Record<string, string | number>;
  children?: unknown;
};
const el = (type: string, props: NodeProps) => ({ type, props });

export type OgOptions = {
  nomAsso: string;
  accroche: string;
  title: string;
  description?: string;
  /** Petit label en haut (ex: « Actualité · 22 avril 2026 »). */
  overline?: string;
};

export async function buildOgPng(opts: OgOptions): Promise<Uint8Array> {
  const { nomAsso, accroche, title, description, overline } = opts;

  const header = overline
    ? el('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        },
        children: [
          el('div', {
            style: {
              fontSize: '26px',
              fontWeight: 700,
              color: '#ec6a2c',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            },
            children: nomAsso,
          }),
          el('div', {
            style: {
              fontSize: '22px',
              color: '#695ea3',
              fontWeight: 700,
            },
            children: overline,
          }),
        ],
      })
    : el('div', {
        style: {
          fontSize: '26px',
          fontWeight: 700,
          color: '#ec6a2c',
          textTransform: 'uppercase',
          letterSpacing: '2px',
        },
        children: nomAsso,
      });

  const tree = el('div', {
    style: {
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '72px',
      background: '#f9e8d8',
      fontFamily: 'Nunito',
    },
    children: [
      header,
      el('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          maxWidth: '1056px',
        },
        children: [
          el('div', {
            style: {
              fontSize: '72px',
              fontWeight: 700,
              color: '#1a1a1a',
              lineHeight: 1.1,
            },
            children: title,
          }),
          description
            ? el('div', {
                style: {
                  fontSize: '30px',
                  color: '#1a1a1a',
                  opacity: 0.8,
                  lineHeight: 1.3,
                },
                children: description,
              })
            : null,
        ].filter(Boolean),
      }),
      el('div', {
        style: {
          fontSize: '24px',
          color: '#695ea3',
          fontWeight: 700,
        },
        children: accroche,
      }),
    ],
  });

  const svg = await satori(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Nunito', data: fontRegular, weight: 400, style: 'normal' },
      { name: 'Nunito', data: fontBold, weight: 700, style: 'normal' },
    ],
  });

  const png = new Resvg(svg).render().asPng();
  return new Uint8Array(png);
}
