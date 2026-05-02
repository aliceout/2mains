import type { APIRoute } from 'astro';
import { buildCalendar, type IcsEvent } from '../../lib/ical';
import { getSiteSettings } from '../../lib/site';
import { fetchBySlug } from '../../lib/payload';

type Evt = {
  slug: string;
  title: string;
  date_debut: string;
  date_fin?: string;
  lieu: string;
  adresse?: string;
  inscription_url?: string;
  body?: string;
};

function toIcsEvent(entry: Evt, siteUrl: string): IcsEvent {
  return {
    uid: `${entry.slug}@2mainsdefemmes.org`,
    start: new Date(entry.date_debut),
    end: entry.date_fin ? new Date(entry.date_fin) : undefined,
    summary: entry.title,
    description: (entry.body ?? '').trim(),
    location: [entry.lieu, entry.adresse].filter(Boolean).join(', '),
    url: entry.inscription_url ?? new URL('/agenda', siteUrl).toString(),
  };
}

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  if (!slug) return new Response('Slug manquant', { status: 400 });

  const entry = await fetchBySlug<Evt>('evenements', slug);
  if (!entry) return new Response('Événement introuvable', { status: 404 });

  const settings = await getSiteSettings();
  const siteUrl = settings.url ?? 'https://2mainsdefemmes.org';
  const ics = buildCalendar({
    calName: entry.title,
    events: [toIcsEvent(entry, siteUrl)],
  });
  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${slug}.ics"`,
    },
  });
};
