import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { filterPublished } from '../lib/drafts';
import { getSiteSettings } from '../lib/site';

export async function GET(context: APIContext) {
  const settings = await getSiteSettings();
  const posts = filterPublished(await getCollection('actualites')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  return rss({
    title: `${settings.nom_asso} — Actualités`,
    description: `Les actualités de ${settings.nom_asso} : comptes-rendus, prises de position, revue de presse.`,
    site: context.site ?? settings.url,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.description ?? '',
      link: `/actualites/${p.id}`,
      ...(p.data.auteur ? { author: p.data.auteur } : {}),
      ...(p.data.tags.length > 0 ? { categories: p.data.tags } : {}),
    })),
    customData: '<language>fr-FR</language>',
  });
}
