'use client';

// Bouton "Inviter un utilisateur" affiché en haut de la liste users.
// Ouvre une modale avec email + rôle.

import React, { useState } from 'react';

const API_BASE = '/cms/api/users';

export default function InviteUserButton({ canInviteAdmin }: { canInviteAdmin: boolean }): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'editor' | 'admin'>('editor');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/invite`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, role, displayName: displayName || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { error?: string })?.error || 'Invitation impossible');
      setDone(`Invitation envoyée à ${email}.`);
      setEmail('');
      setDisplayName('');
      setRole('editor');
      setTimeout(() => {
        setOpen(false);
        setDone(null);
        // Rafraîchit la liste users pour montrer la nouvelle entrée pending.
        window.location.reload();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          padding: '8px 16px',
          background: '#695EA3',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: 16,
        }}
      >
        Inviter un·e utilisateur·ice
      </button>

      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={submit} style={{ background: '#fff', padding: 24, borderRadius: 8, maxWidth: 420, width: '90%' }}>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Inviter un nouvel utilisateur</h3>
            {error && (
              <div style={{ padding: 8, marginBottom: 12, background: '#fee', color: '#900', borderRadius: 4, fontSize: 13 }}>
                {error}
              </div>
            )}
            {done && (
              <div style={{ padding: 8, marginBottom: 12, background: '#efe', color: '#060', borderRadius: 4, fontSize: 13 }}>
                {done}
              </div>
            )}
            <div style={{ marginBottom: 12 }}>
              <label htmlFor="invite-email" style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>Email</label>
              <input
                id="invite-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label htmlFor="invite-name" style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>Nom affiché (optionnel)</label>
              <input
                id="invite-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="invite-role" style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>Rôle</label>
              <select
                id="invite-role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'editor' | 'admin')}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4 }}
              >
                <option value="editor">Éditeur·ice (édite le contenu)</option>
                {canInviteAdmin && (
                  <option value="admin">Admin (peut aussi gérer les comptes)</option>
                )}
              </select>
              <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                Un mail d'invitation sera envoyé. Lien valable 7 jours.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => { setOpen(false); setError(null); setDone(null); }} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer' }}>
                Annuler
              </button>
              <button type="submit" disabled={submitting} style={{ padding: '8px 16px', background: '#695EA3', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}>
                {submitting ? 'Envoi…' : 'Envoyer l\'invitation'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
