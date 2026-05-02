import type { APIRoute } from 'astro';
import { buildCalendar, type IcsEvent } from '../lib/ical';
import { getSiteSettings } from '../lib/site';
import { filterPublished } from '../lib/drafts';
import { fetchCollectionLegacy, type LegacyEntry } from '../lib/payload';

type Evt = {
  title: string;
  date_debut: string;
  date_fin?: string;
  lieu: string;
  adresse?: string;
  inscription_url?: string;
  body?: string;
  fictif?: boolean;
  draft?: boolean;
};

function toIcsEvent(entry: LegacyEntry<Evt>, siteUrl: string): IcsEvent {
  return {
    uid: `${entry.slug}@2mainsdefemmes.org`,
    start: new Date(entry.data.date_debut),
    end: entry.data.date_fin ? new Date(entry.data.date_fin) : undefined,
    summary: entry.data.title,
    description: (entry.data.body ?? '').trim(),
    location: [entry.data.lieu, entry.data.adresse].filter(Boolean).join(', '),
    url: entry.data.inscription_url ?? new URL('/agenda', siteUrl).toString(),
  };
}

export const GET: APIRoute = async () => {
  const settings = await getSiteSettings();
  const siteUrl = settings.url ?? 'https://2mainsdefemmes.org';
  const all = filterPublished(
    await fetchCollectionLegacy<Evt>('evenements', { sort: 'date_debut' }),
  );
  const events = all
    .filter((e) => !e.data.fictif)
    .map((e) => toIcsEvent(e, siteUrl));

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
