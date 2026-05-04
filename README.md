# 2mains de femmes — site web

Site vitrine de l'association lyonnaise [2mains de femmes](https://2mainsdefemmes.org). Astro 6 SSR + Tailwind + Payload CMS 3 + Postgres, self-hosté en Docker.

---

## Démarrage en local

Prérequis : Node 22+, pnpm 10+, Docker.

```bash
# 1. Récupérer les secrets dev dans .env (via DvSetup VS Code ou infisical CLI)

# 2. Installer les deps (1x par service)
pnpm install
pnpm --dir services/payload install
pnpm --dir services/mail install

# 3. Postgres + Mailpit en arrière-plan
docker compose -f compose.dev.yml up -d

# 4. Lancer (un terminal par process)
pnpm dev:api    # admin Payload   → http://localhost:3001/cms/admin
pnpm dev:web    # site Astro      → http://localhost:4321
pnpm dev:mail   # form contact    → http://localhost:3000  (optionnel)
```

Mailpit (capture les mails envoyés en local) : <http://localhost:8025>.

---

## Déploiement en prod

Push sur `main` → CI build les images Docker → push GHCR → webhook VPS → `scripts/deploy.sh` fetch les secrets Infisical (env `prod`), pull les nouvelles images, `compose up -d`. Aucun build sur le serveur.

Données persistantes en bind mount sous `$HOME/data/2mains/` (Postgres + uploads Payload), backup `restic` cron côté infra VPS.

Voir [`compose.yml`](compose.yml) et [`scripts/deploy.sh`](scripts/deploy.sh) pour le détail.

---

## Structure

```
src/                       App Astro SSR (pages, components, layouts)
services/
├── payload/               CMS Payload (Next.js + Postgres) → /cms/admin
└── mail/                  Backend du formulaire /contact (Hono + nodemailer)
public/                    Assets statiques + fonts Nunito self-hostées
brand/                     Logos & pictos SVG (sources)
scripts/deploy.sh    Script de déploiement VPS
compose.yml                Compose prod (db, payload, site, mail)
compose.dev.yml            Compose dev (postgres + mailpit)
```

---

## Contenu

Édité par Audrey via **`/cms/admin`**, persisté en Postgres, lu par Astro en SSR à chaque requête (pas de rebuild, modifs visibles immédiatement).

8 collections Payload (`pages`, `actualites`, `evenements`, `equipe`, `temoignages`, `partenaires`, `documents`, `media`) + 1 global `site`. Schéma dans [`services/payload/src/collections/`](services/payload/src/collections/).

Les pages éditoriales sont composées de **blocs** (23 types : Prose, Cartes, Citation, CTA, FAQ, Galerie, Timeline, Témoignages, etc.). Chaque bloc Payload a son composant Astro miroir dans [`src/components/`](src/components/), dispatchés par [`src/components/PageRenderer.astro`](src/components/PageRenderer.astro).

**Comptes admin** : invitations par mail uniquement (lien valable 7 jours, 2FA email par défaut, TOTP en option). Le premier user créé sur une base neuve devient `root` automatiquement au boot suivant.

**Contenu provisoire** : entouré du composant `<Draft reason="…">`, audit auto sur la page `/status`.

---

## Charte

Couleurs (cf [`src/styles/global.css`](src/styles/global.css)) : orange `#EC6A2C`, violet `#695EA3`, beige `#F9E8D8`, magenta `#DD057E`, vert `#A2D1B0`, bleu `#00607E`, paper `#FFFFFF`, ink `#1A1A1A`.

Typo : Nunito uniquement (400, 400i, 600, 700), self-hostée.

Sources brand dans [`brand/`](brand/), copies runtime dans [`public/brand/`](public/brand/).

---

## Sobriété, accessibilité, RGPD

WCAG AA visé. Aucun Google Fonts, aucun tracker, aucun cookie tiers. Sitemap auto, OG par page, mentions légales + politique confidentialité présentes. Formulaire contact avec honeypot, pas de stockage des messages.
