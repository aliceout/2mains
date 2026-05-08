import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { filterPublished } from '../lib/drafts';
import { getSiteSettings } from '../lib/site';
import { fetchCollectionLegacy } from '../lib/payload';

type Post = {
  title: string;
  description?: string;
  date: string;
  auteur?: string;
  tags?: Array<{ tag: string }>;
  draft?: boolean;
};

export async function GET(context: APIContext) {
  const settings = await getSiteSettings();
  const posts = filterPublished(
    await fetchCollectionLegacy<Post>('actualites', { sort: '-date' }),
  );
  return rss({
    title: `${settings.nom_asso} — Actualités`,
    description: `Les actualités de ${settings.nom_asso} : comptes-rendus, prises de position, revue de presse.`,
    site: context.site ?? settings.url ?? process.env.ADDRESS!,
    items: posts.map((p) => {
      const tags = (p.data.tags ?? []).map((t) => t.tag);
      return {
        title: p.data.title,
        pubDate: new Date(p.data.date),
        description: p.data.description ?? '',
        link: `/actualites/${p.slug}`,
        ...(p.data.auteur ? { author: p.data.auteur } : {}),
        ...(tags.length > 0 ? { categories: tags } : {}),
      };
    }),
    customData: '<language>fr-FR</language>',
  });
}
