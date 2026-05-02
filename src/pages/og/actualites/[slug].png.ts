// OG image par article de blog. L'overline affiche « Actualité · JJ mois AAAA ».
import type { APIRoute } from 'astro';
import { buildOgPng } from '../../../lib/og';
import { getSiteSettings } from '../../../lib/site';
import { fetchBySlug } from '../../../lib/payload';

function formatDate(s: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(s));
}

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  if (!slug) return new Response('Slug manquant', { status: 400 });

  const post = await fetchBySlug<{
    title: string;
    description?: string;
    date: string;
  }>('actualites', slug);
  if (!post) return new Response('Article introuvable', { status: 404 });

  const settings = await getSiteSettings();

  const png = await buildOgPng({
    nomAsso: settings.nom_asso ?? '2mains de femmes',
    accroche: settings.accroche_globale ?? '',
    title: post.title,
    description: post.description ?? '',
    overline: `Actualité · ${formatDate(post.date)}`,
  });

  return new Response(png as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
