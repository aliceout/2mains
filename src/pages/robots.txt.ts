// Route dynamique pour robots.txt — la URL du sitemap doit être absolue
// par spec, donc on l'interpole depuis ADDRESS plutôt que de la
// hardcoder dans un fichier statique sous public/.
//
// Si le toggle `noindex` du global Payload Site est activé, on retourne
// un robots.txt qui interdit tout crawl (Disallow: /) — utile pour
// refonte / staging / instance privée.
import type { APIRoute } from 'astro';
import { getSiteSettings } from '../lib/site';

export const GET: APIRoute = async ({ site }) => {
  const root = site?.toString().replace(/\/$/, '') ?? process.env.ADDRESS;
  if (!root) {
    return new Response('robots.txt indisponible (URL site inconnue)', { status: 500 });
  }

  const settings = await getSiteSettings();

  if (settings.noindex) {
    return new Response(`User-agent: *\nDisallow: /\n`, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const body = `User-agent: *
Disallow: /admin/
Disallow: /cms/
Disallow: /api/
Disallow: /status
Disallow: /demo

Sitemap: ${root}/sitemap-index.xml
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
