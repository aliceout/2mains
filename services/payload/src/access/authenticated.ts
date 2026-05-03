import type { Access } from 'payload';

import { isEditorOrAbove } from './roles';

/**
 * Helper d'access control historique : autorise toute requête authentifiée
 * dont l'utilisateur a un rôle d'édition (editor, admin, root).
 *
 * Réexporté pour compatibilité avec les collections de contenu existantes
 * (Pages, Actualites, Médias, etc.) — tout compte authentifié dans le
 * système a au moins le rôle `editor`, donc la sémantique est conservée.
 *
 * En théorie c'est le default Payload pour les collections sans `access`
 * explicite, mais on l'a vu en prod 3.84 : sans déclaration explicite des
 * verbs (create/update/delete), des PATCH renvoient 403 avec « You are
 * not allowed to perform this action ». Mieux vaut être explicite.
 */
export const authenticated: Access = isEditorOrAbove;
