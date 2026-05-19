import type { APIRoute } from 'astro';
import { buildCalendar, type IcsEvent } from '../../lib/ical';
import { getSiteSettings } from '../../lib/site';
import { fetchBySlug } from '../../lib/payload';
import { richOrMarkdownToPlainText } from '../../lib/lexical';

// SSR : route dynamique opt-in.
export const prerender = false;

type Evt = {
  slug: string;
  title: string;
  date_debut: string;
  date_fin?: string;
  lieu: string;
  adresse?: string;
  inscription_url?: string;
  body?: string;
  body_rich?: unknown;
};

function toIcsEvent(entry: Evt, siteUrl: string, uidHost: string): IcsEvent {
  return {
    // UID iCal RFC 5545 : doit être stable et inclure un domaine. On
    // dérive du host de siteUrl (= ADDRESS prod ou settings.url CMS).
    uid: `${entry.slug}@${uidHost}`,
    start: new Date(entry.date_debut),
    end: entry.date_fin ? new Date(entry.date_fin) : undefined,
    summary: entry.title,
    description: richOrMarkdownToPlainText(entry.body_rich, entry.body),
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
  const siteUrl = settings.url ?? process.env.ADDRESS;
  if (!siteUrl) {
    throw new Error('Site URL inconnue (settings.url + ADDRESS vides) — feed iCal injoignable.');
  }
  const uidHost = new URL(siteUrl).host;
  const ics = buildCalendar({
    calName: entry.title,
    events: [toIcsEvent(entry, siteUrl, uidHost)],
  });
  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${slug}.ics"`,
    },
  });
};
