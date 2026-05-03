'use client';

// Vue de login custom : remplace le formulaire natif Payload pour
// orchestrer le flux email/mdp → 2FA → admin.
//
// On reste sur les classes CSS Payload (form, btn, input) pour héritier
// du theming admin. Pas de style custom, on s'intègre.

import React, { useState } from 'react';

type Step = 'credentials' | 'two-factor';

const ADMIN_BASE = '/cms/admin';
const API_BASE = '/cms/api/users';

export default function LoginView(): React.ReactElement {
  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [method, setMethod] = useState<'email' | 'totp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function submitCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login-2fa`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { error?: string })?.error || 'Erreur de connexion');
      if ((data as { status?: string }).status === 'logged_in') {
        window.location.href = ADMIN_BASE;
        return;
      }
      if ((data as { status?: string }).status === 'needs_two_factor') {
        const m = ((data as { method?: string }).method ?? 'email') as 'email' | 'totp';
        setMethod(m);
        setStep('two-factor');
        setInfo(
          m === 'email'
            ? 'Un code à 6 chiffres vient d\'être envoyé à ton adresse mail.'
            : 'Saisis le code de ton application TOTP (Google Authenticator, Authy…).',
        );
      } else {
        throw new Error('Réponse inattendue du serveur');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  async function submitTwoFactor(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/two-factor/verify`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code, rememberDevice }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { error?: string })?.error || 'Code invalide');
      window.location.href = ADMIN_BASE;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/two-factor/resend-email`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { error?: string })?.error || 'Renvoi impossible');
      setInfo('Nouveau code envoyé.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '64px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>Connexion</h1>
      {error && (
        <div style={{ padding: 12, marginBottom: 16, background: '#fee', color: '#900', borderRadius: 6, fontSize: 14 }}>
          {error}
        </div>
      )}
      {info && !error && (
        <div style={{ padding: 12, marginBottom: 16, background: '#eef5ff', color: '#114', borderRadius: 6, fontSize: 14 }}>
          {info}
        </div>
      )}
      {step === 'credentials' && (
        <form onSubmit={submitCredentials}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="login-email" style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14 }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="login-password" style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Mot de passe</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14 }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '10px 16px', background: '#695EA3', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      )}
      {step === 'two-factor' && (
        <form onSubmit={submitTwoFactor}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="login-code" style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>
              {method === 'totp' ? 'Code de l\'application' : 'Code reçu par email'}
            </label>
            <input
              id="login-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6 chiffres ou code de secours"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 18, textAlign: 'center', fontFamily: 'monospace' }}
            />
            <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              Tu peux aussi utiliser un code de secours (format XXXX-XXXX).
            </p>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 14 }}>
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
            />
            Faire confiance à cet appareil pendant 7 jours
          </label>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '10px 16px', background: '#695EA3', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}
          >
            {loading ? 'Vérification…' : 'Valider'}
          </button>
          {method === 'email' && (
            <button
              type="button"
              onClick={resendCode}
              disabled={loading}
              style={{ width: '100%', padding: '8px 16px', background: 'transparent', color: '#666', border: '1px solid #ccc', borderRadius: 4, fontSize: 13, cursor: 'pointer' }}
            >
              Renvoyer le code
            </button>
          )}
        </form>
      )}
    </div>
  );
}
