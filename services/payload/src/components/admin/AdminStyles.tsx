// Injection CSS globale dans l'admin Payload.
//
// Payload 3.84 n'expose pas de champ `admin.css` direct. On contourne
// en rendant un <style> tag depuis un composant inséré dans le slot
// `admin.components.actions` (le slot accepte des composants serveur
// qui rendent ce qu'ils veulent, y compris des balises invisibles).
//
// Règles actuelles :
//   - .doc-tabs : masque les onglets "Edit / API" en haut à droite
//     de chaque vue d'édition (collections + globals). On ne veut pas
//     exposer la vue API JSON brut à l'autrice.

import React from 'react';

const ADMIN_CSS = `
.doc-tabs {
  display: none !important;
}
`;

export default function AdminStyles(): React.ReactElement {
  return <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS }} />;
}
