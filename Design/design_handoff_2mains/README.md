# Handoff — 2mains de femmes (refonte site associatif)

## Overview

Site institutionnel pour **2mains de femmes**, association lyonnaise (loi 1901) qui lutte contre l'isolement corporel des femmes par le **toucher relationnel**. Le site doit accueillir trois publics — femmes accompagnées, structures partenaires (EHPAD, foyers, associations, hôpitaux), et entreprises mécènes — et exprimer une posture éditoriale **chaleureuse, manuelle, sérieuse, sans pathos**.

Le ton de marque évite à la fois :
- le langage médico-clinique (« soin », « patient·e », « protocole »)
- l'esthétique ONG triste (photos noir & blanc, gris institutionnel)
- les tropes startup-bien-être (gradients, emoji, formes parfaites)

L'identité s'appuie sur une **palette élargie chaude** (terracotta, pêche, rose terreux, lavande, miel, vert mousse), une **typo éditoriale** (serif italique pour les accents, sans pour le texte courant, mono pour les méta-infos), et des **formes organiques dessinées à main levée** (blobs SVG, soulignés manuscrits) qui évoquent la **présence d'une main**, métaphore centrale de l'asso.

## About the Design Files

Les fichiers de ce dossier sont des **références de design** — des prototypes HTML/JSX (React 18 via Babel standalone) qui montrent l'intention visuelle et le comportement attendu. **Ce ne sont pas des fichiers de production à copier tels quels.**

La tâche est de **recréer ces designs dans l'environnement cible** (Next.js, Astro, Nuxt, WordPress + Tailwind, ou autre — selon le choix de la stack), en utilisant ses patterns établis (système de composants, design tokens, routing, gestion d'images, etc.). Si aucun codebase n'existe encore, recommander **Next.js 15 + Tailwind + Framer Motion** ou **Astro + Tailwind** comme cible appropriée pour un site éditorial 5–10 pages.

Un thème actuel est en place dans le projet d'origine — **la mission ici est de modifier ce thème pour qu'il reflète fidèlement les designs présentés**, en transposant tokens, typographie, composants et page templates.

## Fidelity

**High-fidelity (hifi).** Les couleurs, tailles de typo, espacements, rayons de bordure, ombres, comportements interactifs sont définitifs. Les seules approximations à finaliser :
- Les **photos** sont absentes (volontairement — l'asso doit produire une photographie sur mesure ; en attendant, prévoir des placeholders organiques).
- Les **icônes** sont quasi-absentes (l'identité repose sur la typo et les formes, pas sur l'iconographie). Quand des chevrons ou plus/moins sont nécessaires, ils sont dessinés inline en SVG (voir `Arrow`, `Plus` dans `final-home.jsx`).
- Les **chiffres** (impact, partenaires) sont des valeurs représentatives — à confirmer avec le client avant publication.

## Pages livrées (5)

Toutes les pages sont accessibles via la nav du haut dans `final-vivant-v2.html`.

### 1. Accueil — `HomePageVivantV2` (dans `final-vivant-v2.jsx`)
Page d'entrée vivante, organique, avec hero typographique grand format.
**Sections** : Hero · Nos actions · L'impensé social · Notre réponse (4 valeurs) · Parcours en 3 temps · Témoignage · Audiences (3 portes d'entrée) · Double CTA.

### 2. Structures d'accueil — `StructurePage` (dans `pages.jsx`)
Pour les EHPAD, foyers, associations partenaires.
**Accent dominant** : violet `#4A3D85` + lavande.
**Sections** : Hero (« On intervient chez vous, avec vous ») · Pourquoi nous (texte éditorial) · 3 formats chiffrés (atelier / individuel / formation) · Témoignage directrice · Comment on travaille (4 étapes) · 3 callouts éthiques · CTA violet.

