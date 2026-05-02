# 2mains de femmes — site web

Site vitrine de l'association lyonnaise [2mains de femmes](https://2mainsdefemmes.org).
Lutte contre l'isolement corporel des femmes par le toucher relationnel.

- **Stack** : Astro 6 SSR (Node) + Tailwind + Payload CMS 3 (Postgres)
- **Hébergement** : self-host Docker (4 containers : `db`, `payload`, `site`, `mail`)
- **Contenu** : édité via Payload sous `/cms/admin`, persisté en Postgres
- **Dons** : externalisés sur HelloAsso, pas de paiement intégré

---

## Sommaire

1. [Démarrage rapide](#démarrage-rapide)
2. [Structure du projet](#structure-du-projet)
3. [Stack technique](#stack-technique)
4. [Développement local](#développement-local)
5. [Gestion du contenu](#gestion-du-contenu)
6. [Déploiement serveur](#déploiement-serveur)
7. [Accessibilité, SEO, RGPD](#accessibilité-seo-rgpd)
8. [Charte graphique](#charte-graphique)
9. [Conventions](#conventions)
10. [Ce qui reste à faire](#ce-qui-reste-à-faire)

---

## Démarrage rapide

```bash
# Prérequis : Node 22+, pnpm 10+
pnpm install
pnpm dev          # http://localhost:4321
```

Pour la prod : voir [Déploiement serveur](#déploiement-serveur).

---

## Structure du projet

```
2mains/
├── src/                       # App Astro SSR
│   ├── pages/                 # Routes (1 fichier = 1 URL)
│   ├── layouts/               # Layout global (head, header, footer)
│   ├── components/            # Composants Astro réutilisables (blocs CMS)
│   ├── lib/payload.ts         # Client REST Payload + helpers legacy
│   ├── lib/site.ts            # Nav + paramètres site (consomme global Site Payload)
│   └── styles/global.css      # Tailwind + tokens charte + @font-face
├── services/
│   ├── payload/               # Service Payload CMS (Next.js + Postgres)
│   │   ├── src/collections/   # 8 collections + 1 global Site
│   │   ├── src/blocks/        # 23 blocs Payload (miroir des sections Astro)
│   │   ├── src/migrations/    # Migrations SQL générées (payload migrate:create)
│   │   └── scripts/migrate-to-payload.ts  # Import one-shot d'un dump markdown
│   └── mail/                  # Backend formulaire de contact (Node + nodemailer)
├── public/                    # Assets statiques servis par Astro
│   ├── brand/                 # Logos et pictos SVG
│   └── fonts/                 # Nunito self-hostée
├── infra/scripts/deploy.sh    # Déploiement VPS (Infisical → .env → compose up)
├── compose.yml                # Compose prod (4 services sur réseau Docker interne)
├── docker-compose.dev.yml     # Compose dev (juste Postgres pour Payload local)
├── Dockerfile.site            # Image Astro Node SSR
├── .github/workflows/         # CI : check + build des 3 images GHCR
├── brand/, references/        # Sources brand + docs asso
├── 2mains-site-plan.md, ROADMAP.md, DRAFTS.md
└── README.md
```

---

## Stack technique

| Outil                                                  | Rôle                                       |
| ------------------------------------------------------ | ------------------------------------------ |
| [Astro 6](https://astro.build/)                        | Front SSR Node, fetch Payload server-side  |
| [@astrojs/node](https://docs.astro.build/en/guides/integrations-guide/node/) | Adapter Node standalone (compose `site`) |
| [Tailwind CSS v4](https://tailwindcss.com/)            | Styling via `@theme` tokens                |
| [Payload CMS 3](https://payloadcms.com/)               | Admin + REST API sous `/cms/*` (Next.js)   |
| [Postgres 16](https://www.postgresql.org/)             | DB Payload, alpine + bind mount            |
| [Nunito](https://fonts.google.com/specimen/Nunito)     | Typo unique, self-hostée                   |
| TypeScript strict                                      | Types sur toute la codebase                |
| pnpm 10 + Node 22                                      | Package manager + runtime                  |
| GitHub Actions + GHCR                                  | CI : check + build des 3 images Docker     |
| [Infisical](https://infisical.com/)                    | Secrets management (creds DB, SMTP, etc.)  |

Aucun Google Fonts. Aucun tracker. Aucun cookie de suivi.

---

## Développement local

### Prérequis

- **Node 22+** (`node -v`)
- **pnpm 10+** (`pnpm -v` ; sinon : `npm i -g pnpm`)

### Commandes

```bash
pnpm install          # installe les deps
pnpm dev              # serveur dev avec hot reload  → http://localhost:4321
pnpm build            # génère dist/ (production)
pnpm preview          # sert dist/ en local pour vérifier
pnpm check            # type-check Astro (TS strict)
pnpm format           # Prettier sur src/ + fichiers racine
pnpm lint             # ESLint sur src/
```

### Pages disponibles en local

28 pages + `/status` (audit interne) + `/404`. Toute l'arborescence option 1 est déjà
scaffoldée avec du contenu.

---

## Gestion du contenu

### Contenu fictif — le système `<Draft>`

Tout contenu **inventé, provisoire ou à valider** est entouré du composant
`<Draft reason="...">`. Ça produit :

- un **ruban orange "À valider"** visible sur la page,
- une **bordure pointillée orange** autour du bloc,
- un attribut `data-draft="..."` dans le HTML (utile pour audit).

Trois manières de voir ce qui reste à valider :

1. **La page `/status`** — liste automatique de tous les `<Draft>` du site, avec raison.
2. **`DRAFTS.md`** — audit humain à la racine.
3. **En ligne de commande** :
   ```bash
   grep -rn "<Draft" src/pages
   ```

Pour valider un bloc : remplacer le contenu à l'intérieur, retirer le wrapper `<Draft>`,
retirer l'import s'il n'est plus utilisé.

### Contenu géré via CMS

Payload est configuré dans [`services/payload/src/payload.config.ts`](services/payload/src/payload.config.ts)
avec **8 collections + 1 global** :

| Collection / Global | À quoi ça sert                                          |
| ------------------- | ------------------------------------------------------- |
| `pages`             | Pages éditoriales (composées de blocs)                  |
| `actualites`        | Articles de blog                                        |
| `evenements`        | Agenda                                                  |
| `equipe`            | Membres du CA                                           |
| `temoignages`       | Paroles recueillies                                     |
| `partenaires`       | Financeurs et partenaires associatifs                   |
| `documents`         | PDFs téléchargeables                                    |
| `media`             | Uploads (images, fichiers) — bind mount payload-media/  |
| `users`             | Comptes admin                                           |
| Global `site`       | Paramètres globaux (identité, réseaux, HelloAsso…)      |

L'admin est servie sur **`/cms/admin`**. Audrey crée un compte au premier accès,
puis édite le contenu — pas de commit GitHub, pas d'OAuth proxy, pas de rebuild
CI. Tout est en Postgres, le site Astro SSR consulte Payload à chaque requête
via le réseau Docker interne.

### Blocs Payload

Les pages sont composées en empilant des **blocs** (équivalents des sections
Astro). 23 types disponibles dans
[`services/payload/src/blocks/`](services/payload/src/blocks/) — Prose, Cartes,
Valeurs, Stats, Citation, CTA, Étapes, FAQ, Galerie, Portraits, Timeline,
Témoignages, etc. Chaque bloc Payload a son composant Astro miroir dans
[`src/components/`](src/components/), et
[`src/components/PageRenderer.astro`](src/components/PageRenderer.astro) fait
le dispatch.

Pour ajouter un nouveau type de bloc :
1. Créer le bloc Payload (`services/payload/src/blocks/MonBloc.ts`)
2. L'ajouter à `allBlocks` dans `services/payload/src/blocks/index.ts`
3. Régénérer les migrations : `cd services/payload && pnpm payload migrate:create`
4. Créer le composant Astro (`src/components/MonBloc.astro`)
5. Ajouter le case dans `PageRenderer.astro`

### Flux de publication

```
┌──────────────┐        ┌────────────────┐        ┌──────────────┐
│  Audrey      │──édite│ /cms/admin     │──save▶│  Postgres    │
│  navigateur  │  ───── │ (Payload)      │        │  (DB)        │
└──────────────┘        └────────────────┘        └──────┬───────┘
                                                         │
                                                         │ fetch SSR
                                                         ▼
┌──────────────┐                                  ┌──────────────┐
│  visiteur·se │◀──── HTML rendu à la demande────│ Astro SSR    │
│  site live   │                                  │ (Node)       │
└──────────────┘                                  └──────────────┘
```

Pas de cache statique. Les modifs Audrey sont visibles **immédiatement**
après un Save — pas de rebuild, pas de délai CI. Trade-off : chaque requête
visiteur tape Payload (latence ~50ms via réseau Docker interne, négligeable).

### Quelles pages sont branchées à quelle collection

| Collection    | Pages qui l'affichent                       |
| ------------- | ------------------------------------------- |
| `pages`       | `/`, `/qui-sommes-nous`, `/structures`, etc. (consommées par PageRenderer) |
| `actualites`  | `/actualites`, `/actualites/<slug>`         |
| `evenements`  | `/agenda`, `/agenda/<slug>.ics`             |
| `equipe`      | bloc `equipe` dans n'importe quelle page    |
| `documents`   | `/documents`                                |
| `partenaires` | `/financeurs`                               |
| `temoignages` | bloc `temoignages` dans n'importe quelle page |

Côté code, le client REST Payload est dans
[`src/lib/payload.ts`](src/lib/payload.ts) avec des helpers `fetchPageLegacy`,
`fetchCollectionLegacy`, `fetchSite`, etc.

---

## Déploiement serveur

**Principe** : push sur `main` → CI build les 3 images Docker → push sur GHCR
→ webhook côté VPS → `infra/scripts/deploy.sh` qui pull + up -d. Aucune source
sur le serveur, aucun build dessus.

### Topologie prod

4 containers sur réseau Docker interne, port-forwardés sur 127.0.0.1 ; reverse
proxy nginx du VPS (hors compose) termine TLS et dispatche par préfixe :

| Service   | Image                                       | Port host       | Route nginx     |
| --------- | ------------------------------------------- | --------------- | --------------- |
| `db`      | `postgres:16-alpine`                        | (interne)       | —               |
| `payload` | `ghcr.io/aliceout/2mains-payload:latest`    | `127.0.0.1:8066`| `/cms/*`        |
| `site`    | `ghcr.io/aliceout/2mains-site:latest`       | `127.0.0.1:8064`| `/*` (catch-all)|
| `mail`    | `ghcr.io/aliceout/2mains-mail:latest`       | `127.0.0.1:8065`| `/api/*`        |

Bind mounts data sous `$HOME/data/2mains/` (fixé par `deploy.sh`) :

```
$HOME/data/2mains/postgres/      ← /var/lib/postgresql/data (Postgres)
$HOME/data/2mains/payload-media/ ← /app/media (uploads Payload)
```

### Configuration côté VPS

Le script [`infra/scripts/deploy.sh`](infra/scripts/deploy.sh) attend :
- Le repo cloné sur le VPS (par convention `/var/www/2mains/`)
- Un fichier `~/.config/infisical/2mains.env` avec les creds Universal Auth
  Machine Identity de l'instance Infisical self-hosted (5 vars :
  `INFISICAL_API_URL`, `INFISICAL_PROJECT_ID`, `INFISICAL_CLIENT_ID`,
  `INFISICAL_CLIENT_SECRET`, `INFISICAL_ENV`)
- Docker + Docker Compose v2 installés

Le script :
1. Source les creds bootstrap
2. Login Infisical → token éphémère
3. Export les secrets app (POSTGRES_*, PAYLOAD_*, SMTP_*, etc.) depuis les
   4 sous-paths `/payload`, `/postgres`, `/smtp`, `/web` vers `.env` racine
   (chmod 600)
4. `docker compose pull && down && up -d`
5. Attend que les 4 containers soient healthy (timeout 90s)

### Webhook GitHub → VPS

Un GitHub Webhook sur `https://webhooks.backlice.dev/webhooks` déclenche
`deploy.sh` à chaque `workflow_run` complété en succès sur la branche `main`.
Le secret HMAC est partagé entre GitHub Settings → Webhooks et la conf
Infisical `/services/webhooks/2mains/` côté cloud.

### Reverse proxy nginx (côté VPS, hors compose)

Le vhost `2mainsdefemmes.org` côté VPS dispatche en proxy_pass :

```nginx
location /cms/  { proxy_pass http://127.0.0.1:8066; ... }
location /api/  { proxy_pass http://127.0.0.1:8065; ... }
location /      { proxy_pass http://127.0.0.1:8064; ... }
```

Plus TLS Let's Encrypt via certbot, headers de sécu standards. La conf est
maintenue côté repo `vps-install` (out-of-scope ici).

### Premier déploiement / cold start

Au premier `up -d`, la DB est vide. Au boot du container `payload`, le CMD
applique d'abord les migrations (`payload migrate`) puis lance `next start` —
les tables sont créées d'elles-mêmes. Pour peupler avec du contenu existant,
voir le script
[`services/payload/scripts/migrate-to-payload.ts`](services/payload/scripts/migrate-to-payload.ts).

### Backups

Les bind mounts sous `$HOME/data/2mains/` sont snapshottés via `restic` côté
infra VPS (cron). Le repo git est lui-même un backup du code/config — pas du
contenu, qui vit en Postgres.

## Accessibilité, SEO, RGPD

- **WCAG AA** comme objectif : contraste, focus visibles, skip link, `lang="fr"`,
  balisage sémantique, navigation clavier, `prefers-reduced-motion` respecté.
- **Sitemap auto** via `@astrojs/sitemap`.
- **Open Graph** + métas par page via le frontmatter `<Layout>`.
- **Pas de Google Analytics**, pas de tracker, pas de cookie tiers.
- **Fonts self-hostées** (aucun appel à fonts.googleapis.com).
- **Formulaire contact** : honeypot anti-spam basique, pas de base de données des
  messages.
- **Mentions légales** et **Politique de confidentialité** présentes.

---

## Charte graphique

Couleurs (tokens Tailwind dans `src/styles/global.css`) :

| Token    | Hex       | Usage                  |
| -------- | --------- | ---------------------- |
| `orange` | `#EC6A2C` | primaire, CTA          |
| `violet` | `#695EA3` | primaire, navigation   |
| `beige`  | `#F9E8D8` | fond doux              |
| `magenta`| `#DD057E` | accent fort, alertes   |
| `vert`   | `#A2D1B0` | accent calme, succès   |
| `bleu`   | `#00607E` | accent profond         |
| `paper`  | `#FFFFFF` | fond clair             |
| `ink`    | `#1A1A1A` | texte noir doux        |

Typographie : **Nunito** uniquement (regular 400, italic 400, semibold 600, bold 700).
Pas de variante typographique supplémentaire — jouer sur couleur + graisse.

Logos et pictos SVG dans `brand/logos/` et `brand/pictos/` (sources), copiés à `/public/brand/`
pour le runtime.

---

## Conventions

- **TypeScript strict** partout.
- **Composants Astro** pour les blocs réutilisables (`src/components/`).
- **Pas de CSS global hors de `global.css`** — préférer Tailwind + `<style>` scopé.
- **Images** : toujours `alt` (champ requis côté CMS).
- **Liens externes** : `target="_blank" rel="noopener"`.
- **Commits** : libres (pas de Conventional Commits imposé), en français de préférence
  vu que le contenu est en français.
- **Contenu fictif** : systématiquement wrappé avec `<Draft reason="...">` — la page
  `/status` l'audite automatiquement.

---

## Ce qui reste à faire

Grand brouillon non-exhaustif, à tenir à jour :

**Bloquant pour mise en ligne** :
- [ ] Récupérer SIREN et numéro RNA de l'asso (mentions légales)
- [ ] Décider identité hébergeur affichée publiquement
- [ ] Tests d'accessibilité (axe, Lighthouse ≥ 90)
- [ ] Décommissionner le WordPress existant

**Contenu à valider / remplacer** (cf. `/status` et `DRAFTS.md`) :
- [ ] 8 témoignages fictifs → vraies paroles (via `/cms/admin`)
- [ ] 4 événements agenda à valider ou remplacer
- [ ] Remplacer ou retirer les citations isolées (home + `/femmes`)

**Confort / plus tard** :
- [ ] Page `/demo` listant tous les blocs (pour revue visuelle)
- [ ] Newsletter (si décision positive)
- [ ] Version EN pour bailleurs internationaux
- [ ] Version "lecture facile"

Voir `ROADMAP.md` pour le plan complet.
