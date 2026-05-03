// Constantes de durée et de format pour le système d'auth.
// Toutes surchargeables via env (cf .env.example).

function parseInt10(v: string | undefined, fallback: number): number {
  if (!v) return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const AUTH_CONFIG = {
  invitationTtlDays: parseInt10(process.env.INVITATION_TTL_DAYS, 7),
  otpTtlMinutes: parseInt10(process.env.OTP_TTL_MINUTES, 10),
  trustedDeviceTtlDays: parseInt10(process.env.TRUSTED_DEVICE_TTL_DAYS, 7),
  sessionInactiveHours: parseInt10(process.env.SESSION_INACTIVE_HOURS, 48),
  // step-up password : durée pendant laquelle un mdp re-saisi reste valide
  // pour effectuer une action sensible (changer méthode 2FA, regen backup
  // codes). Court par design — il faut le re-saisir à chaque session de
  // travail sécurisée.
  stepUpTtlMinutes: parseInt10(process.env.STEP_UP_TTL_MINUTES, 10),
  otpDigits: 6,
  backupCodeCount: 8,
  // Pré-tentatives OTP par code (avant invalidation forcée du code).
  otpMaxAttemptsPerCode: 5,
};

export const COOKIE_NAMES = {
  trustedDevice: 'pl_trusted_device',
  pendingTwoFactor: 'pl_pending_2fa',
  stepUp: 'pl_step_up',
} as const;
