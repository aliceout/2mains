# 2mains de femmes — Site web

Spec technique + roadmap pour Claude Code.

## Contexte

Site vitrine d'une asso lyonnaise (créée 2024) qui lutte contre l'isolement corporel des femmes par le toucher relationnel. 75 adhérents, 7 partenaires asso, ~100 soutiens individuels. Présidente : Audrey Relandeau. Le site doit pouvoir être édité par des personnes non-techs du CA (ajout d'un événement, d'un partenaire, d'un rapport à télécharger, mise à jour d'un texte).

## Contraintes

- Hébergement : serveur perso (Debian/Ubuntu, Docker OK).
- Édition autonome par l'asso après livraison, sans toucher au code.
- Respect strict de la charte graphique existante (cf. `brand/identite-visuelle.pdf`).
- Pas de SaaS payant, pas de dépendance tierce critique.
- Pas de base de données à maintenir si évitable.
- Dons via HelloAsso (déjà en place), pas de paiement intégré.

## Stack retenue

**Front : Astro** (sites statiques, excellent pour contenu éditorial, hybride possible si besoin plus tard).
**CMS : Sveltia CMS** (fork moderne et maintenu de Decap CMS, même principe, UI plus propre, contenu stocké en markdown + frontmatter dans le repo git).
**Auth CMS : GitHub OAuth** via un proxy self-hosted (`sveltia-cms-auth` en container Docker sur le serveur).
**Repo : Gitea self-hosted** OU **GitHub privé** (Gitea préféré — cohérent avec la philosophie self-host, un seul repo `2mdf-site` avec deux branches : `main` = prod, `preview` pour les brouillons CMS si besoin plus tard).
**Build & déploiement :** un webhook Gitea/GitHub → script shell sur le serveur qui `git pull`, `pnpm build`, `rsync dist/ /var/www/2mdf/`. Nginx sert le statique.
**Fonts :** Nunito en self-host (pas de Google Fonts pour le RGPD).
**Formulaire de contact :** endpoint PHP ou petit service Node qui envoie un mail via SMTP de l'asso (gmail → à remplacer à terme par un vrai mail @2mainsdefemmes.fr).

### Pourquoi pas autre chose

- **Directus/Payload** : overkill pour un site vitrine à ~10 pages, interface d'admin à maintenir, base Postgres à sauvegarder.
- **Ghost** : trop rigide côté structure de contenus (pages/posts/tags figés), pas adapté à 3 pages "Vous êtes…" et à des axes d'intervention structurés.
- **WordPress** : surface d'attaque énorme, maintenance lourde, plugins, pas la philosophie.
- **Notion-based** : dépendance à un tiers, contrôle de mise en forme limité.

## Identité visuelle (résumé exploitable)

Couleurs :
- Orange `#EC6A2C` (primaire)
- Violet `#695EA3` (primaire)
- Beige `#F9E8D8` (fond)
- Magenta `#DD057E` (accent)
- Vert `#A2D1B0` (accent)
- Bleu `#00607E` (accent)

Typo unique : **Nunito** (Google Font, self-hostée). Graisses : regular pour corps et sous-titres, bold pour titres. Jouer sur couleur + graisse plutôt que sur plusieurs polices.

Éléments graphiques : le picto du logo (décliné en plusieurs teintes, avec transparence), traits de séparation 1pt, formes organiques/courbes en fond (cf. identité). Tout doit respirer — rondeur, douceur.

Logo fourni : plusieurs versions (sur blanc, sur violet, sur orange, horizontal). À prévoir en SVG.

## Arborescence

Basée sur `references/arborescence-site-web-v2.xlsx` (option 1), simplifiée.

```
/                                   Accueil
/association                        L'association
  /association/qui-sommes-nous      Présentation / mission / vision / valeurs
  /association/interventions        Nos domaines et axes d'intervention (3 piliers)
  /association/equipe               CA + bénévoles + praticien·nes solidaires
  /association/documents            Projet associatif, rapports d'activité (téléchargeables)
  /association/financeurs           Financeurs + réseaux + partenaires
/isolement-corporel                 L'isolement corporel (pédagogique)
  /isolement-corporel/impense       Un impensé social
  /isolement-corporel/toucher       Le toucher relationnel
  /isolement-corporel/ressources    Documents ressources
/pour                               Nos activités (hub)
  /pour/structures                  Vous êtes une structure d'accueil
  /pour/entreprises                 Vous êtes une entreprise
  /pour/femmes                      Vous êtes une femme concernée
  /pour/temoignages                 Ils nous ont fait confiance
/agir                               Agir avec nous
  /agir/benevolat                   Devenir bénévole
  /agir/praticiennes                Intégrer le réseau praticien·nes solidaires
/soutenir                           Nous soutenir
  /soutenir/dons                    Dons particuliers (CTA HelloAsso)
  /soutenir/mecenat                 Mécénat entreprises
/agenda                             Agenda (liste d'événements à venir + passés)
/agenda/[slug]                      Page événement
/contact                            Formulaire + coordonnées
/mentions-legales
/politique-confidentialite
```

