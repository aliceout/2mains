// Route dynamique pour robots.txt — la URL du sitemap doit être absolue
// par spec, donc on l'interpole depuis ADDRESS plutôt que de la
// hardcoder dans un fichier statique sous public/.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const root = site?.toString().replace(/\/$/, '') ?? process.env.ADDRESS;
  if (!root) {
    return new Response('robots.txt indisponible (URL site inconnue)', { status: 500 });
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
