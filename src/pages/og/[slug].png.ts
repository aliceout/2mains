// Endpoint de génération des images Open Graph (1200x630 PNG) par page.
// Une image par entrée de la collection `pages` ; les pages sans entrée de
// contenu (status, accessibilite, 404…) utilisent le logo par défaut dans le
// Layout.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';
import { getSiteSettings } from '../../lib/site';

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

export async function getStaticPaths() {
  const pages = await getCollection('pages');
  return pages.map((p) => ({
    params: { slug: p.id },
    props: {
      title: p.data.title,
      description: p.data.description ?? '',
    },
  }));
}

type NodeProps = {
  style?: Record<string, string | number>;
  children?: unknown;
};
const el = (type: string, props: NodeProps) => ({ type, props });

export const GET: APIRoute = async ({ props }) => {
  const settings = await getSiteSettings();
  const { title, description } = props as {
    title: string;
    description: string;
  };

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
      el('div', {
        style: {
          fontSize: '26px',
          fontWeight: 700,
          color: '#ec6a2c',
          textTransform: 'uppercase',
          letterSpacing: '2px',
        },
        children: settings.nom_asso,
      }),
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
        children: settings.accroche_globale,
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
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
