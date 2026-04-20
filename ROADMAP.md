# ROADMAP — 2mains de femmes

Ce document prolonge `2mains-site-plan.md`. Il intègre ce qui ressort des échanges WhatsApp, des contenus déjà rédigés, des annexes, et propose un plan séquencé, avec responsables et livrables.

## État des lieux (avril 2026)

- **Domaine** : `2mainsdefemmes.org` (Infomaniak), DNS pointé sur le serveur perso (`86.250.19.1`).
- **Email pro** : Ksuite Infomaniak active → `contact@2mainsdefemmes.org` à créer/utiliser.
- **Site actuel** : WordPress + thème Salient déjà installé sur le serveur (acheté 60€, servi en HTTPS). **Vide, à décommissionner.**
- **Adresse asso** : Tiers-lieu La Médiane, 255 rue de Créqui, 69003 Lyon.
- **HelloAsso** : page adhésion existe, **pas de page don dédiée** (le lien Google principal est cassé).
- **Logos** : SVG disponibles dans `brand/logos/` et `brand/pictos/` (FILIGRANE, HRZT, VRTC, TYPO, PICTO avec déclinaisons couleur).
- **Charte** : couleurs + Nunito (cf. `brand/identite-visuelle.pdf`). Pas de variantes typo à inventer.
- **Contenu rédigé** :
  - Page « L'association » (hero + présentation + valeurs + 3 axes + méthode + équipe + documents + financeurs) → `references/contenu/page-association.docx`
  - Fondamentaux (mission/vision/valeurs/piliers) → `references/projet/fiche-memo-fondamentaux.docx`
  - Chiffres, diagnostic, innovation → `references/projet/doc-projet-LHM-2025.pdf` + `references/projet/annexe-1-fiche-de-structure.pdf`
  - Leaflet grand public (2 versions) → `references/projet/leaflet-v1.pdf` / `references/projet/leaflet-v2.pdf`
  - CA : 8 membres (Audrey R., Sylvie B., Elsa M., Michel R., Estelle P., Noémia A., Sandrine A., Cécile B.) → `references/projet/annexe-3-composition-ca.pdf`
- **Contenu manquant** : toutes les autres pages (Isolement corporel, Pour structures / entreprises / femmes, Agir, Soutenir, Agenda, Contact, Mentions/Confidentialité).
- **Arborescence** : option 1 retenue (intro + sous-pages par catégorie). Cf. `references/arborescence-site-web-v2.xlsx` + section « Arborescence » du plan.
- **Point sensible non tranché** : positionnement politique vis-à-vis des identités de genre (femmes trans, non-binaires, mecs trans). À poser AVANT rédaction publique.
- **AG du 7 mars** : ratée côté site. Prochaine cible à fixer.

## Principes directeurs

1. **Mettre en ligne vite, enrichir ensuite.** Un squelette déployé avec 3–4 pages soignées vaut mieux que 15 pages en brouillon.
2. **Décommissionner WordPress dès que le nouveau site a 1 page live.** Pas de double maintenance.
3. **Alice = tech + design system + intégration.** Audrey = contenu + validations + comm. Frontière stricte, sinon blocage.
4. **Une seule source de vérité pour le contenu : le repo git.** Sveltia CMS édite directement des fichiers markdown commités. Pas de base de données, pas d'export/import.
5. **Accessibilité et sobriété dès le premier composant.** Pas de remédiation en fin de projet.

## Phase 0 — Cadrage et décisions (1 semaine, principalement Audrey)

**Objectif** : débloquer les questions qui conditionnent toute la suite.

