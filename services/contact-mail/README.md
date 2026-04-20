# contact-mail

Mini-service qui reçoit le `POST /send` du formulaire de contact du site et relaie le
message par SMTP. ~130 lignes de Node, aucune dépendance hors `nodemailer`.

## Fonctionnalités

- `POST /send` → envoi SMTP + reply-to sur l'email du visiteur
- `GET /health` → healthcheck (Docker)
- Honeypot anti-spam (champ caché `website`)
- Rate-limiting par IP (5 messages / heure par défaut)
- CORS restreint à l'origine du site
- Validation email + taille message
- Refuse les bodies > 64 KB
- Signaux SIGINT/SIGTERM gérés

## Variables d'environnement

| Variable            | Obligatoire | Défaut                              |
| ------------------- | ----------- | ----------------------------------- |
| `SMTP_HOST`         | oui         | —                                   |
| `SMTP_PORT`         | non         | `587`                               |
| `SMTP_SECURE`       | non         | `false` (TLS STARTTLS par défaut)   |
| `SMTP_USER`         | oui         | —                                   |
| `SMTP_PASS`         | oui         | —                                   |
| `CONTACT_TO`        | non         | même que `SMTP_USER`                |
| `ALLOWED_ORIGIN`    | non         | `https://2mainsdefemmes.org`        |
| `RATE_LIMIT_PER_HOUR` | non       | `5`                                 |
| `PORT`              | non         | `3000`                              |

## Build local

```bash
cd services/contact-mail
docker build -t 2mdf-contact-mail .

docker run --rm -p 3002:3000 \
  -e SMTP_HOST=smtp.example.com \
  -e SMTP_USER=you@example.com \
  -e SMTP_PASS=secret \
  2mdf-contact-mail
```

## Déploiement sur le serveur

Voir [`docker-compose.example.yml`](./docker-compose.example.yml).

### Côté nginx

Proxy vers `127.0.0.1:3002`, monté sur le path `/api/contact` du site :

```nginx
# À ajouter dans le server block de 2mainsdefemmes.org
location = /api/contact {
    limit_except POST OPTIONS { deny all; }
    proxy_pass http://127.0.0.1:3002/send;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
}
```

### Côté site

Le formulaire `/contact` envoie déjà un `POST` JSON sur `/api/contact`. Une fois le
conteneur + le `location` nginx en place, ça marche — rien à changer dans le code.

## Format attendu

Requête :

```http
POST /api/contact HTTP/1.1
Content-Type: application/json

{
  "nom": "Audrey",
  "email": "audrey@exemple.fr",
  "type": "Une structure d'accueil",
  "message": "Bonjour…",
  "website": ""
}
```

Réponses :

- `200 {"ok":true}` — envoyé
- `400 {"error":"…"}` — champs manquants / email invalide
- `429 {"error":"…"}` — rate limit dépassé
- `500 {"error":"…"}` — SMTP a échoué
