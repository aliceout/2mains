# 2mains de femmes — site web

Site vitrine de l'association lyonnaise [2mains de femmes](https://2mainsdefemmes.org).
Lutte contre l'isolement corporel des femmes par le toucher relationnel.

- **Stack** : Astro + Tailwind + Sveltia CMS, 100 % statique
- **Hébergement** : self-host Docker + Nginx
- **Contenu** : édité via Sveltia CMS (backend GitHub), commité dans le repo
- **Dons** : externalisés sur HelloAsso, pas de paiement intégré

---

## Sommaire

1. [Démarrage rapide](#démarrage-rapide)
2. [Structure du projet](#structure-du-projet)
3. [Stack technique](#stack-technique)
4. [Développement local](#développement-local)
5. [Gestion du contenu](#gestion-du-contenu)
   - [Système `<Draft>`](#contenu-fictif--le-système-draft)
   - [Contenu géré via CMS](#contenu-géré-via-cms)
   - [Flux de publication](#flux-de-publication--ce-qui-se-passe-quand-audrey-clique--publier-)
   - [Pages branchées aux collections](#quelles-pages-sont-branchées-à-quelle-collection)
6. [Déploiement serveur](#déploiement-serveur) ← **section install**
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
├── src/
│   ├── pages/              # Routes (1 fichier = 1 URL)
│   ├── layouts/            # Layout global (head, header, footer)
│   ├── components/         # Composants Astro réutilisables
│   ├── config/site.ts      # Nav + infos globales (contact, HelloAsso, légal)
│   ├── content.config.ts   # Schémas Zod des 5 collections CMS
│   └── styles/global.css   # Tailwind + tokens couleurs charte + @font-face
├── content/                # Contenu éditorial (édité par Sveltia, commité dans le repo)
│   ├── equipe/             # 1 .md par membre du CA
│   ├── evenements/         # 1 .md par événement
│   ├── partenaires/        # 1 .md par financeur/partenaire
│   ├── documents/          # 1 .md par document à télécharger
│   └── temoignages/        # 1 .md par parole recueillie
├── public/
│   ├── admin/              # Sveltia CMS (config.yml + shell html)
│   ├── brand/              # Logos et pictos SVG servis sur le site
│   ├── fonts/              # Nunito self-hostée (4 fichiers .woff2)
│   └── uploads/            # Médias uploadés via le CMS (en runtime)
├── services/
│   └── contact-mail/       # Mini-service Docker : HTTP form → SMTP
├── brand/                  # Sources brand (PNG/SVG/PDF) — référence interne
├── references/             # Docs sources de l'asso (PDF, DOCX) — référence
├── .github/workflows/      # CI GitHub Actions (build + deploy SSH)
├── 2mains-site-plan.md     # Spec historique
├── ROADMAP.md              # Roadmap des phases
├── QUESTIONS.md            # Arbitrages (mes questions → tes réponses)
├── DRAFTS.md               # Audit des contenus fictifs
└── README.md               # Ce fichier
```

---

## Stack technique

| Outil                                                 | Rôle                                  |
| ----------------------------------------------------- | ------------------------------------- |
| [Astro 6](https://astro.build/)                       | Site statique + îlots JS si besoin    |
| [Tailwind CSS v4](https://tailwindcss.com/)           | Styling via `@theme` tokens           |
| [Sveltia CMS](https://github.com/sveltia/sveltia-cms) | Édition de contenu sur `/admin/`      |
| [Nunito](https://fonts.google.com/specimen/Nunito)    | Typo unique, self-hostée              |
| TypeScript strict                                     | Types sur toute la codebase           |
| pnpm 10 + Node 22                                     | Package manager + runtime             |
| GitHub Actions                                        | CI : check + build + smoke test       |

Aucune base de données. Aucun Google Fonts. Aucun tracker. Aucun cookie de suivi.

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

Le CMS Sveltia est configuré dans `public/admin/config.yml` avec 7 collections :

| Collection      | Dossier cible        | À quoi ça sert                                  |
| --------------- | -------------------- | ----------------------------------------------- |
| `pages`         | `content/pages/`     | Pages statiques éditables (titre, accroche, corps) |
| `evenements`    | `content/evenements/`| Agenda                                          |
| `partenaires`   | `content/partenaires/`| Financeurs et partenaires associatifs           |
| `equipe`        | `content/equipe/`    | Membres du CA                                   |
| `documents`     | `content/documents/` | PDFs téléchargeables                            |
| `temoignages`   | `content/temoignages/`| Paroles recueillies                            |
| `site`          | `content/site/`      | Paramètres globaux (contact, réseaux, banderole) |

L'admin est servie sur **`/admin/`** et nécessite le proxy OAuth Sveltia — voir la section
[déploiement](#5-proxy-oauth-pour-sveltia-cms).

### Flux de publication — ce qui se passe quand Audrey clique « Publier »

```
┌──────────────┐        ┌──────────┐        ┌──────────────┐        ┌─────────┐
│  Audrey      │──1────▶│ /admin/  │──2────▶│   GitHub     │──3────▶│ Actions │
│  sur son tel │  édite │ Sveltia  │  push  │   main       │ webhook│  CI/CD  │
└──────────────┘        └──────────┘  API   └──────────────┘        └─────┬───┘
                                                                          │
                                                                          │ 4. build
                                                                          ▼
                                                                    ┌─────────┐
┌──────────────┐          ┌──────────────┐                          │  dist/  │
│  visiteur·se │◀─────6───│   nginx      │◀──────────5. rsync ssh──│artefact │
│  site live   │          │ /var/www/2mdf│                          └─────────┘
└──────────────┘          └──────────────┘
```

En détail :

1. **Audrey** ouvre `https://2mainsdefemmes.org/admin/` et se connecte via GitHub OAuth
   (passant par le proxy `sveltia-cms-auth` sur ton serveur). Elle édite un contenu —
   par exemple ajouter un événement à l'agenda — et clique **« Publier »**.
2. **Sveltia CMS** traduit ça en un commit sur la branche `main` du repo GitHub, via
   l'API GitHub (en utilisant le token OAuth qu'elle a obtenu). Un nouveau fichier
   `content/evenements/2026-06-15-atelier.md` apparaît dans le repo.
3. **GitHub** détecte le push, déclenche le workflow `CI & Deploy` (`.github/workflows/ci.yml`).
4. **GitHub Actions** : install des deps → `pnpm check` → `pnpm build` → smoke test des
   routes attendues. L'artefact `dist/` est prêt (~30–60 s).
5. **Job deploy** : le workflow se connecte en SSH au serveur (secrets `DEPLOY_*`),
   exécute un `rsync --delete dist/ serveur:/var/www/2mdf/`.
6. **Nginx** sert immédiatement la nouvelle version. En cache cassé grâce aux hashs dans
   les noms de fichiers `/_astro/*`.

Total : **1 à 3 minutes** entre le clic "Publier" et la visibilité en ligne.

Si le build échoue (TypeScript, smoke test rouge) : le déploiement n'a pas lieu, l'état
précédent reste en ligne, et un mail GitHub Actions prévient Alice. **Pas de rollback à faire.**

### Quelles pages sont branchées à quelle collection

Les 5 collections éditoriales sont déjà consommées par les pages Astro — les édits
CMS d'Audrey apparaissent directement après un commit sans changement de code :

| Collection    | Pages qui l'affichent                                           |
| ------------- | --------------------------------------------------------------- |
| `evenements`  | `/agenda`                                                       |
| `equipe`      | `/association/equipe`                                           |
| `documents`   | `/association/documents`                                        |
| `partenaires` | `/association/financeurs`                                       |
| `temoignages` | `/pour/temoignages`                                             |

Le schéma des collections est déclaré dans `src/content.config.ts` (Zod). Les fichiers
markdown sont dans `content/<collection>/*.md`. Audrey n'a pas besoin de connaître tout
ça — elle utilise l'admin, Sveltia écrit les fichiers pour elle.

Ce qui reste écrit en dur dans les `.astro` (et qui devra passer par un changement de
code pour bouger) :
- les **textes des pages statiques** (accueil, qui-sommes-nous, interventions, isolement
  corporel, pour structures/entreprises/femmes, agir, soutenir, mentions légales…) ;
- la **bannière d'urgence** (pas encore implémentée) ;
- les **citations isolées** sur `/`, `/pour/structures`, `/pour/femmes`.

Pour brancher une nouvelle page à une collection, le patron est :

```astro
---
import { getCollection, render } from 'astro:content';
const items = await getCollection('ma_collection');
---
{items.map(async (item) => {
  const { Content } = await render(item);
  return <article><h2>{item.data.titre}</h2><Content /></article>;
})}
```

---

## Déploiement serveur

**Principe retenu** : GitHub Actions construit le site, puis pousse le dossier `dist/`
sur le serveur via SSH/rsync. Le serveur ne fait que **servir du HTML statique** — pas de
Node, pas de pnpm, pas de git à installer, pas de build à tourner dessus.

### Prérequis sur le serveur

- **Debian 12** ou **Ubuntu 22.04+**
- **Nginx** installé
- **Certbot** pour le TLS Let's Encrypt
- **SSH** accessible depuis GitHub (port 22 ou alternatif)
- **DNS** : l'enregistrement A de `2mainsdefemmes.org` pointe vers l'IP du serveur
- **Docker + Docker Compose** (uniquement si on active le CMS et le formulaire SMTP plus tard)

### 1. Créer le dossier qui sera servi

```bash
sudo mkdir -p /var/www/2mdf
sudo chown deploy:deploy /var/www/2mdf
```

### 2. Créer un user SSH dédié au déploiement

```bash
sudo adduser --disabled-password --gecos "" deploy
sudo mkdir -p /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo touch /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown -R deploy:deploy /home/deploy/.ssh
```

Générer une paire de clés dédiée (en local) :

```bash
ssh-keygen -t ed25519 -f ~/.ssh/2mdf-deploy -C "github-actions-2mdf" -N ""
```

- La **clé publique** (`~/.ssh/2mdf-deploy.pub`) va dans `/home/deploy/.ssh/authorized_keys` sur le serveur.
- La **clé privée** (`~/.ssh/2mdf-deploy`) sera stockée comme secret GitHub (voir étape 5).

Vérifier qu'on peut se connecter :

```bash
ssh -i ~/.ssh/2mdf-deploy deploy@2mainsdefemmes.org "echo OK"
```

Pour plus de sécurité, on peut restreindre la clé dans `authorized_keys` :

```
command="rsync --server --delete -logDtpre.iLsfxCIvu . /var/www/2mdf/",no-pty,no-port-forwarding ssh-ed25519 AAAA… github-actions-2mdf
```

(ajuste la ligne `rsync --server` selon ce que renvoie `rsync -e "ssh -v" …` la première fois).

### 3. Nginx — vhost du site statique

Créer `/etc/nginx/sites-available/2mainsdefemmes.org` :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name 2mainsdefemmes.org www.2mainsdefemmes.org;
    return 301 https://2mainsdefemmes.org$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name 2mainsdefemmes.org;

    root /var/www/2mdf;
    index index.html;

    # TLS (géré par certbot)
    ssl_certificate     /etc/letsencrypt/live/2mainsdefemmes.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/2mainsdefemmes.org/privkey.pem;

    # Sécurité
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Permissions-Policy "interest-cohort=(), camera=(), microphone=()" always;

    # Cache agressif sur les assets versionnés
    location /_astro/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    location /fonts/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # HTML sans cache agressif
    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    error_page 404 /404.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript
               application/xml text/xml text/javascript image/svg+xml;
    gzip_min_length 512;
}
```

Activer et obtenir le cert :

```bash
sudo ln -s /etc/nginx/sites-available/2mainsdefemmes.org /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

sudo certbot --nginx -d 2mainsdefemmes.org -d www.2mainsdefemmes.org
```

### 4. Configurer le déploiement GitHub Actions

Le workflow `.github/workflows/ci.yml` contient un job `deploy` qui se déclenche à chaque
push sur `main`. Il :

1. Récupère l'artefact `dist/` produit par le job `build`,
2. Installe la clé SSH,
3. Rsync le contenu sur le serveur.

Dans **Settings → Secrets and variables → Actions** du repo GitHub, créer 4 secrets :

| Secret            | Valeur                                                   |
| ----------------- | -------------------------------------------------------- |
| `DEPLOY_SSH_KEY`  | Contenu complet de `~/.ssh/2mdf-deploy` (clé privée)     |
| `DEPLOY_HOST`     | `2mainsdefemmes.org` (ou l'IP du serveur)                |
| `DEPLOY_USER`     | `deploy`                                                 |
| `DEPLOY_PATH`     | `/var/www/2mdf`                                          |

Pour tester : push sur `main`, puis regarder l'onglet **Actions** du repo. Le workflow doit
passer vert, et le site doit être à jour.

Pour déployer manuellement sans push : onglet Actions → "CI & Deploy" → Run workflow.

### 5. Proxy OAuth pour Sveltia CMS

Pour que `/admin/` s'authentifie auprès de GitHub, il faut un proxy OAuth.
[`sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth) — une image
Docker officielle.

1. Créer une **OAuth App GitHub** : Settings → Developer settings → OAuth Apps → New.
   - Homepage URL : `https://2mainsdefemmes.org`
   - Authorization callback : `https://auth.2mainsdefemmes.org/callback`
   - Récupérer le **Client ID** et générer un **Client Secret**.

2. Ajouter au `docker-compose.yml` serveur :

```yaml
services:
  sveltia-auth:
    image: sveltia/sveltia-cms-auth:latest
    restart: unless-stopped
    ports:
      - "127.0.0.1:3001:80"
    environment:
      GITHUB_CLIENT_ID: ${GITHUB_CLIENT_ID}
      GITHUB_CLIENT_SECRET: ${GITHUB_CLIENT_SECRET}
      ALLOWED_DOMAINS: 2mainsdefemmes.org
```

3. Nginx vhost dédié pour `auth.2mainsdefemmes.org` :

```nginx
server {
    listen 443 ssl http2;
    server_name auth.2mainsdefemmes.org;

    ssl_certificate     /etc/letsencrypt/live/auth.2mainsdefemmes.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/auth.2mainsdefemmes.org/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

4. Décommenter dans `public/admin/config.yml` :

```yaml
backend:
  name: github
  repo: aliceout/2mains
  branch: main
  auth_endpoint: https://auth.2mainsdefemmes.org/auth
  base_url: https://auth.2mainsdefemmes.org
```

Push, build, déploiement — et `/admin/` devient fonctionnel.

### 6. Backend du formulaire de contact

Le service est prêt, livré dans `services/contact-mail/` — un petit conteneur Node qui
reçoit le `POST /send` du formulaire et relaie par SMTP.

Sur le serveur :

```yaml
# À ajouter dans ton docker-compose.yml
services:
  contact-mail:
    build: ./services/contact-mail
    restart: unless-stopped
    ports:
      - "127.0.0.1:3002:3000"
    environment:
      SMTP_HOST: mail.infomaniak.com
      SMTP_PORT: 587
      SMTP_USER: contact@2mainsdefemmes.org
      SMTP_PASS: ${SMTP_PASS}
      CONTACT_TO: contact@2mainsdefemmes.org
      ALLOWED_ORIGIN: https://2mainsdefemmes.org
      RATE_LIMIT_PER_HOUR: "5"
```

Côté nginx, on proxy `/api/contact` vers ce service :

```nginx
# Dans le server block de 2mainsdefemmes.org
location = /api/contact {
    limit_except POST OPTIONS { deny all; }
    proxy_pass http://127.0.0.1:3002/send;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
}
```

Le formulaire `/contact` envoie déjà du JSON sur `/api/contact` — rien à changer côté
front. Détails : [`services/contact-mail/README.md`](./services/contact-mail/README.md).

### 7. Backups

Le repo git est déjà un backup des contenus. Pour `public/uploads/` (médias uploadés via
le CMS) :

```bash
# /etc/cron.daily/2mdf-backup
#!/usr/bin/env bash
set -euo pipefail
BACKUP_DIR=/var/backups/2mdf
DATE=$(date +%F)
mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/uploads-$DATE.tar.gz" -C /var/www/2mdf/uploads .
find "$BACKUP_DIR" -name "uploads-*.tar.gz" -mtime +30 -delete
```

```bash
chmod +x /etc/cron.daily/2mdf-backup
```

### 8. Vérifications post-install

```bash
# Le site répond
curl -I https://2mainsdefemmes.org | head -5

# Le TLS est propre (grade A+ attendu)
# → tester sur https://www.ssllabs.com/ssltest/

# /admin/ répond
curl -I https://2mainsdefemmes.org/admin/

# Le webhook répond
curl -I https://webhook.2mainsdefemmes.org/hooks/deploy-2mdf

# Le sitemap existe
curl https://2mainsdefemmes.org/sitemap-index.xml
```

---

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
- [ ] Créer le user `deploy` + clé SSH + configurer les 4 secrets GitHub Actions
- [ ] Créer le vhost nginx + certbot pour `2mainsdefemmes.org`
- [ ] Créer l'OAuth App GitHub + configurer le proxy `sveltia-cms-auth`
- [ ] Déployer le service `contact-mail` + location nginx
- [ ] Décommissionner le WordPress existant
- [ ] Tests d'accessibilité (axe, Lighthouse ≥ 90)

**Contenu à valider / remplacer** (cf. `/status` et `DRAFTS.md`) :
- [ ] 8 témoignages fictifs → vraies paroles (via CMS)
- [ ] 4 événements agenda à valider ou remplacer (via CMS)
- [ ] Encart "Prochains RDV" sur la home (actuellement en dur)
- [ ] Remplacer ou retirer les 2 citations isolées (home + `/pour/femmes`)

**Confort / plus tard** :
- [ ] Page `/demo` listant tous les blocs (pour revue visuelle)
- [ ] Newsletter (si décision positive)
- [ ] Version EN pour bailleurs internationaux
- [ ] Version "lecture facile"

Voir `ROADMAP.md` pour le plan complet.
