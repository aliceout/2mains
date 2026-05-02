// OG image par page Payload. SSR : on fetch la page par slug et on
// génère le PNG à la volée. Le Cache-Control garde la perf en prod
// (1 an immutable) — invalidation par slug si le titre change.
import type { APIRoute } from 'astro';
import { buildOgPng } from '../../lib/og';
import { getSiteSettings } from '../../lib/site';
import { fetchBySlug } from '../../lib/payload';

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  if (!slug) return new Response('Slug manquant', { status: 400 });

  const page = await fetchBySlug<{ title: string; description?: string }>(
    'pages',
    slug,
  );
  if (!page) return new Response('Page introuvable', { status: 404 });

  const settings = await getSiteSettings();

  const png = await buildOgPng({
    nomAsso: settings.nom_asso ?? '2mains de femmes',
    accroche: settings.accroche_globale ?? '',
    title: page.title,
    description: page.description ?? '',
  });

  return new Response(png as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
