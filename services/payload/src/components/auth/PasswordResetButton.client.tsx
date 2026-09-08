'use client';

// Voir PasswordResetButton.tsx pour le pourquoi de ce bloc.
//
// Deux responsabilités :
//  1. Masquer le bouton natif « Change Password » de Payload. Il est ciblé
//     par son id (#change-password, cf. @payloadcms/ui views/Edit/Auth), pas
//     par une classe utilitaire — c'est stable. Le <style> n'est monté que
//     par ce composant, qui n'est lui-même rendu que sur le profil d'autrui :
//     sur son propre profil le bouton natif reste donc disponible.
//  2. Proposer à la place l'envoi d'un lien de réinitialisation, en deux
//     temps pour éviter d'expédier un mail par inadvertance.

import React, { useState } from 'react';
import { Button, useDocumentInfo } from '@payloadcms/ui';

import { stack } from './styles';

const API_BASE = '/cms/api/users';

// `!important` : les boutons Payload portent leurs propres règles d'affichage.
const HIDE_NATIVE_CSS = `
#change-password,
#cancel-change-password,
.auth-fields__changing-password {
  display: none !important;
}
`;

export default function PasswordResetButtonClient(): React.ReactElement {
  const { id } = useDocumentInfo();
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function send() {
    setError(null);
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/send-password-reset`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        email?: string;
      };
      if (!res.ok) throw new Error(data?.error || 'Envoi impossible');
      setDone(
        data.email
          ? `Lien de réinitialisation envoyé à ${data.email}.`
          : 'Lien de réinitialisation envoyé.',
      );
      setConfirming(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ ...stack, marginBottom: 'var(--base)' }}>
      <style dangerouslySetInnerHTML={{ __html: HIDE_NATIVE_CSS }} />

      <div>
        <h4 style={{ margin: '0 0 calc(var(--base) / 4)' }}>Mot de passe</h4>
        <p style={{ margin: 0, color: 'var(--theme-elevation-600)' }}>
          Personne ne peut définir le mot de passe d&apos;un autre compte. Pour
          dépanner cette personne, envoie-lui un lien de réinitialisation :
          elle choisira elle-même son nouveau mot de passe.
        </p>
      </div>

      {done ? (
        <p style={{ margin: 0, color: 'var(--theme-success-500)' }}>{done}</p>
      ) : confirming ? (
        <div style={{ display: 'flex', gap: 'calc(var(--base) / 2)', flexWrap: 'wrap' }}>
          <Button
            buttonStyle="primary"
            disabled={sending}
            onClick={send}
            size="medium"
          >
            {sending ? 'Envoi…' : 'Confirmer l’envoi'}
          </Button>
          <Button
            buttonStyle="secondary"
            disabled={sending}
            onClick={() => setConfirming(false)}
            size="medium"
          >
            Annuler
          </Button>
        </div>
      ) : (
        <div>
          <Button
            buttonStyle="secondary"
            disabled={!id}
            onClick={() => {
              setError(null);
              setConfirming(true);
            }}
            size="medium"
          >
            Envoyer un lien de réinitialisation
          </Button>
        </div>
      )}

      {error && (
        <p style={{ margin: 0, color: 'var(--theme-error-500)' }}>{error}</p>
      )}
    </div>
  );
}
