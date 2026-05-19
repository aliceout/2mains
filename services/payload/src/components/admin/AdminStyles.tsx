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
//   - .field-type.rich-text-lexical : encadre le bloc éditeur Lexical
//     (toolbar + content) pour qu'on voie clairement la zone de texte,
//     et masque le "+" et le drag-handle inline qui apparaissent en
//     marge de chaque ligne — Audrey n'utilise pas ces affordances
//     bizarres, la fixed-toolbar suffit.

import React from 'react';

const ADMIN_CSS = `
.doc-tabs {
  display: none !important;
}

/* Encadre la zone éditeur Lexical (toolbar + contenu). */
.field-type.rich-text-lexical .editor-container {
  border: 1px solid var(--theme-elevation-150);
  border-radius: 4px;
  background: var(--theme-input-bg);
}

/* Masque les affordances "+/drag" de Lexical qui perturbent les
   rédactrices non-tech : "+" inline en marge gauche, drag-handle,
   et la barre grise "insert-paragraph-at-end" en bas du content area. */
.field-type.rich-text-lexical .add-block-menu,
.field-type.rich-text-lexical .draggable-block-menu,
.field-type.rich-text-lexical .insert-paragraph-at-end,
.field-type.rich-text-lexical .insert-paragraph-at-end-inside,
.field-type.rich-text-lexical .LexicalEditorTheme__placeholder {
  display: none !important;
}

/* Aligne la typo/interligne de l'éditeur Lexical sur le textarea Payload
   (font-body sans-serif, font-size 1rem, line-height 20px, padding 8px 15px).
   Par défaut Lexical force font-serif + font-size 16px + letter-spacing .02em
   sur .editor-container, et le ContentEditable a padding-top généreux +
   padding-left 3rem — d'où l'écart visuel avec le textarea juste en-dessous. */
.field-type.rich-text-lexical .editor-container {
  font-family: var(--font-body);
  font-size: 1rem;
  letter-spacing: normal;
}
.field-type.rich-text-lexical .ContentEditable__root {
  padding: 8px 15px !important;
  line-height: 20px;
}
.field-type.rich-text-lexical .LexicalEditorTheme__paragraph,
.field-type.rich-text-lexical .LexicalEditorTheme__listItem {
  font-size: 1rem;
  line-height: 20px;
  margin-bottom: 0;
}
/* Headings : on garde une hiérarchie visible, mais resserrée par
   rapport au défaut Lexical (28/25/22px) qui détonne avec le reste
   du formulaire. */
.field-type.rich-text-lexical .LexicalEditorTheme__h2 {
  font-size: 1.25rem;
  line-height: 1.3;
  margin-block: .5em .2em;
}
.field-type.rich-text-lexical .LexicalEditorTheme__h3 {
  font-size: 1.1rem;
  line-height: 1.3;
  margin-block: .5em .2em;
}
`;

export default function AdminStyles(): React.ReactElement {
  return <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS }} />;
}