### 3. Femmes accompagnées — `FemmePage` (dans `pages.jsx`)
Pour les femmes elles-mêmes. Ton intime, à la deuxième personne.
**Accent dominant** : orange/terracotta + rose terreux + pêche.
**Sections** : Hero (« Ce qu'on vous propose, si ça vous parle ») · Lettre adressée · 4 repères (consentement, gratuité…) · 3 témoignages mosaïque · FAQ ouvrante (6 questions) · CTA centré.

### 4. Entreprises & mécènes — `EntreprisePage` (dans `pages.jsx`)
Pour les fondations et entreprises.
**Accent dominant** : violet sérieux + miel.
**Sections** : Hero · Statistique en majesté (« 50 € permettent… ») · 3 formes de mécénat · Bandeau impact violet (4 chiffres) · Grille de partenaires (8) · 4 documents téléchargeables · CTA orange.

### 5. Bibliothèque de blocs — `BlocksPage` (dans `final-blocks.jsx`)
**Référence interne** — pas une vraie page publique, mais un catalogue de tous les blocs réutilisables (B01 à B30+). À utiliser comme **bibliothèque de composants Storybook** une fois implémenté.

## Design Tokens

### Couleurs

```
/* === Encres === */
INK              #1F1A14   /* texte principal */
INK_2            #3D362A   /* texte secondaire */
INK_3            #6B6256   /* texte tertiaire / méta */

/* === Papiers / fonds === */
PAPER_WHITE      #FAF7F0   /* fond principal historique */
PAPER_V          #FBF7EE   /* fond vivant — légèrement plus chaud */
PAPER_CREAM      #F2EAD8   /* crème — bandeaux secondaires */
CREAM_V          #F5EFE3   /* crème vivant */
PAPER_CREAM_LT   #F7F1E2
PAPER_PEACH      #F4D9C4
PAPER_LAV        #DBD4EB
PAPER_LAV_LIGHT  #E8E2F0

/* === Accents palette élargie (hero, blobs, CTA) === */
ORANGE           #C84A21   /* terracotta principal — CTA, accents serif */
ORANGE_SOFT      #E8A574
PEACH_V          #F4D9C4   /* pêche poudré */
ROSE_V           #E8A99D   /* rose terreux */
VIOLET           #4A3D85   /* violet profond */
VIOLET_SOFT      #A8A0CC
LAV_V            #DBD4EB   /* lavande pâle */
MAUVE_V          #B49DC9   /* mauve poussiéreux */
MOSS_V           #8A9A7B   /* vert mousse doux */
HONEY_V          #E8B85B   /* jaune miel */

/* === Lignes === */
LINE             #E5DFD0   /* bordures fines sur papier */
LINE_LAV         #D4CCE8   /* bordures sur fond lavande */
```

**Règles d'usage des couleurs :**
- L'**ORANGE** est la couleur d'action principale (boutons primaires, italiques d'emphase serif, liens fléchés).
- Le **VIOLET** est la couleur secondaire (CTA contraste fort, italiques alternatifs, blocs « pour structures »).
- Les **pêche / rose / lavande / miel / mousse** servent de **fonds de cartes** — jamais comme couleur de texte ou de bouton.
- Le **PAPER_V** (#FBF7EE) est le fond global du site, jamais blanc pur.
- Les **blobs** (formes organiques en SVG) reprennent les couleurs d'accent à opacité 0.2–0.6.

### Typographie

Trois familles, chargées via Google Fonts :

```html
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**Newsreader** (serif éditorial, optical sizing) — titres, citations, italiques d'emphase. Toujours en `font-weight: 400` ou `500`. L'italique est central dans l'identité.
**Inter Tight** (sans contemporain) — corps de texte, boutons, navigation, paragraphes.
**JetBrains Mono** (monospace) — eyebrows, méta-infos, micro-labels en majuscules avec `letter-spacing: 0.06em–0.14em`.

**Échelle typographique (px)** :

| Usage                           | Police       | Taille    | Weight | Line-height | Letter-spacing |
|---------------------------------|--------------|-----------|--------|-------------|----------------|
| Hero H1 — accueil               | Newsreader   | 96–120    | 400    | 0.94        | -0.025em       |
| Hero H1 — pages secondaires     | Newsreader   | 96–100    | 400    | 0.96        | -0.025em       |
| Section H2                       | Newsreader   | 48–64     | 400    | 1.0–1.05    | -0.025em       |
| Card title H3                   | Newsreader   | 24–32     | 500    | 1.15        | -0.015em       |
| Citation                         | Newsreader italic | 21–32 | 400    | 1.3–1.4     | -0.015em       |
| Lede (sous-titre paragraphe)    | Inter Tight  | 21–22     | 400    | 1.5         | normal         |
| Body                             | Inter Tight  | 15–17     | 400    | 1.55–1.65   | normal         |
| Body small                       | Inter Tight  | 13–14.5   | 400    | 1.55        | normal         |
| Eyebrow / méta                   | JetBrains Mono | 11–12   | 400    | 1           | 0.06em–0.14em (UPPERCASE) |
| Numéro section (« § I », « 01 »)| Newsreader italic | 32–80 | 500    | 0.95–1      | -0.02em à -0.04em |
| Big stat (« 168 », « 50 € »)    | Newsreader italic | 80–200| 500    | 0.7–0.95    | -0.03em à -0.04em |

**L'italique serif coloré** est la signature graphique : sur chaque section, **un mot-clé ou deux** est en italique Newsreader weight 500, coloré (ORANGE ou VIOLET), avec un **souligné manuscrit SVG** (composant `HandUnderline`) en dessous. C'est ce traitement qui donne le caractère « manuel et chaleureux » du site.

### Espacements

Pas de système rigide de type 4/8/16, mais des valeurs récurrentes :
- Padding sections verticaux : **120px** (large), **80px** (moyen), **64px** (compact).
- Padding sections horizontal : **40px** (mobile-tablet) ou **60px** (desktop), conteneur max-width **1240px** centré.
- Padding cartes : **28–32px**.
- Gap grilles : **16–24px** (cartes), **48–64px** (colonnes texte/image), **12px** (chips, mini-grilles).
- Border-radius : **6–8px** (boutons, petites cartes), **12–14px** (cartes content), **22px** (CTA bandeau hero).

### Ombres

**Aucune** ombre portée n'est utilisée. La hiérarchie est créée par les contrastes de fond (papier vs crème vs lavande) et les bordures fines `1px solid LINE`.

### Bordures

```
border: 1px solid #E5DFD0;          /* cartes neutres */
border-left: 3px solid #C84A21;     /* callouts éthiques */
border-top: 2px solid #4A3D85;      /* étapes parcours */
border-bottom: 1.5px solid #C84A21; /* lien actif nav */
```

## Components

Tous les composants sont dans **`final-home.jsx`** (atomes globaux) ou définis localement dans chaque page. Voici les atomes essentiels à porter en premier :

### Atomes (`final-home.jsx`)

- **`<Eyebrow color={INK_3}>— LABEL</Eyebrow>`** — petit label monospace majuscule au-dessus de chaque titre. Le tiret en début est **toujours présent** dans le children.
- **`<BtnPrimary>`** — fond ORANGE, texte blanc, padding 14px 22px, radius 8px, font Inter 14px weight 500.
- **`<BtnViolet>`** — variante violet pour le CTA structures.
- **`<BtnGhost>`** — bordure 1px LINE, texte INK, transparent. Pour secondaires.
- **`<LinkArrow color={ORANGE}>texte</LinkArrow>`** — lien italique serif avec une flèche fine SVG dessinée à main levée (composant `Arrow`).
- **`<Arrow color="..." />`** — flèche SVG inline, hand-drawn (path qui ondule légèrement).
- **`<Plus open={bool} />`** — chevron +/− pour FAQ, animation rotation 200ms.
- **`<VLogo />`** — logotype : deux arcs entrelacés (orange et violet) + wordmark serif « 2mains / de femmes ».
- **`<NavBar>`** — sticky top, fond PAPER_WHITE, border-bottom LINE, padding 20px 40px, gap 28px entre liens. Lien actif souligné de 1.5px ORANGE.
- **`<Footer>`** — fond `#2B2419` (encre profonde), texte `#D8CFBF`, 4 colonnes (intro + 3 listes), padding 80px 40px 32px.

### Atomes vivants (`final-vivant-v2.jsx`)

- **`<Blob size color seed opacity style />`** — forme organique SVG pseudo-aléatoire, déterministe via `seed`. Utilisée en fond de hero/sections/cartes à opacité 0.2–0.7. **Signature visuelle de l'identité.** Toujours en `position: absolute` avec `overflow: hidden` sur le parent.
- **`<HandUnderline width color style />`** — souligné manuscrit SVG sous les italiques d'emphase. Path qui ondule légèrement, jamais une ligne droite.
- **`<HandCircle />`** **`<HandArrow />`** — variantes pour entourer ou pointer un élément (utilisées plus rarement, ponctuel).

### Composants de page (`pages.jsx`)

- **`<Crumbs items={["Accueil", "Page"]} />`** — fil d'ariane mono petit, dernier item ORANGE, séparateur `/` couleur LINE.

## Interactions & comportements

- **Navigation** : SPA simple via `useState` + bouton conditionnel. À porter en routing réel (Next.js routes ou React Router).
- **FAQ** (page Femme) : un seul item ouvert à la fois, transition d'ouverture immédiate (pas d'animation de hauteur dans le proto — ajouter un `framer-motion` height auto en prod).
- **Hover boutons** : pas de transition explicite dans le proto. En prod, prévoir `opacity 0.85` ou un léger darken sur 150ms ease-out.
- **Scroll** : pas de scroll-jacking. Au changement de page, `window.scrollTo({top: 0, behavior: 'instant'})`.
- **Sticky nav** : oui, `position: sticky; top: 0; z-index: 50`.

## State management

Très léger — un seul état au niveau App :
- `page: "home" | "structure" | "femme" | "entreprise" | "blocks"` — page active.
- `openFaq: number` — index de la question ouverte sur la page Femme.

À porter en routing réel : URLs `/`, `/structures`, `/femmes-accompagnees`, `/entreprises-mecenes`. La bibliothèque de blocs ne doit **pas** être publique.

## Responsive

Le proto est dessiné **desktop-first à 1240px**. Pour une implémentation prod :
- **≥ 1024px** : layout actuel.
- **768–1023px** : grilles 3 colonnes → 2 colonnes ; grilles 4 colonnes → 2 colonnes ; padding sections 80px vertical, 32px horizontal.
- **< 768px** : tout en une colonne ; H1 hero 56–72px (au lieu de 96–120) ; cartes pleine largeur ; nav en burger ; CTA bandeau hero passe en stack vertical.

## Assets

- **Polices** : Google Fonts (Inter Tight, Newsreader, JetBrains Mono) — voir section Typographie.
- **Logo** : SVG inline, pas de fichier externe (composant `<VLogo />`).
- **Photos** : **aucune dans le proto**. Le client doit produire une banque photo sur mesure (femmes en situation d'atelier, mains, lieux d'accueil) — en attendant, ne **pas** utiliser de stock photos génériques. Les blobs colorés tiennent lieu de placeholder visuel.
- **Icônes** : SVG inline dessinés à la main (`Arrow`, `Plus`, formes organiques). Pas de bibliothèque d'icônes type Lucide ou Heroicons.

## Files

| Fichier                      | Contenu                                                          |
|------------------------------|------------------------------------------------------------------|
| `final-vivant-v2.html`       | Document racine — charge React, Babel, et les 4 fichiers JSX.   |
| `final-home.jsx`             | Atomes globaux : NavBar, Footer, boutons, tokens, logo, Eyebrow. **À porter en premier.** |
| `final-vivant-v2.jsx`        | Page Accueil + atomes vivants (Blob, HandUnderline, palette élargie). |
| `pages.jsx`                  | Pages Structure / Femme / Entreprise.                            |
| `final-blocks.jsx`           | Bibliothèque interne de blocs (B01–B30+) — référence Storybook.  |

## Recommandations d'implémentation

1. **Stack** : Next.js 15 (App Router) + Tailwind CSS + une lib d'icônes minimaliste (ou pas du tout). Framer Motion pour les ouvertures FAQ et les apparitions au scroll si désiré.
2. **Configurer Tailwind** avec les tokens listés ci-dessus en `extend.colors` et `extend.fontFamily`. Ne pas utiliser les couleurs Tailwind par défaut.
3. **Atomes en premier** : implémenter `Eyebrow`, `Btn*`, `Arrow`, `Plus`, `Blob`, `HandUnderline`, `LinkArrow`. Ce sont les briques de tout le reste.
4. **Pages ensuite** : Accueil → Femme (la plus narrative) → Structure → Entreprise.
5. **Photographie** : prévoir un brief photo simultanément (mains, lumière chaude, cadrages serrés, pas de visages volés). Ne pas livrer le site sans photos sur mesure.
6. **Accessibilité** : contraste OK partout (vérifié sur ORANGE sur PAPER_V = AA large text). Penser à `aria-expanded` sur les boutons FAQ, `aria-current` sur le lien nav actif, `prefers-reduced-motion` pour désactiver les éventuelles animations Blob.
7. **SEO** : hero H1 unique par page, breadcrumbs JSON-LD, balises meta description spécifiques, sitemap.

## Hors scope (à clarifier avec le client)

- Page **L'association** (équipe, gouvernance, historique) — non designée.
- Page **Actualités / journal** — non designée.
- Tunnel de **don en ligne** (intégration HelloAsso ou équivalent) — non designée.
- Espace adhérent / espace pro — non designée.
- Multilingue — pas prévu.
