// Affiche le SHA Git du commit déployé dans le formulaire du global
// Site (/cms/admin → Paramètres du site). Permet de vérifier d'un coup
// d'œil que la version en prod matche la dernière sur main.
//
// GIT_SHA est injecté en build-arg par le workflow CI dans le Dockerfile
// Payload. En dev local, process.env.GIT_SHA est undefined → on affiche
// "dev" (cohérent avec le Footer du site).

import React from 'react';

const REPO_URL = 'https://github.com/aliceout/2mains';

export default function CommitInfo(): React.ReactElement {
  const sha = process.env.GIT_SHA ?? '';
  const shortSha = sha ? sha.slice(0, 7) : 'dev';
  const commitUrl = sha ? `${REPO_URL}/commit/${sha}` : null;

  return (
    <div style={{ marginTop: '0.5rem', padding: '0.75rem 1rem', background: 'var(--theme-elevation-50)', borderRadius: '4px', fontSize: '0.875rem' }}>
      <strong style={{ display: 'block', marginBottom: '0.25rem' }}>
        Version déployée
      </strong>
      <code style={{ fontFamily: 'var(--font-mono)' }}>
        {commitUrl ? (
          <a href={commitUrl} target="_blank" rel="noopener noreferrer">
            {shortSha}
          </a>
        ) : (
          shortSha
        )}
      </code>
      <span style={{ marginLeft: '0.75rem', color: 'var(--theme-text-muted)', fontSize: '0.8125rem' }}>
        SHA du commit Git baké dans l&rsquo;image Docker en cours.
      </span>
    </div>
  );
}
