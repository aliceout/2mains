# 2mains-payload

Backend Payload CMS pour `2mainsdefemmes.org`. Sert l'admin sous
`/cms/admin` et l'API REST/GraphQL sous `/cms/api/*` et `/cms/graphql`.

## Stack

- **Payload 3** sur **Next.js 15** (App Router)
- **Postgres** comme DB (via `@payloadcms/db-postgres`)
- **Lexical** pour le rich text

## Lancement en dev

Le `.env` consommé par le service est celui à la **racine du repo**
(unique pour toute la stack), peuplé par DvSetup depuis Infisical.
Le `npm run dev` ci-dessous le charge automatiquement via
`dotenv-cli`.

```bash
# 1. À la racine du repo : lancer Postgres dev (port 5432 host)
docker compose -f docker-compose.dev.yml up -d

# 2. Dans services/payload : installer les deps puis lancer
cd services/payload
npm install
npm run dev
```

Admin accessible sur : http://localhost:3001/cms/admin

Le premier accès te demande de créer le compte admin (Audrey en prod).

## Scripts disponibles

| Script | Description |
|---|---|
| `npm run dev` | Serveur Next.js dev (hot reload) sur :3001 |
| `npm run build` | Build production (Next standalone) |
| `npm run start` | Démarre le build prod |
| `npm run generate:types` | Régénère `src/payload-types.ts` |
| `npm run migrate` | Applique les migrations Payload |

## Structure

```
services/payload/
├── payload.config.ts          # Config principale Payload
├── next.config.mjs            # Next.js (basePath: /cms)
├── src/
│   ├── app/(payload)/         # Routes Next pour Payload
│   │   ├── admin/[[...segments]]/
│   │   ├── api/[...slug]/
│   │   ├── api/graphql/
│   │   └── layout.tsx
│   ├── collections/           # Schémas de collections (à venir)
│   ├── blocks/                # Block library (à venir)
│   ├── globals/               # Globaux Payload (à venir)
│   └── payload-types.ts       # Auto-généré
└── Dockerfile                 # Image GHCR de prod
```

## En prod

Image construite par GHA et publiée sur
`ghcr.io/aliceout/2mains-payload:latest`. Lancée par le `compose.yml`
racine avec les secrets injectés depuis Infisical via `deploy.sh`.
