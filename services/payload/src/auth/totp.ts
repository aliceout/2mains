// Wrapper TOTP (RFC 6238) basé sur otpauth. SHA-1 / 6 chiffres / fenêtre
// 30 s, ce qui est ce que tous les authenticators (Google, Authy, 1Password,
// Aegis…) supportent par défaut.
//
// On accepte ±1 step (=  ±30 s) pour absorber le drift d'horloge entre
// le serveur et le téléphone. Les codes TOTP sont à usage unique côté
// utilisateur (chaque code n'est valide que pendant 30 s), pas besoin
// de mémoriser les codes déjà utilisés pour un usage solo.

import { Secret, TOTP } from 'otpauth';
import qrcode from 'qrcode';

const TOTP_ISSUER = '2mains de femmes';
const PERIOD = 30;
const DIGITS = 6;
const ALGORITHM = 'SHA1';

export type TotpEnrollmentChallenge = {
  secret: string;
  otpauthUri: string;
  qrDataUrl: string;
};

export function generateTotpSecret(): string {
  return new Secret({ size: 20 }).base32;
}

function buildTotp(secret: string, label: string): TOTP {
  return new TOTP({
    issuer: TOTP_ISSUER,
    label,
    secret: Secret.fromBase32(secret),
    algorithm: ALGORITHM,
    digits: DIGITS,
    period: PERIOD,
  });
}

export async function buildEnrollmentChallenge(
  email: string,
  secret = generateTotpSecret(),
): Promise<TotpEnrollmentChallenge> {
  const totp = buildTotp(secret, email);
  const otpauthUri = totp.toString();
  const qrDataUrl = await qrcode.toDataURL(otpauthUri, {
    errorCorrectionLevel: 'M',
    margin: 1,
    scale: 6,
  });
  return { secret, otpauthUri, qrDataUrl };
}

export function verifyTotpCode(secret: string, code: string, email = ''): boolean {
  const totp = buildTotp(secret, email);
  // window: 1 → accepte le code courant, le précédent, et le suivant.
  const delta = totp.validate({ token: code.replace(/\s/g, ''), window: 1 });
  return delta !== null;
}
