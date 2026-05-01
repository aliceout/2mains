# Stage 1 — install deps + build Next standalone
FROM node:22-alpine AS builder
WORKDIR /app

# sharp et payload nécessitent quelques deps natives
RUN apk add --no-cache libc6-compat

COPY package.json ./
# Pas de pnpm-lock spécifique au sous-projet, on utilise npm pour
# éviter la complexité d'un workspace pour l'instant.
RUN npm install --no-audit --no-fund

COPY . .
# La build doit avoir DATABASE_URI valide pour générer les types,
# mais ne touche pas la DB (lecture-seulement). On peut fournir
# un dummy au build et la vraie URI au runtime.
ENV DATABASE_URI="postgres://build:build@localhost:5432/build" \
    PAYLOAD_SECRET="build-time-placeholder-not-used-at-runtime"

RUN npm run build

# Stage 2 — runtime ultra-minimal (Next standalone)
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3001

RUN apk add --no-cache libc6-compat

# Copie l'output standalone Next (auto-inclut node_modules nécessaires)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Pas de public/ pour ce service (ni assets, ni images statiques —
# tout passe par Payload media en prod).

EXPOSE 3001
USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/cms/api/access > /dev/null 2>&1 || exit 1

CMD ["node", "server.js"]