Header principal : Accueil, L'association, Isolement corporel, Nos activités, Agir, Soutenir. Bouton CTA "Faire un don" en permanence (lien HelloAsso). Sur mobile : menu burger.

Footer : logo, mission en 2 lignes, colonnes (Plan du site, Contact, Réseaux sociaux, Mentions légales), mention HelloAsso + SIREN.

## Modèle de contenus (collections Sveltia CMS)

Chaque collection = un dossier markdown. Les champs sont édités via le CMS.

### `pages/` — pages statiques éditables

Fichiers : `accueil.md`, `qui-sommes-nous.md`, `interventions.md`, `equipe.md`, `documents.md`, `financeurs.md`, `impense.md`, `toucher.md`, `ressources.md`, `structures.md`, `entreprises.md`, `femmes.md`, `benevolat.md`, `praticiennes.md`, `dons.md`, `mecenat.md`, `contact.md`, `mentions-legales.md`, `politique-confidentialite.md`.

Frontmatter type :
```yaml
title: string
slug: string
description: string        # méta SEO
hero_image: image
hero_accroche: string      # phrase courte en grand
hero_sous_accroche: markdown
cta_primary:
  label: string
  url: string
cta_secondary:
  label: string
  url: string
sections:                  # liste de blocs libres, éditables un par un
  - type: "texte" | "deux-colonnes" | "cartes" | "valeurs" | "citation" | "telechargements" | "cta"
    # champs selon le type
seo_image: image
```

### `evenements/` — agenda

```yaml
title: string
slug: string
date_debut: datetime
date_fin: datetime (optionnel)
lieu: string
adresse: string (optionnel)
cover: image
public: "tout public" | "professionnels" | "femmes concernées" | "adhérents"
gratuit: bool
inscription_url: string (optionnel)
description: markdown
```

Logique d'affichage : `/agenda` liste les événements triés par date (à venir en haut, passés en dessous ou sur page dédiée).

### `partenaires/` — financeurs et partenaires

```yaml
nom: string
type: "financeur public" | "financeur privé" | "partenaire associatif" | "réseau"
logo: image
url: string (optionnel)
description_courte: string (optionnel)
ordre: number            # pour contrôler l'affichage
```

Déjà identifiables d'après les docs : Un Chez Soi d'Abord, La Maison des Femmes, ALPIL, Le MAS (Éclaircie, SALVA, Olympe), EHPAD Morlot, Le Foyer Notre Dame des Sans-Abris, Ville de Lyon, F.I.S., Lyon Métropole Habitat.

### `equipe/` — CA

```yaml
nom: string
role: string             # "Présidente", "Vice-présidente", "Secrétaire"…
photo: image (optionnel)
bio_courte: string (optionnel)
linkedin: url (optionnel)
ordre: number
```

Les 8 membres du CA au 24/09/2025 sont listés dans `Annexe_3`. À pré-remplir.

### `documents/` — documents téléchargeables

```yaml
titre: string
categorie: "projet associatif" | "rapport d'activité" | "ressource" | "communication"
fichier: file            # PDF uploadé via le CMS
date: date
description_courte: string
```

### `temoignages/` — paroles

```yaml
auteur: string           # "Marie, participante" ou "Assoc. X, partenaire"
role: string
texte: markdown
photo: image (optionnel)
contexte: "participante" | "partenaire" | "professionnelle"
```

### `site/` — globales (un fichier unique `settings.md`)

```yaml
nom_asso: string
accroche_globale: string
email_contact: string
telephone: string
adresse: string
helloasso_url: string
reseaux:
  facebook: url
  instagram: url
  linkedin: url
banderole_urgence:       # pour afficher un message ponctuel en haut
  active: bool
  message: markdown
  couleur: "orange" | "violet" | "magenta"
```

## Configuration Sveltia CMS

Fichier `public/admin/config.yml`. Collections mappées sur les dossiers ci-dessus. Backend : `git-gateway` si GitHub + Netlify, sinon `github` / `gitea` avec OAuth proxy. Media folder : `public/uploads/`. Public folder : `/uploads/`.

Interface d'édition en français (locale fr).

## Composants Astro à prévoir

