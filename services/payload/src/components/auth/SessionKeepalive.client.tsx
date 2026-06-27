'use client';

// Composant invisible : pingue /me/touch toutes les 5 minutes, mais
// uniquement si l'utilisatrice a réellement interagi (souris/clavier)
// depuis le dernier tick. Tant qu'elle travaille, la session glisse ;
// onglet laissé ouvert sans rien toucher → plus de ping → la session
// expire après SESSION_INACTIVE_HOURS (cf. auth/config + cleanup serveur).

import { useEffect } from 'react';

const PING_INTERVAL_MS = 5 * 60 * 1000;
// Événements qui comptent comme "activité réelle". passive: true → zéro
// impact perf (on ne fait que lever un booléen).
const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'pointermove', 'scroll'] as const;

export default function SessionKeepalive(): null {
  useEffect(() => {
    let cancelled = false;
    // Armé au montage (le chargement de page = activité), réarmé à chaque
    // interaction, désarmé après chaque ping envoyé.
    let active = true;
    function markActive() {
      active = true;
    }
    function ping() {
      if (cancelled || document.hidden || !active) return;
      active = false;
      void fetch('/cms/api/users/me/touch', {
        method: 'POST',
        credentials: 'include',
      }).catch(() => { /* silencieux */ });
    }
    ACTIVITY_EVENTS.forEach((e) =>
      document.addEventListener(e, markActive, { passive: true }),
    );
    ping();
    const handle = setInterval(ping, PING_INTERVAL_MS);
    function onVisibility() {
      if (!document.hidden) ping();
    }
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelled = true;
      clearInterval(handle);
      document.removeEventListener('visibilitychange', onVisibility);
      ACTIVITY_EVENTS.forEach((e) => document.removeEventListener(e, markActive));
    };
  }, []);
  return null;
}
