#!/usr/bin/env bash
# Deploy script — pull GHCR + up -d. Idempotent, pas de wipe.
#
# Invoqué par le webhook handler du VPS après un workflow GHA `Docker build`
# vert sur main. Le hook s'occupe de cloner / pull le repo dans $DEPLOY_DIR ;
# ce script se contente de :
#   1. sourcer les creds Infisical (auth Machine Identity Universal Auth)
#   2. login Infisical → token
#   3. export les secrets app → .env (chmod 600 avant écriture)
#   4. créer les bind mounts data
#   5. docker compose pull && up -d
#   6. attendre que tous les containers soient healthy
#
# DEPLOY_DIR est résolu depuis l'emplacement du script — le hook l'invoque
# via /var/www/2mains/infra/scripts/deploy.sh, ça résout à /var/www/2mains.
# En dev local, ça résout à la racine du repo.
#
# CREDS_FILE par défaut : $HOME/.config/infisical/2mains.env (écrit par
# l'install.sh côté vps-install). Override via env si besoin.

set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
CREDS_FILE="${CREDS_FILE:-$HOME/.config/infisical/2mains.env}"

[[ -s "$CREDS_FILE" ]] || {
  echo "ERR creds Infisical absents : $CREDS_FILE" >&2
  exit 1
}

# 1. Charge les creds bootstrap (INFISICAL_API_URL, _PROJECT_ID, _CLIENT_ID,
#    _CLIENT_SECRET, _ENV). Le `set -a` exporte tout ce qui est défini.
set -a
# shellcheck source=/dev/null
source "$CREDS_FILE"
set +a

: "${INFISICAL_API_URL:?INFISICAL_API_URL manquant dans $CREDS_FILE}"
: "${INFISICAL_PROJECT_ID:?INFISICAL_PROJECT_ID manquant dans $CREDS_FILE}"
: "${INFISICAL_CLIENT_ID:?INFISICAL_CLIENT_ID manquant dans $CREDS_FILE}"
: "${INFISICAL_CLIENT_SECRET:?INFISICAL_CLIENT_SECRET manquant dans $CREDS_FILE}"
INFISICAL_ENV="${INFISICAL_ENV:-prod}"

# 2. Login Infisical self-hosted → token éphémère.
TOKEN=$(infisical login --method=universal-auth \
  --domain="$INFISICAL_API_URL" \
  --client-id="$INFISICAL_CLIENT_ID" \
  --client-secret="$INFISICAL_CLIENT_SECRET" \
  --plain --silent)

# 3. Export tous les secrets app vers .env racine. Chmod AVANT d'écrire pour
#    qu'aucun process tiers ne puisse lire le fichier en 644 même brièvement.
ENV_FILE="$DEPLOY_DIR/.env"
: > "$ENV_FILE"
chmod 600 "$ENV_FILE"
infisical export \
  --domain="$INFISICAL_API_URL" \
  --projectId="$INFISICAL_PROJECT_ID" \
  --env="$INFISICAL_ENV" \
  --path="/" \
  --format=dotenv \
  --token="$TOKEN" \
  > "$ENV_FILE"

# 4. Bind mounts data (Postgres + médias Payload). DATA_DIR est exporté
#    pour que `docker compose` puisse l'interpoler dans compose.yml.
export DATA_DIR="${DATA_DIR:-$HOME/data/2mains}"
mkdir -p "$DATA_DIR/postgres" "$DATA_DIR/payload-media"

# 5. Pull les images GHCR (tags :latest mis à jour par CI) + up -d.
cd "$DEPLOY_DIR"
docker compose pull
docker compose up -d --remove-orphans

# 6. Attente healthy — chaque container a son healthcheck défini dans
#    compose.yml, on les sonde via `docker inspect`. Timeout 90s.
expected="2mains-db 2mains-payload 2mains-site 2mains-mail"
deadline=$(( $(date +%s) + 90 ))
echo "Waiting for services to become healthy..."
while [ "$(date +%s)" -lt "$deadline" ]; do
  all_healthy=true
  for c in $expected; do
    status=$(docker inspect -f '{{.State.Health.Status}}' "$c" 2>/dev/null || echo missing)
    if [ "$status" != "healthy" ]; then
      all_healthy=false
      break
    fi
  done
  if [ "$all_healthy" = true ]; then
    echo "[2mains-deploy] OK ($(date -Iseconds))"
    docker compose ps
    exit 0
  fi
  sleep 3
done

echo "[2mains-deploy] timeout — services pas healthy à temps :" >&2
docker compose ps >&2
exit 1
