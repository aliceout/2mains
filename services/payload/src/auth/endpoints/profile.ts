// Endpoints de gestion 2FA depuis le profil utilisateur.
//
// Toutes les actions sensibles (changement méthode 2FA, regen backup codes,
// enrôlement TOTP, révocation device) nécessitent une re-saisie récente du
// mot de passe (step-up) — sauf la révocation par soi-même d'un device
// individuel, qui est juste une action de gestion.
//
//   POST /users/me/step-up           Body: { password }
//   POST /users/me/two-factor/totp/init       (step-up)
//   POST /users/me/two-factor/totp/confirm    Body: { code } (step-up)
//   POST /users/me/two-factor/method          Body: { method } (step-up, et rejeté si totp non enrôlé)
//   POST /users/me/two-factor/backup-codes/regenerate   (step-up)
//   GET  /users/me/trusted-devices
//   DELETE /users/me/trusted-devices/:deviceId
//   POST /users/me/two-factor/disable-totp    (step-up) → repasse à email

import type { Endpoint, PayloadRequest } from 'payload';

import { generateBackupCodeSet, encryptSecret, hashBackupCode, hashToken } from '../crypto';
import { twoFactorMethodChangedEmail } from '../email-templates';
import {
  buildStepUpCookie,
  clearStepUpCookie,
  errorResponse,
  jsonResponse,
  readJsonBody,
  readStepUpCookie,
  requireUser,
} from '../helpers';
import { checkStepUp, grantStepUp } from '../pending-store';
import { consume, RATE_PROFILES } from '../rate-limit';
import { buildEnrollmentChallenge, generateTotpSecret, verifyTotpCode } from '../totp';

async function ensureStepUp(req: PayloadRequest): Promise<{ ok: true; userId: number | string } | Response> {
  const actor = requireUser(req);
  if (!actor) return errorResponse('Non authentifié', 401);
  const tokenId = readStepUpCookie(req);
  if (!tokenId || !checkStepUp(tokenId, actor.id)) {
    return errorResponse('Re-saisis ton mot de passe pour continuer.', 401, 'step_up_required');
  }
  return { ok: true, userId: actor.id };
}

// ─── POST /users/me/step-up ────────────────────────────────────────

const stepUpEndpoint: Endpoint = {
  path: '/me/step-up',
  method: 'post',
  handler: async (req) => {
    const actor = requireUser(req);
    if (!actor) return errorResponse('Non authentifié', 401);

    const rl = consume(RATE_PROFILES.login, `step-up:${actor.id}`);
    if (!rl.ok) return errorResponse('Trop de tentatives, réessayez plus tard.', 429);

    const body = await readJsonBody<{ password?: string }>(req);
    const password = body?.password;
    if (!password) return errorResponse('Mot de passe requis', 400);

    try {
      await req.payload.login({
        collection: 'users',
        data: { email: actor.email, password },
        req,
      });
    } catch {
      return errorResponse('Mot de passe incorrect', 401);
    }

    const tokenId = grantStepUp(actor.id);
    return jsonResponse({ ok: true }, { status: 200 }, [buildStepUpCookie(tokenId)]);
  },
};

// ─── POST /users/me/two-factor/totp/init ──────────────────────────

const totpInitEndpoint: Endpoint = {
  path: '/me/two-factor/totp/init',
  method: 'post',
  handler: async (req) => {
    const guard = await ensureStepUp(req);
    if (guard instanceof Response) return guard;
    const actor = requireUser(req)!;

    // On génère un nouveau secret à chaque init, on ne l'enregistre PAS
    // tant que /confirm n'a pas validé un code TOTP. On le renvoie au
    // client + on attend qu'il fasse un POST /confirm avec ce secret +
    // un code dérivé.
    const secret = generateTotpSecret();
    const challenge = await buildEnrollmentChallenge(actor.email, secret);
    return jsonResponse({
      secret: challenge.secret,
      otpauthUri: challenge.otpauthUri,
      qrDataUrl: challenge.qrDataUrl,
    });
  },
};

// ─── POST /users/me/two-factor/totp/confirm ───────────────────────

