import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { buildCalendar, type IcsEvent } from '../lib/ical';
import { getSiteSettings } from '../lib/site';
import { filterPublished } from '../lib/drafts';

function toIcsEvent(
  entry: CollectionEntry<'evenements'>,
  siteUrl: string,
): IcsEvent {
  return {
    uid: `${entry.id}@2mainsdefemmes.org`,
    start: entry.data.date_debut,
    end: entry.data.date_fin,
    summary: entry.data.title,
    description: (entry.body ?? '').trim(),
    location: [entry.data.lieu, entry.data.adresse].filter(Boolean).join(', '),
    url: entry.data.inscription_url ?? new URL('/agenda', siteUrl).toString(),
  };
}

export const GET: APIRoute = async () => {
  const settings = await getSiteSettings();
  const all = filterPublished(await getCollection('evenements'));
  const events = all
    .filter((e) => !e.data.fictif)
    .sort((a, b) => a.data.date_debut.valueOf() - b.data.date_debut.valueOf())
    .map((e) => toIcsEvent(e, settings.url));

  const ics = buildCalendar({
    calName: `${settings.nom_asso} — Agenda`,
    events,
  });
  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
    },
  });
};
