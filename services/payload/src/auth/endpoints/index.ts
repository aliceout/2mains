import type { Endpoint } from 'payload';

import { invitationEndpoints } from './invitations';
import { profileEndpoints } from './profile';
import { twoFactorLoginEndpoints } from './two-factor';

// Tous les endpoints custom branchés sous le slug `users` (donc accessibles
// sous /cms/api/users/...).
export const authEndpoints: Endpoint[] = [
  ...invitationEndpoints,
  ...twoFactorLoginEndpoints,
  ...profileEndpoints,
];
