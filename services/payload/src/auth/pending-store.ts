// Stockage en mémoire des sessions de login en attente de 2FA.
//
// Le flux est :
//   1. POST /users/login-2fa avec email+password → on appelle
//      payload.login() en interne, on récupère le JWT Payload et l'user.
//      On stocke { token, userId, expiresAt } dans cette Map indexée
//      par un sessionId aléatoire. On renvoie au client un cookie signé
//      contenant le sessionId.
//   2. POST /users/two-factor/verify → on lit le sessionId, on vérifie
//      le code OTP, et on installe le cookie payload-token dans la
//      réponse (avec le JWT mémorisé). On purge l'entrée.
//
// Avantages :
//   - Le password n'est jamais re-stocké, c'est juste le JWT déjà émis
//     par Payload qu'on garde temporairement.
//   - Le cookie payload-token n'est posé qu'après vérif 2FA réussie,
//     donc une session intermédiaire ne donne aucun accès aux APIs.
//
// Limites :
//   - Map en mémoire = ne survit pas au reboot et ne fonctionne pas en
//     multi-instance. Acceptable ici (1 process Next.js, sessions
//     pending éphémères de quelques minutes max).

type PendingLogin = {
  userId: number | string;
  email: string;
  token: string;
  expiresAt: number;
};

const pendingLogins = new Map<string, PendingLogin>();

const STEP_UP_TTL_MS = 10 * 60 * 1000;
type StepUp = { userId: number | string; expiresAt: number };
const stepUps = new Map<string, StepUp>();

import { randomBytes } from 'node:crypto';

export function createPendingLogin(opts: {
  userId: number | string;
  email: string;
  token: string;
  ttlMs: number;
}): string {
  const sessionId = randomBytes(32).toString('base64url');
  pendingLogins.set(sessionId, {
    userId: opts.userId,
    email: opts.email,
    token: opts.token,
    expiresAt: Date.now() + opts.ttlMs,
  });
  return sessionId;
}

export function consumePendingLogin(sessionId: string | null | undefined): PendingLogin | null {
  if (!sessionId) return null;
  const entry = pendingLogins.get(sessionId);
  if (!entry) return null;
  pendingLogins.delete(sessionId);
  if (entry.expiresAt < Date.now()) return null;
  return entry;
}

export function peekPendingLogin(sessionId: string | null | undefined): PendingLogin | null {
  if (!sessionId) return null;
  const entry = pendingLogins.get(sessionId);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    pendingLogins.delete(sessionId);
    return null;
  }
  return entry;
}

export function dropPendingLogin(sessionId: string | null | undefined): void {
  if (sessionId) pendingLogins.delete(sessionId);
}

// ─── Step-up (re-saisie mdp pour action sensible) ────────────────────

export function grantStepUp(userId: number | string, ttlMs = STEP_UP_TTL_MS): string {
  const tokenId = randomBytes(32).toString('base64url');
  stepUps.set(tokenId, { userId, expiresAt: Date.now() + ttlMs });
  return tokenId;
}

export function consumeStepUp(tokenId: string | null | undefined, userId: number | string): boolean {
  if (!tokenId) return false;
  const entry = stepUps.get(tokenId);
  if (!entry) return false;
  stepUps.delete(tokenId);
  if (entry.expiresAt < Date.now()) return false;
  return entry.userId === userId;
}

// Ne consomme pas (pour permettre plusieurs actions consécutives sous
// la même fenêtre step-up).
export function checkStepUp(tokenId: string | null | undefined, userId: number | string): boolean {
  if (!tokenId) return false;
  const entry = stepUps.get(tokenId);
  if (!entry) return false;
  if (entry.expiresAt < Date.now()) {
    stepUps.delete(tokenId);
    return false;
  }
  return entry.userId === userId;
}

// Cleanup périodique
let cleanupHandle: ReturnType<typeof setInterval> | null = null;
export function startPendingCleanup(): void {
  if (cleanupHandle) return;
  cleanupHandle = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of pendingLogins) {
      if (v.expiresAt < now) pendingLogins.delete(k);
    }
    for (const [k, v] of stepUps) {
      if (v.expiresAt < now) stepUps.delete(k);
    }
  }, 5 * 60 * 1000);
  cleanupHandle.unref?.();
}