- `Layout.astro` — layout global (head, fonts, header, footer, analytics éventuel)
- `Header.astro` — nav + CTA don + burger mobile
- `Footer.astro`
- `Hero.astro` — accroche, sous-accroche, CTAs, illustration
- `BlocTexte.astro` — paragraphe riche
- `BlocDeuxColonnes.astro` — texte + image
- `BlocCartes.astro` — grille de cartes (utilisé pour les 3 piliers, les 3 publics)
- `BlocValeurs.astro` — les 4 valeurs avec pictos
- `BlocCitation.astro` — témoignage mis en avant
- `BlocTelechargements.astro` — liste de docs à télécharger
- `BlocCTA.astro` — bande avec titre + bouton
- `CarteEvenement.astro`
- `CartePartenaire.astro`
- `FormulaireContact.astro`
- `Banderole.astro` — message ponctuel en haut de site
- `Picto.astro` — composant SVG du picto du logo, couleur paramétrable

## Accessibilité

Public fragilisé → accessibilité non négociable :
- WCAG AA minimum. Contrastes vérifiés (le orange sur beige et le violet sur orange sont à tester).
- Navigation clavier complète, focus visibles.
- `prefers-reduced-motion` respecté.
- Images : `alt` obligatoire côté CMS (champ requis).
- Langue principale `fr`, balisage sémantique strict.
- Un bouton de "lecture facile" éventuellement (version simplifiée des pages clés) — à discuter plus tard.

## SEO et RGPD

