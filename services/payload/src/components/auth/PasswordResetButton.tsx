// Bloc « Mot de passe » affiché sur le profil de QUELQU'UN D'AUTRE, via un
// field type:'ui' sur la collection users (cf. la condition du field dans
// Users.ts : visible seulement si le doc édité n'est pas soi-même).
//
// Il remplace le bouton natif « Change Password » de Payload, qui ne pouvait
// que échouer ici : un hook beforeChange interdit à quiconque — root inclus —
// de poser le mot de passe d'un autre compte.

import React from 'react';
import type { ServerProps } from 'payload';

import PasswordResetButtonClient from './PasswordResetButton.client';

export default function PasswordResetButton(
  props: ServerProps,
): React.ReactElement | null {
  if (!props.user) return null;
  return <PasswordResetButtonClient />;
}
