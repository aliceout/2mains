import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { buildCalendar, type IcsEvent } from '../../lib/ical';
import { getSiteSettings } from '../../lib/site';

export async function getStaticPaths() {
  const all = await getCollection('evenements');
  return all.map((e) => ({
    params: { slug: e.id },
    props: { entry: e },
  }));
}

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

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as { entry: CollectionEntry<'evenements'> };
  const settings = await getSiteSettings();
  const ics = buildCalendar({
    calName: entry.data.title,
    events: [toIcsEvent(entry, settings.url)],
  });
  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${entry.id}.ics"`,
    },
  });
};
