'use client';

// Page d'acceptation d'invitation : `/cms/admin/invitation/[token]`.
// Récupère le token dans l'URL, demande le mot de passe, l'envoie au
// backend pour activer le compte.

import React, { useEffect, useState } from 'react';

const API_BASE = '/cms/api/users';
const ADMIN_BASE = '/cms/admin';

export default function InvitationAcceptViewClient({ token }: { token: string }): React.ReactElement {
  const [status, setStatus] = useState<'loading' | 'ready' | 'invalid' | 'expired'>('loading');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/invitation/${encodeURIComponent(token)}`);
        if (cancelled) return;
        if (res.status === 410) return setStatus('expired');
        if (!res.ok) return setStatus('invalid');
        const data = (await res.json()) as { email?: string };
        if (!data.email) return setStatus('invalid');
        setEmail(data.email);
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('invalid');
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 12) return setError('Le mot de passe doit faire au moins 12 caractères.');
    if (password !== confirm) return setError('Les mots de passe ne correspondent pas.');
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/invitation/${encodeURIComponent(token)}/accept`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { error?: string })?.error || 'Activation impossible');
      window.location.href = ADMIN_BASE;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  }

  if (status === 'loading') return <p style={{ textAlign: 'center', marginTop: 64 }}>Chargement…</p>;
  if (status === 'invalid') {
    return (
      <div style={{ maxWidth: 400, margin: '64px auto', padding: '0 16px' }}>
        <h1 style={{ fontSize: 22, marginBottom: 16 }}>Invitation introuvable</h1>
        <p>Ce lien d'invitation est invalide ou a déjà été utilisé. Demande à un administrateur de te renvoyer une invitation.</p>
      </div>
    );
  }
  if (status === 'expired') {
    return (
      <div style={{ maxWidth: 400, margin: '64px auto', padding: '0 16px' }}>
        <h1 style={{ fontSize: 22, marginBottom: 16 }}>Invitation expirée</h1>
        <p>Le délai pour activer ce compte a expiré. Demande à un administrateur de t'inviter à nouveau.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '64px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Activer ton compte</h1>
      <p style={{ marginBottom: 24, fontSize: 14, color: '#555' }}>
        Compte : <strong>{email}</strong>
      </p>
      {error && (
        <div style={{ padding: 12, marginBottom: 16, background: '#fee', color: '#900', borderRadius: 6, fontSize: 14 }}>
          {error}
        </div>
      )}
      <form onSubmit={submit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="invite-pw" style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Mot de passe (min. 12 caractères)</label>
          <input
            id="invite-pw"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="invite-pw2" style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Confirmer le mot de passe</label>
          <input
            id="invite-pw2"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14 }}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          style={{ width: '100%', padding: '10px 16px', background: '#EC6A2C', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          {submitting ? 'Activation…' : 'Activer mon compte'}
        </button>
      </form>
    </div>
  );
}
