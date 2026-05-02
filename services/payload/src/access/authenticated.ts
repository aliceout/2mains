import type { Access } from 'payload'

/**
 * Helper d'access control : autorise toute requête authentifiée.
 *
 * En théorie c'est le default Payload pour les collections sans
 * `access` explicite, mais on l'a vu en prod 3.84 : sans déclaration
 * explicite des verbs (create/update/delete), des PATCH renvoient 403
 * avec « You are not allowed to perform this action ». Mieux vaut
 * être explicite.
 */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)
