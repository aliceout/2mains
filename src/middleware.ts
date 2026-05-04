import type { MiddlewareHandler } from 'astro';

// Headers de sécurité globaux. Appliqués par Astro sur toutes les pages
// servies par cette appli (les sous-services /cms/* et /api/* sont
// derrière le reverse proxy et ne traversent pas ce middleware).
//
// CSP : autorise 'unsafe-inline' sur script et style pour ne pas casser
// le formulaire /contact (script inline) ni Tailwind v4 (style inline
// sur certains composants Astro). À durcir en Phase 7 avec des nonces.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');

export const onRequest: MiddlewareHandler = async (_context, next) => {
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

  return response;
};
