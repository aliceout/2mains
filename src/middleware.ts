import type { MiddlewareHandler } from 'astro';
import { createHash } from 'node:crypto';
import { getSiteSettings } from './lib/site';

// Headers de sécurité globaux. Appliqués par Astro sur toutes les pages
// servies par cette appli (les sous-services /cms/* et /api/* sont
// derrière le reverse proxy et ne traversent pas ce middleware).
//
// CSP : autorise 'unsafe-inline' sur script et style pour ne pas casser
// le formulaire /contact (script inline) ni Tailwind v4 (style inline
// sur certains composants Astro). À durcir en Phase 7 avec des nonces.
//
// Pour img-src on autorise l'origin de ADDRESS — c'est de là que viennent
// les médias Payload (/cms/api/media/file/...). En prod c'est typiquement
// https://2mainsdefemmes.org (couvert par `https:` de toute façon). En dev
// c'est http://localhost:3001 (Payload local) → sinon les images sont
// bloquées par CSP avec le seul `https:` qui couvre que les origins TLS.
function buildCsp(): string {
  const address = process.env.ADDRESS;
  let payloadOrigin = '';
  if (address) {
    try {
      const u = new URL(address);
      payloadOrigin = `${u.protocol}//${u.host}`;
    } catch {
      // ADDRESS mal formé → on tombe sur les directives de base
    }
  }
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: https: ${payloadOrigin}`.trim(),
    "font-src 'self'",
    "connect-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join('; ');
}

const CSP = buildCsp();

// Paths qui doivent toujours passer même quand le gate est actif :
//   /gate            la page de garde elle-même (sinon redirect loop)
//   /brand/*         logo/picto utilisés par la page de garde
//   /robots.txt      doit rester accessible aux crawlers
//   /favicon.ico     idem pour les navigateurs
const GATE_WHITELIST = (path: string): boolean =>
  path === '/gate' ||
  path === '/robots.txt' ||
  path === '/favicon.ico' ||
  path.startsWith('/brand/');

export const onRequest: MiddlewareHandler = async (context, next) => {
  const settings = await getSiteSettings().catch(() => null);

  // Gate "Site en construction" : si gate_password est défini dans Payload,
  // on intercepte toutes les requêtes hors whitelist et on redirige vers
  // /gate tant que le cookie `site_gate` n'a pas la bonne valeur.
  // /cms/admin est sur un service séparé derrière le reverse proxy →
  // ne traverse pas ce middleware (admin reste accessible).
  const gatePassword = settings?.gate_password ?? '';
  const path = context.url.pathname;
  if (gatePassword && !GATE_WHITELIST(path)) {
    const expectedHash = createHash('sha256').update(gatePassword).digest('hex');
    const cookie = context.cookies.get('site_gate')?.value;
    if (cookie !== expectedHash) {
      const nextParam = encodeURIComponent(context.url.pathname + context.url.search);
      return context.redirect(`/gate?next=${nextParam}`, 302);
    }
  }

  const response = await next();

  response.headers.set('Content-Security-Policy', CSP);
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  );

  // Toggle site-wide noindex (cf Site global Payload). Si on est en
  // mode "non indexable", on pose aussi un header HTTP : certains
  // crawlers (Bingbot notamment) le lisent même sur les ressources
  // non-HTML (sitemap, RSS, ICS) où le <meta robots> ne s'applique pas.
  if (settings?.noindex === true) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  // Toggle no_cache (cf Site global Payload) : pendant une recette
  // client, on force le navigateur à refetch à chaque visite pour
  // que toute modif soit visible immédiatement, sans Ctrl+F5.
  // À désactiver une fois le site stabilisé (le cache, c'est la perf).
  if (settings?.no_cache === true) {
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, max-age=0',
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
};
