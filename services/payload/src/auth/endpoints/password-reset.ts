import type { Endpoint } from 'payload';

import { errorResponse, jsonResponse, readJsonBody, requireUser } from '../helpers';
import { clientIpFromHeaders, consume, RATE_PROFILES } from '../rate-limit';

// ─── POST /users/send-password-reset ──────────────────────────────
//
// Déclenche l'envoi d'un mail « mot de passe oublié » vers un AUTRE
// compte, à la demande d'un admin/root.
//
// Pourquoi cet endpoint plutôt qu'un champ mot de passe : personne ne
// peut poser le mot de passe de quelqu'un d'autre (hook beforeChange
// dans collections/Users.ts, volontairement sans exemption root). Le
// seul chemin légitime est donc le flow natif de Payload, qui génère un
// token de reset et envoie le lien à la personne concernée — elle seule
// choisit son mot de passe.
//
// On réutilise `payload.forgotPassword` pour ne pas dupliquer la
// génération de token ni le template de mail (cf. auth.forgotPassword
// dans Users.ts, qui construit l'URL /cms/admin/reset/<token>).

const sendPasswordResetEndpoint: Endpoint = {
  path: '/send-password-reset',
  method: 'post',
  handler: async (req) => {
    const actor = requireUser(req);
    if (!actor || (actor.role !== 'admin' && actor.role !== 'root')) {
      return errorResponse('Non autorisé', 403);
    }

    // Même profil de rate limit que les autres envois de mail.
    const ip = clientIpFromHeaders(req.headers);
    const rl = consume(RATE_PROFILES.send, `${actor.id}:${ip}`);
    if (!rl.ok) {
      return errorResponse(
        'Trop de demandes d\'envoi, réessayez dans quelques minutes.',
        429,
      );
    }

    const body = await readJsonBody<{ id?: number | string }>(req);
    const id = body?.id;
    if (id === undefined || id === null || id === '') {
      return errorResponse('Identifiant de compte manquant', 400);
    }

    // Son propre mot de passe se change depuis son profil (bouton natif
    // « Change Password »), pas par mail.
    if (String(id) === String(actor.id)) {
      return errorResponse(
        'Pour ton propre mot de passe, utilise « Change Password » sur ton profil.',
        400,
      );
    }

    let target: { email?: string; status?: string } | null = null;
    try {
      target = (await req.payload.findByID({
        collection: 'users',
        id,
        req,
        depth: 0,
        overrideAccess: true,
      })) as { email?: string; status?: string };
    } catch {
      return errorResponse('Compte introuvable', 404);
    }

    if (!target?.email) return errorResponse('Ce compte n\'a pas d\'email', 400);
    // Un compte encore en attente n'a jamais choisi de mot de passe : le
    // bon geste est de renvoyer l'invitation, pas un lien de reset.
    if (target.status === 'pending') {
      return errorResponse(
        'Ce compte n\'a pas encore accepté son invitation — renvoie-lui plutôt une invitation.',
        409,
      );
    }
    if (target.status === 'disabled') {
      return errorResponse('Ce compte est désactivé.', 409);
    }

    await req.payload.forgotPassword({
      collection: 'users',
      data: { email: target.email },
      req,
    });

    return jsonResponse({ ok: true, email: target.email });
  },
};

export const passwordResetEndpoints: Endpoint[] = [sendPasswordResetEndpoint];