const totpConfirmEndpoint: Endpoint = {
  path: '/me/two-factor/totp/confirm',
  method: 'post',
  handler: async (req) => {
    const guard = await ensureStepUp(req);
    if (guard instanceof Response) return guard;
    const actor = requireUser(req)!;

    const rl = consume(RATE_PROFILES.otp, `enroll:${actor.id}`);
    if (!rl.ok) return errorResponse('Trop de tentatives, réessayez plus tard.', 429);

    const body = await readJsonBody<{ secret?: string; code?: string }>(req);
    if (!body?.secret || !body?.code) return errorResponse('Secret et code requis', 400);
    if (!verifyTotpCode(body.secret, body.code, actor.email)) {
      return errorResponse('Code TOTP invalide', 401);
    }

    // Enrôlement OK → on stocke le secret chiffré, on switch la méthode,
    // et on génère 8 nouveaux backup codes.
    const backupCodes = generateBackupCodeSet(8);
    const backupCodeHashes = backupCodes.map((c) => ({ hash: hashBackupCode(c) }));

    await req.payload.update({
      collection: 'users',
      id: actor.id,
      overrideAccess: true,
      req,
      data: {
        twoFactorMethod: 'totp',
        twoFactor: {
          totpSecret: encryptSecret(body.secret),
          totpEnrolledAt: new Date().toISOString(),
          backupCodeHashes,
          backupCodesGeneratedAt: new Date().toISOString(),
          emailCodeHash: null,
          emailCodeExpiresAt: null,
          emailCodeAttempts: 0,
        },
      },
    });

    try {
      const tpl = twoFactorMethodChangedEmail({ email: actor.email, newMethod: 'totp' });
      await req.payload.sendEmail({
        to: actor.email,
        subject: tpl.subject,
        html: tpl.html,
        text: tpl.text,
      });
    } catch (err) {
      req.payload.logger.warn({ err }, 'method_change_email_failed');
    }

    return jsonResponse({ ok: true, backupCodes });
  },
};

// ─── POST /users/me/two-factor/method ─────────────────────────────

const setMethodEndpoint: Endpoint = {
  path: '/me/two-factor/method',
  method: 'post',
  handler: async (req) => {
    const guard = await ensureStepUp(req);
    if (guard instanceof Response) return guard;
    const actor = requireUser(req)!;

    const body = await readJsonBody<{ method?: string }>(req);
    const method = body?.method;
    if (method !== 'email' && method !== 'totp') return errorResponse('Méthode invalide', 400);

    if (method === 'totp') {
      // Pour passer en TOTP, il faut d'abord avoir enrôlé un secret via
      // /totp/confirm. /confirm fait déjà le switch — donc cet endpoint
      // sert à repasser de TOTP vers email.
      return errorResponse('Pour activer TOTP, utilise l\'enrôlement via /totp/init puis /totp/confirm.', 400);
    }

    // Repasse en email.
    await req.payload.update({
      collection: 'users',
      id: actor.id,
      overrideAccess: true,
      req,
      data: {
        twoFactorMethod: 'email',
        twoFactor: {
          totpSecret: null,
          totpEnrolledAt: null,
          backupCodeHashes: [],
          backupCodesGeneratedAt: null,
        },
      },
    });

    try {
      const tpl = twoFactorMethodChangedEmail({ email: actor.email, newMethod: 'email' });
      await req.payload.sendEmail({
        to: actor.email,
        subject: tpl.subject,
        html: tpl.html,
        text: tpl.text,
      });
    } catch (err) {
      req.payload.logger.warn({ err }, 'method_change_email_failed');
    }

    return jsonResponse({ ok: true, method: 'email' });
  },
};

// ─── POST /users/me/two-factor/backup-codes/regenerate ────────────

const regenBackupCodesEndpoint: Endpoint = {
  path: '/me/two-factor/backup-codes/regenerate',
  method: 'post',
  handler: async (req) => {
    const guard = await ensureStepUp(req);
    if (guard instanceof Response) return guard;
    const actor = requireUser(req)!;

    const codes = generateBackupCodeSet(8);
    const hashes = codes.map((c) => ({ hash: hashBackupCode(c) }));
    await req.payload.update({
      collection: 'users',
      id: actor.id,
      overrideAccess: true,
      req,
      data: {
        twoFactor: {
          backupCodeHashes: hashes,
          backupCodesGeneratedAt: new Date().toISOString(),
        },
      },
    });
    return jsonResponse({ ok: true, backupCodes: codes });
  },
};

