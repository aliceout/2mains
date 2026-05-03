// Templates HTML + texte pour les mails transactionnels du système d'auth.
//
// Style sobre, monochrome (orange 2mains en accent), sans images ni
// tracking. Le HTML est lisible aussi en plain-text (table-less, pas
// de CSS critique). Tous les wordings en français.

import { AUTH_CONFIG } from './config';

const ORANGE = '#EC6A2C';
const TEXT = '#1f1f1f';
const MUTED = '#666';

function shell(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f9e8d8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${TEXT};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9e8d8;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:8px;padding:32px;text-align:left;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:14px;color:${MUTED};letter-spacing:0.5px;text-transform:uppercase;">2mains de femmes</p>
          <h1 style="margin:0 0 24px;font-size:22px;color:${TEXT};">${escapeHtml(title)}</h1>
          ${bodyHtml}
        </td></tr>
      </table>
      <p style="margin:24px 0 0;font-size:12px;color:${MUTED};">Mail automatique. Ne pas y répondre.</p>
    </td></tr>
  </table>
</body>
</html>`;
}

function button(href: string, label: string): string {
  return `<p style="margin:24px 0;"><a href="${escapeHtml(href)}" style="display:inline-block;background:${ORANGE};color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;">${escapeHtml(label)}</a></p>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── Invitation ─────────────────────────────────────────────────────

export function invitationEmail(opts: {
  inviteeEmail: string;
  inviterName?: string | null;
  acceptUrl: string;
}): { subject: string; html: string; text: string } {
  const days = AUTH_CONFIG.invitationTtlDays;
  const inviter = opts.inviterName?.trim() || 'L\'équipe 2mains de femmes';
  const subject = 'Invitation à rejoindre l\'espace d\'administration de 2mains de femmes';

  const text = `Bonjour,

${inviter} t'invite à rejoindre l'espace d'administration du site 2mains de femmes.

Pour activer ton compte (${opts.inviteeEmail}) et choisir ton mot de passe, clique sur le lien ci-dessous. Il est valable ${days} jours.

${opts.acceptUrl}

Si tu ne t'attendais pas à recevoir ce mail, tu peux l'ignorer — le compte sera supprimé automatiquement à l'expiration du lien.

— 2mains de femmes
`;

  const html = shell(
    'Tu as été invité·e à rejoindre l\'espace d\'administration',
    `<p style="margin:0 0 16px;line-height:1.5;">${escapeHtml(inviter)} t'invite à rejoindre l'espace d'administration du site <strong>2mains de femmes</strong>.</p>
<p style="margin:0 0 16px;line-height:1.5;">Pour activer ton compte (<strong>${escapeHtml(opts.inviteeEmail)}</strong>) et choisir ton mot de passe, clique sur le bouton ci-dessous.</p>
${button(opts.acceptUrl, 'Activer mon compte')}
<p style="margin:0 0 16px;font-size:14px;color:${MUTED};line-height:1.5;">Ce lien est valable <strong>${days} jours</strong>. Passé ce délai, le compte sera supprimé automatiquement.</p>
<p style="margin:24px 0 0;font-size:13px;color:${MUTED};line-height:1.5;">Si tu ne t'attendais pas à ce mail, ignore-le simplement. Si le bouton ne fonctionne pas, copie ce lien dans ton navigateur :<br><span style="word-break:break-all;">${escapeHtml(opts.acceptUrl)}</span></p>`,
  );

  return { subject, html, text };
}

// ─── OTP email (2FA) ────────────────────────────────────────────────

export function twoFactorCodeEmail(opts: {
  code: string;
  ip?: string;
  userAgent?: string;
}): { subject: string; html: string; text: string } {
  const ttl = AUTH_CONFIG.otpTtlMinutes;
  const subject = `Code de vérification : ${opts.code}`;

  const ipLine = opts.ip ? `IP : ${opts.ip}\n` : '';
  const uaLine = opts.userAgent ? `Navigateur : ${opts.userAgent}\n` : '';

  const text = `Ton code de vérification :

  ${opts.code}

Valable ${ttl} minutes. À saisir dans la fenêtre de connexion.

${ipLine}${uaLine}
Si ce n'est pas toi qui essaies de te connecter, change ton mot de passe immédiatement.
`;

  const html = shell(
    'Ton code de vérification',
    `<p style="margin:0 0 16px;line-height:1.5;">Saisis ce code pour finaliser ta connexion :</p>
<p style="margin:24px 0;font-size:32px;font-weight:700;letter-spacing:8px;text-align:center;background:#f9e8d8;padding:16px;border-radius:6px;color:${TEXT};">${escapeHtml(opts.code)}</p>
<p style="margin:0 0 16px;font-size:14px;color:${MUTED};line-height:1.5;">Valable <strong>${ttl} minutes</strong>.</p>
${
  opts.ip || opts.userAgent
    ? `<p style="margin:16px 0 0;font-size:13px;color:${MUTED};line-height:1.5;">Tentative depuis :${opts.ip ? `<br>IP : ${escapeHtml(opts.ip)}` : ''}${opts.userAgent ? `<br>Navigateur : ${escapeHtml(opts.userAgent)}` : ''}</p>`
    : ''
}
<p style="margin:16px 0 0;font-size:13px;color:${MUTED};line-height:1.5;">Si ce n'est pas toi qui essaies de te connecter, change immédiatement ton mot de passe.</p>`,
  );

  return { subject, html, text };
}

// ─── Bienvenue (post-activation) ────────────────────────────────────

export function welcomeEmail(opts: {
  email: string;
  loginUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = 'Bienvenue sur l\'espace d\'administration de 2mains de femmes';

  const text = `Bonjour,

Ton compte ${opts.email} est maintenant actif.

Tu peux te connecter à l'espace d'administration ici :
${opts.loginUrl}

Par défaut, ta connexion est protégée par un code à usage unique envoyé par email à chaque connexion (toutes les semaines depuis un même appareil de confiance).

Tu peux passer à une application TOTP (Google Authenticator, Authy, 1Password, Aegis…) depuis ton profil → Sécurité.

— 2mains de femmes
`;

  const html = shell(
    'Bienvenue ! Ton compte est actif',
    `<p style="margin:0 0 16px;line-height:1.5;">Ton compte <strong>${escapeHtml(opts.email)}</strong> est maintenant actif.</p>
${button(opts.loginUrl, 'Aller à l\'espace d\'administration')}
<p style="margin:0 0 16px;line-height:1.5;">Ta connexion est protégée par un code à usage unique reçu par email. Sur un appareil de confiance, on te le redemandera environ une fois par semaine.</p>
<p style="margin:0 0 16px;line-height:1.5;">Tu peux activer une application TOTP (Google Authenticator, Authy, 1Password, Aegis…) à la place, depuis ton profil → <strong>Sécurité</strong>.</p>`,
  );

  return { subject, html, text };
}

// ─── Notif sécurité : nouveau device de confiance ───────────────────

export function newTrustedDeviceEmail(opts: {
  email: string;
  ip?: string;
  userAgent?: string;
  revokeUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = 'Nouvel appareil de confiance ajouté à ton compte';
  const ipLine = opts.ip ? `\nIP : ${opts.ip}` : '';
  const uaLine = opts.userAgent ? `\nNavigateur : ${opts.userAgent}` : '';

  const text = `Bonjour,

Un nouvel appareil vient d'être ajouté à la liste des appareils de confiance pour ton compte ${opts.email}.${ipLine}${uaLine}

Tant qu'il est marqué de confiance (7 jours), il ne te demandera plus de code de vérification à la connexion.

Si ce n'est pas toi, révoque cet appareil immédiatement et change ton mot de passe :
${opts.revokeUrl}

— 2mains de femmes
`;

  const html = shell(
    'Nouvel appareil de confiance',
    `<p style="margin:0 0 16px;line-height:1.5;">Un nouvel appareil vient d'être ajouté à la liste des appareils de confiance pour ton compte <strong>${escapeHtml(opts.email)}</strong>.</p>
${
  opts.ip || opts.userAgent
    ? `<p style="margin:0 0 16px;font-size:14px;color:${MUTED};line-height:1.5;">${opts.ip ? `IP : ${escapeHtml(opts.ip)}<br>` : ''}${opts.userAgent ? `Navigateur : ${escapeHtml(opts.userAgent)}` : ''}</p>`
    : ''
}
<p style="margin:0 0 16px;line-height:1.5;">Tant qu'il est marqué de confiance (7 jours), il ne te demandera plus de code à la connexion.</p>
<p style="margin:0 0 16px;line-height:1.5;"><strong>Si ce n'est pas toi</strong>, révoque cet appareil immédiatement et change ton mot de passe.</p>
${button(opts.revokeUrl, 'Voir mes appareils de confiance')}`,
  );

  return { subject, html, text };
}

// ─── Notif sécurité : méthode 2FA changée ───────────────────────────

export function twoFactorMethodChangedEmail(opts: {
  email: string;
  newMethod: 'email' | 'totp';
}): { subject: string; html: string; text: string } {
  const methodLabel = opts.newMethod === 'totp' ? 'application TOTP' : 'code par email';
  const subject = `Méthode de double authentification modifiée (${methodLabel})`;

  const text = `Bonjour,

La méthode de double authentification de ton compte ${opts.email} vient d'être changée.

Nouvelle méthode : ${methodLabel}.

Si tu n'es pas à l'origine de ce changement, change immédiatement ton mot de passe et contacte un administrateur.

— 2mains de femmes
`;

  const html = shell(
    'Méthode 2FA modifiée',
    `<p style="margin:0 0 16px;line-height:1.5;">La méthode de double authentification de ton compte <strong>${escapeHtml(opts.email)}</strong> vient d'être changée.</p>
<p style="margin:0 0 16px;line-height:1.5;">Nouvelle méthode : <strong>${escapeHtml(methodLabel)}</strong>.</p>
<p style="margin:0 0 16px;line-height:1.5;"><strong>Si ce n'est pas toi</strong>, change immédiatement ton mot de passe et contacte un administrateur.</p>`,
  );

  return { subject, html, text };
}
