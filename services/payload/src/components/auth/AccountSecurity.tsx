// Server component injecté en `admin.components.Nav` ou comme custom view.
// On le branche comme afterDashboard du compte (cf payload.config) pour
// qu'il s'affiche sous le formulaire de profil natif.

import React from 'react';
import type { ServerProps } from 'payload';

import AccountSecurityClient from './AccountSecurity.client';

export default function AccountSecurity(props: ServerProps): React.ReactElement | null {
  const user = props.user as
    | { twoFactorMethod?: 'email' | 'totp' }
    | null
    | undefined;
  if (!user) return null;
  const method = user.twoFactorMethod ?? 'email';
  return <AccountSecurityClient initialMethod={method} />;
}
