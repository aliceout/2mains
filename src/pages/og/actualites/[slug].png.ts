// OG image par article de blog. L'overline affiche « Actualité · JJ mois AAAA ».
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildOgPng } from '../../../lib/og';
import { filterPublished } from '../../../lib/drafts';
import { getSiteSettings } from '../../../lib/site';

export async function getStaticPaths() {
  const posts = filterPublished(await getCollection('actualites'));
  return posts.map((p) => ({
    params: { slug: p.id },
    props: {
      title: p.data.title,
      description: p.data.description ?? '',
      date: p.data.date,
    },
  }));
}

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export const GET: APIRoute = async ({ props }) => {
  const settings = await getSiteSettings();
  const { title, description, date } = props as {
    title: string;
    description: string;
    date: Date;
  };

  const png = await buildOgPng({
    nomAsso: settings.nom_asso,
    accroche: settings.accroche_globale,
    title,
    description,
    overline: `Actualité · ${formatDate(date)}`,
  });

  return new Response(png as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
