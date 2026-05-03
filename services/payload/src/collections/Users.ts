import type { CollectionConfig, FieldHook } from 'payload';

import { canMutateRole, isAdminOrRoot, isSelfOrAdmin, userRole } from '../access/roles';
import { AUTH_CONFIG } from '../auth/config';

// Collection users — étendue pour supporter :
//  - rôles (root unique / admin / editor)
//  - workflow d'invitation par mail (token 7 jours, suppression auto si expiré)
//  - 2FA email par défaut, TOTP en option
//  - 8 backup codes
//  - sessions glissantes 48h (auth.tokenExpiration côté Payload)
//  - trusted devices 7 jours
//
// Tous les champs sensibles (hash de tokens, secret TOTP chiffré, codes
// backup hachés) sont :
//   - admin.hidden  → cachés dans l'UI Payload, on a notre propre vue
//   - access.read   → admin/root only (pas exposés via REST aux editor)
//   - access.update → false (mutés uniquement via les endpoints custom)
//
// Le compte root est protégé par hooks (cf bottom).

const lockRoleField: FieldHook = ({ value, originalDoc, req, operation }) => {
  // À la création (invitation) le rôle est donné par l'inviteur.
  if (operation === 'create') return value;
  // En update : seul le root peut modifier le rôle d'un admin.
  // Personne ne peut modifier le rôle du root (verrouillage hors collection).
  if (originalDoc?.role === 'root') return 'root';
  if (originalDoc?.role === 'admin' && userRole(req) !== 'root') {
    return originalDoc.role;
  }
  return value;
};

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utilisateur', plural: 'Utilisateurs' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'displayName', 'role', 'status', 'twoFactorMethod', 'updatedAt'],
    listSearchableFields: ['email', 'displayName'],
  },
  auth: {
    // Sliding 48h : Payload prolonge le cookie à chaque requête authentifiée
    // (renvoyée via Set-Cookie) tant que tokenExpiration n'est pas atteint.
    // Cf. payload.config admin.cookies.
    tokenExpiration: AUTH_CONFIG.sessionInactiveHours * 60 * 60,
    // verify: false → on gère nous-mêmes la vérif via le workflow
    // d'invitation (le user choisit son mdp en cliquant sur le lien).
    verify: false,
    // maxLoginAttempts + lockTime : protection brute force native Payload,
    // complémentaire au rate-limit applicatif.
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 min
  },
  access: {
    // Lister/lire les users : admin et root.
    // Un editor peut lire son propre profil (fait via /me, pas /users).
    read: ({ req }) => {
      const role = userRole(req);
      if (role === 'admin' || role === 'root') return true;
      if (req.user) return { id: { equals: req.user.id } };
      return false;
    },
    // Création directe interdite — passage obligatoire par l'endpoint
    // /users/invite (qui génère un token et envoie le mail).
    // Exception : le bootstrap du premier user (register-first-user)
    // reste ouvert, géré par Payload nativement.
    create: () => false,
    // Update : admin/root sur d'autres users, ou self sur soi-même.
    // Les champs sensibles sont protégés au niveau field.
    update: ({ req, id }) => {
      const role = userRole(req);
      if (role === 'admin' || role === 'root') return true;
      if (req.user && id === req.user.id) return true;
      return false;
    },
    // Delete : admin/root uniquement, jamais sur le root (hook).
    delete: isAdminOrRoot,
    // Permettre à l'utilisateur de voir les boutons admin de sa propre
    // page profil (sinon l'admin Payload masque tout).
    admin: ({ req }) => Boolean(req.user),
    unlock: isAdminOrRoot,
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      label: 'Nom affiché',
      required: false,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Root', value: 'root' },
        { label: 'Admin', value: 'admin' },
        { label: 'Éditeur·ice', value: 'editor' },
      ],
      access: {
        update: canMutateRole,
      },
      hooks: {
        beforeChange: [lockRoleField],
      },
      admin: {
        description: 'Root = compte propriétaire (1 seul, non supprimable). Admin = peut gérer les comptes. Éditeur·ice = édite le contenu.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'En attente d\'activation', value: 'pending' },
        { label: 'Actif', value: 'active' },
        { label: 'Désactivé', value: 'disabled' },
      ],
      access: { update: ({ req }) => userRole(req) === 'admin' || userRole(req) === 'root' },
      admin: { position: 'sidebar' },
    },

    // ─── Invitation (workflow d'activation) ──────────────────────────
    {
      name: 'invitation',
      type: 'group',
      admin: { hidden: true },
      access: {
        read: isSelfOrAdmin,
        update: () => false,
      },
      fields: [
        { name: 'tokenHash', type: 'text', index: true },
        { name: 'expiresAt', type: 'date' },
        { name: 'invitedBy', type: 'relationship', relationTo: 'users' },
        { name: 'invitedAt', type: 'date' },
      ],
    },

    // ─── 2FA ─────────────────────────────────────────────────────────
    {
      name: 'twoFactorMethod',
      type: 'select',
      required: true,
      defaultValue: 'email',
      options: [
        { label: 'Code par email', value: 'email' },
        { label: 'Application TOTP (Google Authenticator, Authy…)', value: 'totp' },
      ],
      access: { update: () => false }, // muté via endpoint /two-factor/method
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'twoFactor',
      type: 'group',
      admin: { hidden: true },
      access: {
        read: isSelfOrAdmin,
        update: () => false,
      },
      fields: [
        // TOTP enrôlé : secret AES-256-GCM
        { name: 'totpSecret', type: 'text' },
        { name: 'totpEnrolledAt', type: 'date' },
        // Email OTP en attente
        { name: 'emailCodeHash', type: 'text' },
        { name: 'emailCodeExpiresAt', type: 'date' },
        { name: 'emailCodeAttempts', type: 'number', defaultValue: 0 },
        // Backup codes (codes hachés à usage unique)
        {
          name: 'backupCodeHashes',
          type: 'array',
          fields: [{ name: 'hash', type: 'text', required: true }],
        },
        { name: 'backupCodesGeneratedAt', type: 'date' },
      ],
    },

    // ─── Sessions / activité ─────────────────────────────────────────
    {
      name: 'lastActivityAt',
      type: 'date',
      access: { read: isSelfOrAdmin, update: () => false },
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'lastLoginAt',
      type: 'date',
      access: { read: isSelfOrAdmin, update: () => false },
      admin: { readOnly: true, position: 'sidebar' },
    },

    // ─── Trusted devices (post-OTP, 7 jours) ─────────────────────────
    {
      name: 'trustedDevices',
      type: 'array',
      access: { read: isSelfOrAdmin, update: () => false },
      admin: { hidden: true },
      fields: [
        { name: 'deviceId', type: 'text', required: true },
        { name: 'fingerprintHash', type: 'text', required: true },
        { name: 'label', type: 'text' },
        { name: 'userAgent', type: 'text' },
        { name: 'ip', type: 'text' },
        { name: 'createdAt', type: 'date', required: true },
        { name: 'expiresAt', type: 'date', required: true },
      ],
    },
  ],

  hooks: {
    // Garde l'unicité du root et empêche sa suppression / rétrogradation.
    beforeChange: [
      async ({ data, originalDoc, operation, req }) => {
        if (operation === 'create' && data?.role === 'root') {
          // Création d'un root : autorisée uniquement s'il n'en existe pas
          // déjà un (cas du bootstrap initial via register-first-user).
          const existingRoot = await req.payload.find({
            collection: 'users',
            where: { role: { equals: 'root' } },
            limit: 1,
            req,
          });
          if (existingRoot.totalDocs > 0) {
            throw new Error('Un compte root existe déjà.');
          }
        }
        // Empêche un changement implicite role=root via update.
        if (operation === 'update' && data?.role === 'root' && originalDoc?.role !== 'root') {
          throw new Error('Le rôle root ne peut pas être attribué via mise à jour.');
        }
        return data;
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        const target = await req.payload.findByID({
          collection: 'users',
          id,
          req,
          depth: 0,
          overrideAccess: true,
        });
        if ((target as { role?: string }).role === 'root') {
          throw new Error('Le compte root ne peut pas être supprimé.');
        }
      },
    ],
  },
};
