// Primitives crypto pour le système d'auth (invitations, 2FA, devices).
//
// Toutes les valeurs sensibles vont en base sous forme hachée ou chiffrée :
//  - Tokens d'invitation, codes OTP email, codes backup, fingerprints
//    de devices  → hash SHA-256 (pas besoin de bcrypt : grande entropie,
//    courte durée de vie).
//  - Secret TOTP                                       → AES-256-GCM,
//    clé dérivée de PAYLOAD_SECRET (chiffrement réversible nécessaire :
//    on doit recalculer les codes à chaque vérification).
//
// Les comparaisons de tokens se font en temps constant.

import { createCipheriv, createDecipheriv, createHash, randomBytes, randomInt, scryptSync, timingSafeEqual } from 'node:crypto';

function getMasterKey(): Buffer {
  const secret = process.env.PAYLOAD_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('PAYLOAD_SECRET manquant ou trop court (min 32 chars)');
  }
  return scryptSync(secret, '2mains-auth-v1', 32);
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

export function safeEqualHex(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b || a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
  } catch {
    return false;
  }
}

// Token d'invitation, lien de reset, identifiant de device : 32 octets en
// base64url (43 chars). Entropie 256 bits, URL-safe, lisible dans un mail.
export function generateUrlSafeToken(): string {
  return randomBytes(32).toString('base64url');
}

// Code OTP email : 6 chiffres. randomInt évite le biais modulo.
export function generateNumericCode(digits = 6): string {
  const max = 10 ** digits;
  return randomInt(0, max).toString().padStart(digits, '0');
}

// Codes de secours TOTP : 8 codes, format XXXX-XXXX (alphanum sans
// caractères ambigus 0/O/1/I/L). Entropie ~41 bits par code, suffisant
// vu qu'ils sont rate-limités et à usage unique.
const BACKUP_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateBackupCode(): string {
  let out = '';
  for (let i = 0; i < 8; i++) {
    out += BACKUP_ALPHABET[randomInt(0, BACKUP_ALPHABET.length)];
    if (i === 3) out += '-';
  }
  return out;
}

export function generateBackupCodeSet(count = 8): string[] {
  return Array.from({ length: count }, () => generateBackupCode());
}

// Normalise un code backup saisi : supprime espaces, tirets, met en majuscule.
export function normalizeBackupCode(input: string): string {
  return input.replace(/[\s-]/g, '').toUpperCase();
}

export function hashBackupCode(code: string): string {
  return hashToken(normalizeBackupCode(code));
}

// AES-256-GCM pour les secrets TOTP. Format en base : iv(12)|tag(16)|ct,
// le tout en base64. À la rotation de PAYLOAD_SECRET, les secrets TOTP
// sont invalidés (acceptable : les users devront ré-enrôler).
export function encryptSecret(plaintext: string): string {
  const key = getMasterKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString('base64');
}

export function decryptSecret(payload: string): string {
  const key = getMasterKey();
  const buf = Buffer.from(payload, 'base64');
  if (buf.length < 28) throw new Error('Payload chiffré invalide');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const ct = buf.subarray(28);
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
}