- [ ] Répondre au document `QUESTIONS.md` (arbitrages éditoriaux, choix tech, contenu).
- [ ] Créer sur HelloAsso une page **Don** dédiée (distincte de l'adhésion) + récupérer l'URL.
- [ ] Créer l'adresse `contact@2mainsdefemmes.org` dans Ksuite.
- [ ] Acter le positionnement inclusif (mots employés, texte de contexte « par femmes nous entendons… »).
- [ ] Décider : **Gitea self-hosted** vs **GitHub privé** pour le repo.
- [ ] Décider : **analytics** (rien / Plausible / Umami self-hostés).
- [ ] Décider : **nom de branche** de déploiement (`main` direct ou `preview` → `main`).
- [ ] Fixer une **nouvelle date cible de mise en ligne** (proposition : AG 2026 suivante, ou événement communication visible).

**Livrable** : `QUESTIONS.md` complété + une page de décisions actée dans le repo (`DECISIONS.md`).

## Phase 1 — Socle technique (2–3 jours, Alice)

**Objectif** : un repo Astro qui build, un pipeline qui déploie, un CMS qui ouvre. Pas de contenu encore.

- [ ] `pnpm create astro@latest` (template minimal, TS strict, Tailwind).
- [ ] Config Tailwind : **tokens couleurs** (orange `#EC6A2C`, violet `#695EA3`, beige `#F9E8D8`, magenta `#DD057E`, vert `#A2D1B0`, bleu `#00607E`) + Nunito en self-host (`public/fonts/` + `@font-face`).
- [ ] Integrations : `@astrojs/sitemap`, `@astrojs/tailwind`, image service Astro (Sharp).
- [ ] Sveltia CMS dans `public/admin/` avec `config.yml` minimal (1 collection `pages/` fictive).
- [ ] OAuth proxy `sveltia-cms-auth` en Docker Compose sur le serveur.
- [ ] Repo Gitea **ou** GitHub (selon décision phase 0).
- [ ] Webhook → script shell sur le serveur : `git pull` → `pnpm install --frozen-lockfile` → `pnpm build` → `rsync dist/ /var/www/2mdf/`.
- [ ] Nginx vhost `2mainsdefemmes-preview.org` (ou sous-domaine `preview.`) + Certbot pour tester sans toucher au WP en prod.
- [ ] Script de backup cron : dump du repo + `public/uploads/` quotidien.

**Livrable** : une URL preview avec une page vide servie en HTTPS, et un admin CMS connectable.

## Phase 2 — Design system (3–4 jours, Alice)

**Objectif** : tous les blocs réutilisables, conformes charte, accessibles, testés.

- [ ] `Layout.astro` : `<head>`, fonts, reset, skip-to-content, `lang="fr"`.
- [ ] `Header.astro` : nav principale (6 entrées), CTA don permanent, burger mobile, état scrollé.
- [ ] `Footer.astro` : logo, mission 2 lignes, plan du site, contact, réseaux, mentions, HelloAsso, SIREN/RNA.
- [ ] `Banderole.astro` : message ponctuel piloté par `site/settings.md`.
- [ ] Blocs : `Hero`, `BlocTexte`, `BlocDeuxColonnes`, `BlocCartes`, `BlocValeurs`, `BlocCitation`, `BlocTelechargements`, `BlocCTA`.
- [ ] Composants métier : `CarteEvenement`, `CartePartenaire`, `FicheMembre`, `Picto` (SVG paramétrable couleur).
- [ ] Page de démo `/demo` qui instancie tous les blocs (non listée, non indexée).
- [ ] Test axe + Lighthouse sur la page de démo. Navigation clavier complète.
- [ ] **Revue visuelle Audrey** avant phase 3. Go/no-go.

**Livrable** : design system stable + page démo + checklist accessibilité validée.

## Phase 3 — Collections CMS + pages minimum viables (1 semaine, Alice + Audrey)

**Objectif** : site publiable avec le strict nécessaire. On décommissionne WordPress à la fin de cette phase.

### Config Sveltia (Alice)

- [ ] Collections : `pages/`, `evenements/`, `partenaires/`, `equipe/`, `documents/`, `temoignages/`, `site/`.
- [ ] Champ `alt` requis sur toute image. Locale FR.
- [ ] Pré-remplir l'équipe avec les 8 membres du CA (Annexe 3).
- [ ] Pré-remplir les 7+ partenaires associatifs identifiés (Un Chez Soi d'Abord, La Maison des Femmes, ALPIL, MAS, EHPAD Morlot, Foyer Notre Dame des Sans Abris, Ville de Lyon, FIS, Lyon Métropole Habitat).
- [ ] Uploader les PDFs existants dans `documents/` (fiche de structure, leaflet, doc projet LHM).

### Contenu MVP (Audrey, déjà en partie prêt)

- [ ] **Accueil** : hero + mission + 3 axes + extrait partenaires + CTA don.
- [ ] **L'association** (pages statiques : qui-sommes-nous, interventions, équipe, documents, financeurs) — utiliser `page Association.docx` directement.
- [ ] **Contact** : formulaire + coordonnées (contact@, Médiane, tél).
- [ ] **Mentions légales** + **Politique de confidentialité**.
- [ ] **Soutenir → Don** : redirection HelloAsso + arguments.

**Livrable** : site MVP publié sur `2mainsdefemmes.org`, WordPress désinstallé, DNS basculé.

## Phase 4 — Contenus pédagogiques et publics (1–2 semaines, principalement Audrey)

**Objectif** : l'asso raconte ce qu'elle fait, pour qui, pourquoi.

- [ ] **Isolement corporel** : impensé social + toucher relationnel + ressources. Exploiter le diagnostic du doc LHM (11 %, 40 %, 1 200 plaintes, 1 400 TdS, etc.).
- [ ] **Pour les structures d'accueil** : offre, modalités, contact dédié.
- [ ] **Pour les entreprises** : mécénat + sensibilisation.
- [ ] **Pour une femme concernée** : comment entrer en contact, cadre, gratuité, consentement.
- [ ] **Témoignages** : 3–5 paroles (participantes, partenaires, pros). Droits validés.
- [ ] **Agir → Bénévolat** + **Agir → Praticien·nes solidaires** : processus + formulaire (natif ou lien Forms existant selon décision).

**Livrable** : toutes les pages de l'arborescence sont en ligne avec contenu réel.

## Phase 5 — Formulaires, agenda, intégrations (2–3 jours, Alice)

- [ ] Formulaire contact : endpoint Node minimal (ou PHP), SMTP Ksuite, honeypot anti-spam, accusé de réception.
- [ ] Formulaire bénévoles : même endpoint, champs dédiés (ou lien vers Forms si décision inverse).
- [ ] Collection `evenements/` opérationnelle, 2 événements de démo.
- [ ] Banderole d'urgence activable depuis le CMS (si retenue).
- [ ] Newsletter : selon décision (HelloAsso intégré / rien / outil tiers).

**Livrable** : tous les CTA du site fonctionnent.

## Phase 6 — Recette, mise en ligne, formation (3–4 jours)

- [ ] Tests navigateurs : Firefox / Chrome / Safari iOS / Android.
- [ ] Tests accessibilité : axe, Lighthouse (objectif 90+ partout), lecteur d'écran NVDA/VoiceOver rapide.
- [ ] Relecture croisée : Audrey + au moins 1 membre CA + 1 personne extérieure.
- [ ] **Formation Audrey à Sveltia CMS** (visio 30 min, enregistrée).
- [ ] Bascule DNS définitive, HTTPS, suppression vhost preview.
- [ ] Vérif backups et uptime (monitoring basique type Uptime Kuma).

**Livrable** : site de prod, doc utilisateur, Audrey autonome.

## Phase 7 — Après livraison

- [ ] `DOC-CMS.md` dans le repo : « ajouter un événement », « changer un texte », « ajouter un partenaire », « uploader un document ».
- [ ] Point de suivi à 2 semaines, puis mensuel trim. 1.
- [ ] Maintenance : updates Astro mensuelles, patchs sécu serveur, monitoring uptime, backups vérifiés trimestriellement.
- [ ] Roadmap v2 ouverte : langue EN, lecture facile, analytics avancés si besoin.

## Dépendances critiques

- **Décisions Phase 0** bloquent tout le reste.
- **Page HelloAsso Don** bloque le CTA principal (workaround temporaire : lien adhésion).
- **Validation politique inclusivité** bloque la rédaction Isolement corporel et Pour les femmes.
- **Disponibilité Alice (Madagascar, timezone, cyclones, boulot)** : asynchrone obligatoire, pas de rush. Prévoir redondance CMS pour qu'Audrey puisse publier seule.
- **Disponibilité Audrey** : elle produit le contenu — c'est le vrai chemin critique du projet.

## Ce qui n'est PAS dans le scope v1

- Espace membre, login, dashboard.
- Paiement intégré (HelloAsso reste externe).
- Multilingue (FR only).
- Blog / actus hors agenda.
- Intranet bénévoles.
- Mesure d'impact avancée / dashboard KPI.