- Sitemap auto (`@astrojs/sitemap`).
- Open Graph + métas par page (via le frontmatter).
- Pas de Google Analytics par défaut. Si mesure d'audience souhaitée : **Plausible self-hosted** ou **Umami self-hosted** (pas de cookies, pas de bandeau).
- Fonts self-hostées (pas d'appel à fonts.googleapis.com).
- Pas de tracker tiers.
- Page politique de confidentialité rédigée, page mentions légales avec éditeur, hébergeur, SIREN (W… à récupérer dans le JOAFE).

## Roadmap

### Phase 0 — cadrage (1 semaine, mi-temps)
- [ ] Valider l'arborescence finale avec Audrey (option 1 vs variantes).
- [ ] Valider la charte de ton éditorial (tutoiement/vouvoiement, "iel"/neutre, longueurs).
- [ ] Récupérer tous les assets définitifs : logos SVG, photos (droits OK), identité visuelle en vectoriel.
- [ ] Récupérer le nom de domaine. Actuellement : HelloAsso + mail gmail. Acheter `2mainsdefemmes.fr` (ou `.org`) si pas déjà fait.
- [ ] Décider : Gitea vs GitHub. Gitea self-host demande un conteneur de plus. Si tu veux aller vite, GitHub privé.
- [ ] Décider : Plausible/Umami/rien pour l'analytics.

### Phase 1 — setup technique (2-3 jours)
- [ ] Initialiser le repo (`pnpm create astro@latest`, template minimal).
- [ ] Configurer Tailwind avec les couleurs de la charte en tokens.
- [ ] Self-host Nunito (télécharger les fichiers, les mettre dans `public/fonts/`, déclarer avec `@font-face`).
- [ ] Intégrer Sveltia CMS dans `public/admin/` avec sa config minimale.
- [ ] Setup OAuth proxy (Docker container `sveltia-cms-auth`) sur le serveur.
- [ ] Pipeline de déploiement : webhook git → script de build → nginx. Tester avec une page bidon.

### Phase 2 — design system (3-4 jours)
- [ ] Composant `Layout` + head + fonts + reset CSS.
- [ ] `Header` + `Footer` avec tous les états (desktop, mobile, burger ouvert, scrollé).
- [ ] Tous les blocs génériques (`Hero`, `BlocTexte`, `BlocDeuxColonnes`, `BlocCartes`, `BlocValeurs`, `BlocCitation`, `BlocTelechargements`, `BlocCTA`).
- [ ] Une page de démo qui instancie tous les blocs pour voir ce que ça donne.
- [ ] Revue visuelle avec Audrey avant de continuer.

### Phase 3 — contenus (1 semaine)
- [ ] Modèles de collections dans la config Sveltia.
- [ ] Création de toutes les pages statiques avec contenu pré-rempli (récup des docs fournis : `references/contenu/page-association.docx`, `references/projet/fiche-memo-fondamentaux.docx`, extraits du doc projet LHM, leaflet).
- [ ] Page Accueil avec tous les blocs (hero, mission, 3 piliers, partenaires, derniers événements, CTA don).
- [ ] Pages "Pour structures / entreprises / femmes" : contenus à rédiger avec Audrey, chaque page doit répondre à "qu'est-ce que l'asso propose à ce public et comment entrer en contact".
- [ ] Pages "Isolement corporel" : contenu pédagogique, valorise l'expertise de l'asso, utilise les data du doc projet (11% isolement relationnel, 40% SDF femmes, etc.).
- [ ] Page Agenda avec template d'événement. Ajouter 1-2 événements de démo.
- [ ] Page Documents avec les PDFs existants (fiche de structure, leaflet, rapport à venir).
- [ ] Pages Mentions légales + confidentialité.

### Phase 4 — formulaires et intégrations (2 jours)
- [ ] Formulaire de contact fonctionnel (SMTP, anti-spam simple type honeypot).
- [ ] Lien HelloAsso partout où pertinent.
- [ ] Inscription newsletter ? (à décider — sinon reporter).
- [ ] Formulaire bénévoles : réutilise le Forms existant (`forms.office.com/r/32MgiHRm86`) ou refait en natif.

### Phase 5 — recette et mise en ligne (3-4 jours)
- [ ] Tests accessibilité (axe, Lighthouse, navigation clavier, lecteur d'écran rapide).
- [ ] Tests sur mobile, tablette, navigateurs (Firefox, Chrome, Safari iOS).
- [ ] Tests de performance (Lighthouse 90+ partout).
- [ ] Relectures avec Audrey et au moins une autre personne du CA.
- [ ] Former Audrey à Sveltia CMS (30 min de call suffisent normalement).
- [ ] Migration DNS. Certbot pour HTTPS. Nginx config finale.
- [ ] Backup automatique du repo + des uploads (cron quotidien).

### Phase 6 — après livraison
- [ ] Doc utilisateur courte (1-2 pages) : "comment ajouter un événement", "comment changer un texte", "comment ajouter un partenaire".
- [ ] Petit call de suivi à 2 semaines pour débloquer ce qui coince.
- [ ] Prévoir maintenance : updates Astro, patchs sécu du serveur, monitoring uptime.

## Ce qui reste à trancher avec Audrey

1. Ton : tutoiement ou vouvoiement ? "iel" ou formulations neutres ? Masculin/féminin/inclusif avec point médian ?
2. Y a-t-il un rapport d'activité 2024-2025 à publier au lancement ou plus tard ?
3. La newsletter : existe-t-elle ? Quel outil ? (HelloAsso en a une intégrée.)
4. Le formulaire bénévoles : refait natif ou on garde le lien Forms ?
5. Banderole d'urgence (appel à don, évènement fort) : souhaité ?
6. Langues : FR uniquement, ou prévoir EN pour les bailleurs internationaux à terme ?
7. Analytics : rien / Plausible / Umami ?
8. Budget temps estimé côté Alice vs côté asso (relectures, validations) ?

## Fichiers sources existants à exploiter

- `references/contenu/page-association.docx` → contenu quasi-complet de la section "L'association"
- `references/projet/fiche-memo-fondamentaux.docx` → mission, vision, problématique, piliers
- `references/projet/doc-projet-LHM-2025.pdf` → data, diagnostic, chiffres pour la page "Isolement corporel"
- `references/projet/annexe-1-fiche-de-structure.pdf` → description détaillée complète
- `references/projet/annexe-3-composition-ca.pdf` → équipe
- `references/projet/annexe-5-leaflet-communication.pdf` → version courte grand public
- `references/projet/leaflet-v1.pdf` / `references/projet/leaflet-v2.pdf` → leaflets courts avec axes et chiffres clés
- `references/projet/projet-associatif-draft-1.docx` → draft du PA (contient SWOT, engagements, KPI)
- `references/contenu/mail-reseau-benevoles.docx` → mail à la communauté bénévoles (profils, apéros, formations)
- `brand/identite-visuelle.pdf` → charte
- `references/arborescence-site-web-v2.xlsx` → plan de site initial (option 1 retenue)
- `references/whatsapp-chat.txt` → historique d'échange avec Audrey (à lire pour comprendre les inflexions et demandes)

## Notes pour Claude Code

- Commencer par le setup technique (Phase 1) avant tout contenu. Un site déployable vide vaut mieux qu'un site riche jamais mis en ligne.
- Ne pas écrire de CRUD custom — Sveltia fait tout.
- Respecter strictement la charte. Pas de dégradé fantaisie, pas de shadow agressif. La douceur est politique ici.
- Le site sera lu par des femmes en situation de vulnérabilité : pas d'images stock pauvres, pas de clichés, pas de "bien-être" publicitaire.
- Écrire le CSS avec Tailwind mais garder un thème cohérent via `tailwind.config` (couleurs et typo en tokens, pas en dur).
- Accessibilité dès le début, pas en fin de projet.
- 