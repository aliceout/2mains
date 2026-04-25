// 2mains-mail — backend minimal pour le formulaire /contact.
//
// Reçoit un POST JSON sur /api/contact, valide les champs, applique un
// rate limit en mémoire (par IP, fenêtre glissante d'1h), et forward
// via SMTP (Infomaniak en prod) avec Nodemailer.
//
// Variables d'env (toutes requises sauf indication) :
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, MAIL_TO
//   SMTP_SECURE          (défaut "true")
//   PORT                 (défaut 3000)
//   RATE_LIMIT_PER_HOUR  (défaut 20)
//   ALLOWED_ORIGIN       (défaut "*", à fixer sur https://2mainsdefemmes.org en prod)
//
// Pas de stockage persistant, pas de queue. Si SMTP est down, on renvoie
// 500 et le formulaire affiche le message d'erreur côté client. Logs JSON
// sur stdout, scrapés par le daemon Docker.

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import nodemailer from 'nodemailer';

const PORT = parseInt(process.env.PORT || '3000', 10);
const RATE_LIMIT_PER_HOUR = parseInt(
  process.env.RATE_LIMIT_PER_HOUR || '20',
  10,
);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const HOUR_MS = 60 * 60 * 1000;

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Variable d'environnement manquante : ${name}`);
  return v;
}

const transport = nodemailer.createTransport({
  host: requireEnv('SMTP_HOST'),
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: (process.env.SMTP_SECURE ?? 'true') === 'true',
  auth: {
    user: requireEnv('SMTP_USER'),
    pass: requireEnv('SMTP_PASS'),
  },
});
const SMTP_FROM = requireEnv('SMTP_FROM');
const MAIL_TO = requireEnv('MAIL_TO');

// Rate limit en mémoire : ip → { count, windowStart }
// Reset automatique après 1h. Pas de persistance (acceptable pour ce volume).
const rateLimits = new Map();
function withinRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || now - entry.windowStart > HOUR_MS) {
    rateLimits.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT_PER_HOUR) return false;
  entry.count++;
  return true;
}

// Nettoyage périodique pour pas que la Map grossisse à l'infini.
setInterval(
  () => {
    const now = Date.now();
    for (const [ip, entry] of rateLimits) {
      if (now - entry.windowStart > HOUR_MS) rateLimits.delete(ip);
    }
  },
  10 * 60 * 1000,
);

function validate(body) {
  if (!body || typeof body !== 'object') return { error: 'invalid body' };
  const errors = [];
  const trim = (s) => (typeof s === 'string' ? s.trim() : '');
  const nom = trim(body.nom);
  const email = trim(body.email);
  const type = trim(body.type);
  const message = trim(body.message);

  if (!nom || nom.length > 200) errors.push('nom invalide');
  if (!email || email.length > 200 || !/^.+@.+\..+$/.test(email))
    errors.push('email invalide');
  if (!message || message.length > 10000) errors.push('message invalide');
  if (type.length > 200) errors.push('type invalide');

  if (errors.length) return { error: errors.join(', ') };
  return { data: { nom, email, type, message, website: body.website } };
}

function logEvent(event, fields = {}) {
  console.log(
    JSON.stringify({ time: new Date().toISOString(), event, ...fields }),
  );
}

const app = new Hono();

app.get('/', (c) => c.json({ ok: true, service: '2mains-mail' }));

app.post('/api/contact', async (c) => {
  const ip =
    c.req.header('x-real-ip') ||
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  if (!withinRateLimit(ip)) {
    logEvent('rate_limited', { ip });
    return c.json({ error: 'Trop de requêtes' }, 429);
  }

  // Filtrage origin si configuré (sinon * = laisse passer).
  if (ALLOWED_ORIGIN !== '*') {
    const origin = c.req.header('origin') || c.req.header('referer') || '';
    if (!origin.startsWith(ALLOWED_ORIGIN)) {
      logEvent('origin_rejected', { ip, origin });
      return c.json({ error: 'Origin non autorisée' }, 403);
    }
  }

  const body = await c.req.json().catch(() => null);
  const result = validate(body);
  if (result.error) {
    logEvent('validation_failed', { ip, reason: result.error });
    return c.json({ error: result.error }, 400);
  }

  // Honeypot : champ caché côté formulaire, doit rester vide. Si rempli,
  // on retourne 200 silencieusement pour pas révéler la détection.
  if (result.data.website && result.data.website.length > 0) {
    logEvent('honeypot_triggered', { ip });
    return c.json({ ok: true });
  }

  const { nom, email, type, message } = result.data;
  const subject = `[Site] Message de ${nom}${type ? ' — ' + type : ''}`;
  const text = `De : ${nom} <${email}>
Type : ${type || '—'}

${message}
`;

  try {
    await transport.sendMail({
      from: SMTP_FROM,
      to: MAIL_TO,
      replyTo: `${nom} <${email}>`,
      subject,
      text,
    });
    logEvent('mail_sent', { ip, from: email });
    return c.json({ ok: true });
  } catch (err) {
    logEvent('mail_failed', { ip, error: err.message });
    return c.json({ error: 'Envoi impossible, réessayez plus tard.' }, 500);
  }
});

const server = serve({ fetch: app.fetch, port: PORT }, (info) => {
  logEvent('listening', { port: info.port });
});

// Arrêt propre en cas de SIGTERM (docker stop).
function shutdown() {
  logEvent('shutting_down');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