// ─── GET /users/me/trusted-devices ────────────────────────────────

const listDevicesEndpoint: Endpoint = {
  path: '/me/trusted-devices',
  method: 'get',
  handler: async (req) => {
    const actor = requireUser(req);
    if (!actor) return errorResponse('Non authentifié', 401);
    const user = await req.payload.findByID({
      collection: 'users',
      id: actor.id,
      overrideAccess: true,
      req,
      depth: 0,
    });
    const devices = ((user as { trustedDevices?: Array<{ deviceId: string; label?: string; userAgent?: string; ip?: string; createdAt: string; expiresAt: string }> }).trustedDevices ?? [])
      .filter((d) => new Date(d.expiresAt).getTime() > Date.now())
      .map((d) => ({
        deviceId: d.deviceId,
        label: d.label,
        userAgent: d.userAgent,
        ip: d.ip,
        createdAt: d.createdAt,
        expiresAt: d.expiresAt,
      }));
    return jsonResponse({ devices });
  },
};

// ─── DELETE /users/me/trusted-devices/:deviceId ───────────────────

const revokeDeviceEndpoint: Endpoint = {
  path: '/me/trusted-devices/:deviceId',
  method: 'delete',
  handler: async (req) => {
    const actor = requireUser(req);
    if (!actor) return errorResponse('Non authentifié', 401);
    const deviceId = (req.routeParams as { deviceId?: string } | undefined)?.deviceId;
    if (!deviceId) return errorResponse('deviceId manquant', 400);

    const user = await req.payload.findByID({
      collection: 'users',
      id: actor.id,
      overrideAccess: true,
      req,
      depth: 0,
    });
    const remaining = ((user as { trustedDevices?: Array<{ deviceId: string; fingerprintHash: string; expiresAt: string; createdAt: string; label?: string; userAgent?: string; ip?: string }> }).trustedDevices ?? [])
      .filter((d) => d.deviceId !== deviceId);
    await req.payload.update({
      collection: 'users',
      id: actor.id,
      overrideAccess: true,
      req,
      data: { trustedDevices: remaining },
    });
    return jsonResponse({ ok: true });
  },
};

// ─── POST /users/me/touch ─────────────────────────────────────────
// Pingé périodiquement par l'admin Payload tant que l'onglet est ouvert.
// Met à jour lastActivityAt → permet au cleanup cron de distinguer un
// onglet ouvert mais inactif d'un user vraiment parti.

const touchEndpoint: Endpoint = {
  path: '/me/touch',
  method: 'post',
  handler: async (req) => {
    const actor = requireUser(req);
    if (!actor) return errorResponse('Non authentifié', 401);
    await req.payload.update({
      collection: 'users',
      id: actor.id,
      overrideAccess: true,
      req,
      data: { lastActivityAt: new Date().toISOString() },
    });
    return jsonResponse({ ok: true });
  },
};

// ─── POST /users/me/logout ────────────────────────────────────────
// Logout explicite : invalide la session côté Payload + supprime les
// cookies. (Payload a déjà /users/logout natif, mais on veut aussi
// nettoyer notre cookie pl_step_up et clear le trusted device cookie
// optionnellement.)

const logoutEndpoint: Endpoint = {
  path: '/me/logout',
  method: 'post',
  handler: async (req) => {
    const actor = requireUser(req);
    if (!actor) return jsonResponse({ ok: true });
    const cookies = [
      clearStepUpCookie(),
      // payload-token est nettoyé par /users/logout natif. On laisse
      // le client appeler les deux endpoints.
    ];
    return jsonResponse({ ok: true }, { status: 200 }, cookies);
  },
};

export const profileEndpoints: Endpoint[] = [
  stepUpEndpoint,
  totpInitEndpoint,
  totpConfirmEndpoint,
  setMethodEndpoint,
  regenBackupCodesEndpoint,
  listDevicesEndpoint,
  revokeDeviceEndpoint,
  touchEndpoint,
  logoutEndpoint,
];
