'use client';

// Onglet "Sécurité" affiché dans le profil utilisateur.
//
// Permet de :
//  - Voir / changer la méthode 2FA (email ↔ TOTP)
//  - Enrôler un TOTP (QR code) → reçoit ses 8 backup codes
//  - Régénérer les backup codes
//  - Voir et révoquer les appareils de confiance
//  - Re-saisir son mot de passe pour débloquer les actions sensibles
//
// Toutes les actions sensibles passent par /me/step-up (cookie pl_step_up
// valable 10 min). Le composant tente l'action ; si le serveur répond
// 401 step_up_required, on demande le mot de passe puis on retry.

import React, { useEffect, useState } from 'react';

const API_BASE = '/cms/api/users';

type Device = {
  deviceId: string;
  label?: string;
  userAgent?: string;
  ip?: string;
  createdAt: string;
  expiresAt: string;
};

type StepUpModal = {
  open: boolean;
  onSuccess: () => void;
};

export default function AccountSecurityClient({
  initialMethod,
}: {
  initialMethod: 'email' | 'totp';
}): React.ReactElement {
  const [method, setMethod] = useState<'email' | 'totp'>(initialMethod);
  const [devices, setDevices] = useState<Device[]>([]);
  const [enrollChallenge, setEnrollChallenge] = useState<{ secret: string; qrDataUrl: string; otpauthUri: string } | null>(null);
  const [enrollCode, setEnrollCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [stepUp, setStepUp] = useState<StepUpModal>({ open: false, onSuccess: () => {} });
  const [stepUpPassword, setStepUpPassword] = useState('');
  const [stepUpError, setStepUpError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { void loadDevices(); }, []);

  async function loadDevices() {
    try {
      const res = await fetch(`${API_BASE}/me/trusted-devices`, { credentials: 'include' });
      if (res.ok) {
        const data = (await res.json()) as { devices: Device[] };
        setDevices(data.devices);
      }
    } catch {
      // best-effort
    }
  }

  function withStepUp(action: () => Promise<void>) {
    return async () => {
      setError(null);
      setInfo(null);
      try {
        await action();
      } catch (err: unknown) {
        const code = (err as { code?: string }).code;
        if (code === 'step_up_required') {
          setStepUp({ open: true, onSuccess: () => { void action().catch((e) => setError((e as Error).message)); } });
        } else {
          setError(err instanceof Error ? err.message : 'Erreur inconnue');
        }
      }
    };
  }

  async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      ...init,
      headers: { 'content-type': 'application/json', ...(init.headers ?? {}) },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error((data as { error?: string })?.error || `HTTP ${res.status}`);
      (err as { code?: string }).code = (data as { code?: string }).code;
      throw err;
    }
    return data as T;
  }

  async function submitStepUp(e: React.FormEvent) {
    e.preventDefault();
    setStepUpError(null);
    setBusy(true);
    try {
      await api('/me/step-up', { method: 'POST', body: JSON.stringify({ password: stepUpPassword }) });
      setStepUpPassword('');
      setStepUp((s) => ({ ...s, open: false }));
      stepUp.onSuccess();
    } catch (err: unknown) {
      setStepUpError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setBusy(false);
    }
  }

  const enrollTotp = withStepUp(async () => {
    const data = await api<{ secret: string; qrDataUrl: string; otpauthUri: string }>(
      '/me/two-factor/totp/init',
      { method: 'POST' },
    );
    setEnrollChallenge(data);
    setEnrollCode('');
    setBackupCodes(null);
  });

  const confirmTotp = withStepUp(async () => {
    if (!enrollChallenge) return;
    const data = await api<{ ok: boolean; backupCodes: string[] }>(
      '/me/two-factor/totp/confirm',
      { method: 'POST', body: JSON.stringify({ secret: enrollChallenge.secret, code: enrollCode }) },
    );
    setMethod('totp');
    setEnrollChallenge(null);
    setBackupCodes(data.backupCodes);
    setInfo('Application TOTP activée. Conserve les codes de secours dans un endroit sûr — ils ne seront plus affichés.');
  });

  const disableTotp = withStepUp(async () => {
    await api('/me/two-factor/method', { method: 'POST', body: JSON.stringify({ method: 'email' }) });
    setMethod('email');
    setBackupCodes(null);
    setInfo('Méthode 2FA repassée sur email.');
  });

  const regenBackup = withStepUp(async () => {
    const data = await api<{ backupCodes: string[] }>(
      '/me/two-factor/backup-codes/regenerate',
      { method: 'POST' },
    );
    setBackupCodes(data.backupCodes);
    setInfo('Nouveaux codes de secours générés. Note-les, ils ne seront plus affichés.');
  });

  async function revokeDevice(deviceId: string) {
    setError(null);
    try {
      await api(`/me/trusted-devices/${encodeURIComponent(deviceId)}`, { method: 'DELETE' });
      await loadDevices();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  }

  return (
    <div style={{ maxWidth: 720, marginTop: 24 }}>
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>Sécurité du compte</h2>

      {error && (
        <div style={{ padding: 12, marginBottom: 16, background: '#fee', color: '#900', borderRadius: 6, fontSize: 14 }}>
          {error}
        </div>
      )}
      {info && (
        <div style={{ padding: 12, marginBottom: 16, background: '#efe', color: '#060', borderRadius: 6, fontSize: 14 }}>
          {info}
        </div>
      )}

      <section style={{ padding: 16, border: '1px solid #eee', borderRadius: 6, marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, marginBottom: 8 }}>Double authentification (2FA)</h3>
        <p style={{ fontSize: 14, color: '#555', marginBottom: 12 }}>
          Méthode actuelle : <strong>{method === 'totp' ? 'Application TOTP' : 'Code par email'}</strong>
        </p>
        {method === 'email' && !enrollChallenge && (
          <details style={{ fontSize: 14, marginTop: 8 }}>
            <summary style={{ cursor: 'pointer', color: '#555' }}>
              Utiliser une application TOTP à la place
            </summary>
            <p style={{ fontSize: 13, color: '#777', margin: '8px 0 12px' }}>
              Une application (Google Authenticator, Authy, 1Password, Aegis…) génère
              les codes hors-ligne, sans dépendre de ta boîte mail.
            </p>
            <button onClick={enrollTotp} disabled={busy} style={btnSecondary}>
              Configurer TOTP
            </button>
          </details>
        )}
        {method === 'totp' && (
          <button onClick={disableTotp} disabled={busy} style={btnSecondary}>
            Repasser au code par email
          </button>
        )}

        {enrollChallenge && (
          <div style={{ marginTop: 16, padding: 16, background: '#fafafa', borderRadius: 6 }}>
            <p style={{ marginBottom: 12, fontSize: 14 }}>
              1. Scanne ce QR code avec ton application (Google Authenticator, Authy, 1Password, Aegis…) :
            </p>
            <img src={enrollChallenge.qrDataUrl} alt="QR code TOTP" style={{ display: 'block', marginBottom: 12, maxWidth: 200 }} />
            <details style={{ marginBottom: 12, fontSize: 13 }}>
              <summary>Saisie manuelle</summary>
              <code style={{ display: 'block', padding: 8, background: '#fff', marginTop: 4, wordBreak: 'break-all' }}>
                {enrollChallenge.secret}
              </code>
            </details>
            <p style={{ marginBottom: 8, fontSize: 14 }}>2. Entre le code à 6 chiffres généré :</p>
            <input
              type="text"
              inputMode="numeric"
              value={enrollCode}
              onChange={(e) => setEnrollCode(e.target.value)}
              placeholder="123456"
              style={{ padding: '8px 12px', fontSize: 16, textAlign: 'center', border: '1px solid #ccc', borderRadius: 4, marginRight: 8, fontFamily: 'monospace' }}
            />
            <button onClick={confirmTotp} disabled={busy || !enrollCode} style={btnPrimary}>
              Confirmer
            </button>
            <button
              onClick={() => { setEnrollChallenge(null); setEnrollCode(''); }}
              style={{ ...btnSecondary, marginLeft: 8 }}
            >
              Annuler
            </button>
          </div>
        )}
      </section>

      {method === 'totp' && (
        <section style={{ padding: 16, border: '1px solid #eee', borderRadius: 6, marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>Codes de secours</h3>
          <p style={{ fontSize: 14, color: '#555', marginBottom: 12 }}>
            8 codes à usage unique pour te connecter si tu n'as plus accès à ton application TOTP.
          </p>
          {backupCodes && (
            <div style={{ padding: 12, background: '#fafafa', borderRadius: 6, marginBottom: 12 }}>
              <p style={{ fontSize: 13, color: '#900', marginBottom: 8 }}>
                Note ces codes maintenant. Ils ne seront plus jamais affichés.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: 'monospace', fontSize: 14 }}>
                {backupCodes.map((c) => (
                  <li key={c} style={{ padding: '4px 0' }}>{c}</li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={regenBackup} disabled={busy} style={btnSecondary}>
            Régénérer les codes de secours
          </button>
        </section>
      )}

      <section style={{ padding: 16, border: '1px solid #eee', borderRadius: 6 }}>
        <h3 style={{ fontSize: 16, marginBottom: 8 }}>Appareils de confiance</h3>
        <p style={{ fontSize: 14, color: '#555', marginBottom: 12 }}>
          Ces appareils ne te demandent pas de code à la connexion (validité 7 jours).
        </p>
        {devices.length === 0 && <p style={{ fontSize: 14, color: '#888' }}>Aucun appareil de confiance.</p>}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {devices.map((d) => (
            <li key={d.deviceId} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 14 }}>
                <div style={{ fontWeight: 600 }}>{d.label ?? 'Appareil inconnu'}</div>
                <div style={{ color: '#888', fontSize: 12 }}>
                  {d.ip ? `IP ${d.ip} · ` : ''}
                  Ajouté le {new Date(d.createdAt).toLocaleString('fr-FR')} · expire le {new Date(d.expiresAt).toLocaleString('fr-FR')}
                </div>
              </div>
              <button onClick={() => void revokeDevice(d.deviceId)} style={{ ...btnSecondary, padding: '4px 12px', fontSize: 13 }}>
                Révoquer
              </button>
            </li>
          ))}
        </ul>
      </section>

      {stepUp.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={submitStepUp} style={{ background: '#fff', padding: 24, borderRadius: 8, maxWidth: 360, width: '90%' }}>
            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Confirme ton identité</h3>
            <p style={{ fontSize: 14, color: '#555', marginBottom: 12 }}>
              Re-saisis ton mot de passe pour effectuer cette action sensible.
            </p>
            {stepUpError && (
              <div style={{ padding: 8, marginBottom: 12, background: '#fee', color: '#900', borderRadius: 4, fontSize: 13 }}>
                {stepUpError}
              </div>
            )}
            <input
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              value={stepUpPassword}
              onChange={(e) => setStepUpPassword(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, marginBottom: 12 }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => { setStepUp({ open: false, onSuccess: () => {} }); setStepUpPassword(''); setStepUpError(null); }}
                style={btnSecondary}
              >
                Annuler
              </button>
              <button type="submit" disabled={busy} style={btnPrimary}>
                {busy ? 'Vérification…' : 'Continuer'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  padding: '8px 16px',
  background: '#695EA3',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};
const btnSecondary: React.CSSProperties = {
  padding: '8px 16px',
  background: 'transparent',
  color: '#333',
  border: '1px solid #ccc',
  borderRadius: 4,
  fontSize: 14,
  cursor: 'pointer',
};
