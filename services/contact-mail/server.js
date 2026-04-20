import http from 'node:http';
import nodemailer from 'nodemailer';

const PORT = parseInt(process.env.PORT || '3000', 10);
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const CONTACT_TO = process.env.CONTACT_TO || SMTP_USER;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://2mainsdefemmes.org';
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT_PER_HOUR || '5', 10);

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.error('Missing SMTP_HOST / SMTP_USER / SMTP_PASS env vars');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

// Rate limiting en mémoire (par IP, fenêtre glissante d'une heure).
const hits = new Map();
function rateLimitOk(ip) {
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  const list = (hits.get(ip) || []).filter((t) => now - t < hour);
  if (list.length >= RATE_LIMIT) return false;
  list.push(now);
  hits.set(ip, list);
  return true;
}

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
    if (Buffer.concat(chunks).length > 64 * 1024) throw new Error('body too large');
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    return;
  }

  if (req.method !== 'POST' || !(req.url === '/send' || req.url === '/')) {
    return send(res, 404, { error: 'Not found' });
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').toString().split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'unknown';

  if (!rateLimitOk(ip)) {
    return send(res, 429, { error: 'Trop de messages, réessayez plus tard.' });
  }

  let data;
  try {
    data = await readJson(req);
  } catch {
    return send(res, 400, { error: 'JSON invalide.' });
  }

  // Honeypot : si le champ invisible "website" est rempli, c'est un bot.
  if (data.website) {
    return send(res, 200, { ok: true });
  }

  const nom = (data.nom || '').toString().trim();
  const email = (data.email || '').toString().trim();
  const type = (data.type || '').toString().trim().slice(0, 120);
  const message = (data.message || '').toString().trim();

  if (!nom || !email || !message) {
    return send(res, 400, { error: 'Champs obligatoires manquants.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return send(res, 400, { error: 'Email invalide.' });
  }
  if (message.length > 5000) {
    return send(res, 400, { error: 'Message trop long (5 000 caractères max).' });
  }

  try {
    await transporter.sendMail({
      from: `"Formulaire 2mdf" <${SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: `"${nom}" <${email}>`,
      subject: `[Site 2mdf] ${type || 'Contact'} — ${nom}`,
      text: `De : ${nom} <${email}>\nType : ${type || '—'}\nIP : ${ip}\n\n${message}`,
    });
    console.log(`[ok] ${ip} ${email} (${type || '—'})`);
    return send(res, 200, { ok: true });
  } catch (err) {
    console.error('[err] SMTP:', err?.message || err);
    return send(res, 500, { error: "Envoi impossible pour l'instant." });
  }
});

server.listen(PORT, () => {
  console.log(`contact-mail listening on :${PORT}`);
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    server.close(() => process.exit(0));
  });
}
