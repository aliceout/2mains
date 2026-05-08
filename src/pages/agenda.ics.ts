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

function toIcsEvent(
  entry: LegacyEntry<Evt>,
  siteUrl: string,
  uidHost: string,
): IcsEvent {
  return {
    // UID iCal RFC 5545 : doit être stable et inclure un domaine. On
    // dérive du host de siteUrl (= ADDRESS prod ou settings.url CMS).
    uid: `${entry.slug}@${uidHost}`,
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
  const siteUrl = settings.url ?? process.env.ADDRESS;
  if (!siteUrl) {
    throw new Error('Site URL inconnue (settings.url + ADDRESS vides) — feed iCal injoignable.');
  }
  const uidHost = new URL(siteUrl).host;
  const all = filterPublished(
    await fetchCollectionLegacy<Evt>('evenements', { sort: 'date_debut' }),
  );
  const events = all
    .filter((e) => !e.data.fictif)
    .map((e) => toIcsEvent(e, siteUrl, uidHost));

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
