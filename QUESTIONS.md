# Questions pour toi, Alice

Questions que j'ai besoin de te poser avant de démarrer, pour ne pas partir dans la mauvaise direction. Toutes les décisions qui te regardent toi (dev, hébergement, workflow) + celles où j'ai besoin que tu me dises *ce qui est déjà acté avec Audrey* vs *ce qui reste ouvert*.

Organisation : par priorité (🔴 bloquant avant que je touche du code · 🟠 à trancher avant la Phase 3 · 🟡 plus tard · 🔵 confort).

---

## 1. Ton rôle et le mien

**1.1** 🔴 Comment tu veux qu'on bosse ensemble ?
- [ ] Tu m'envoies des briefs, je code en autonomie, tu reviews les PRs
- [ ] Tu pilotes, je suis un exécutant : je ne fais que ce que tu demandes, pas d'initiative
- [ ] On co-construit : je propose, tu arbitres, on itère
- [ ] Autre : ____

**1.2** 🔴 Quel est ton niveau d'implication côté contenu ? Le plan dit « Alice = tech, Audrey = contenu », mais en pratique Audrey avance lentement. Est-ce que tu veux que je te propose des drafts de contenu (à partir des docs LHM, fiche mémo, leaflet) qu'Audrey validera, ou tu préfères attendre qu'elle te donne tout ?

**1.3** 🟠 Est-ce que je peux écrire directement sur `main`, ou tu veux un flow PR systématique ?

**1.4** 🟠 Quand je bute sur un arbitrage éditorial ou politique (ex : inclusivité de genre, QPV oui/non, offre de service payante), qu'est-ce que je fais ? Je te demande à toi, je te mets un `[À DEMANDER À AUDREY]` en commentaire, ou je propose et tu tranches ?

---

## 2. État des accords avec Audrey

Pour chaque point, j'ai besoin de savoir si c'est **acté** (je peux partir là-dessus) ou **en discussion** (je mets en pause / workaround).

**2.1** 🟠 L'arborescence finale : option 1 de `arborescence-site-web-v2.xlsx` + les 6 headers que tu as listés dans le plan — **acté** avec Audrey ou encore à confirmer ?

**2.2** 🟠 Le pivot WordPress → Astro + Sveltia : Audrey est au courant ? (Vu qu'elle a payé 60€ pour le thème Salient.) Sinon, c'est une décision que tu as prise seule et qu'il faut que je traite comme telle.

**2.3** 🟠 La discussion sur l'inclusivité de genre (WhatsApp 16/10/2025) : où elle en est ? Tu avais dit à Audrey que c'était un sujet de fond stratégique. Résolu, en cours, enterré ?

**2.4** 🟠 Les témoignages : tu as des sources réelles, ou je pars sur des placeholders « témoignages à venir » ?

---

## 3. Stack et déploiement

**3.1** 🔴 **Repo** : Gitea self-host (cohérent avec ta philosophie) ou GitHub privé (plus rapide à mettre en place) ?

**3.2** 🔴 **Serveur** : mêmes specs que celui où tourne le WP actuel ? Tu as déjà Docker + Nginx + Certbot + un reverse proxy configurés ? Je peux partir du principe que je pousse un `docker-compose.yml` et que ça marche ?

**3.3** 🔴 **WordPress existant** : je le tue quand ? Options :
- [ ] Maintenant, je travaille sur `2mainsdefemmes.org` direct, le site est vide puis se remplit
- [ ] Je bosse sur un sous-domaine `preview.` jusqu'à avoir un MVP, puis bascule
- [ ] Je bosse sur un domaine à moi, puis bascule en fin de Phase 3

**3.4** 🔴 **Nom du repo** : `2mdf-site` (comme tu avais suggéré dans le plan), `2mains-site`, autre ?

**3.5** 🟠 **Branches** : une seule `main` = prod, ou `main` + `preview` (le CMS pousse sur `preview`, tu merge quand tu valides) ?

**3.6** 🟠 **Sveltia CMS auth** : le proxy `sveltia-cms-auth` en Docker, c'est toi qui l'as déjà tourné quelque part ou c'est neuf ? (Influence sur le temps Phase 1.)

**3.7** 🟡 **Analytics** : rien / Plausible / Umami ? Ma préférence : rien pour la v1.

**3.8** 🟡 **Monitoring uptime** : tu as déjà un Uptime Kuma ou équivalent sur ton serveur, ou je mets quelque chose de neuf ?

**3.9** 🔵 **Logs et backups** : tu as une stack de backup centralisée (Restic, Borg) que je dois brancher, ou je mets un simple cron `tar + rsync` ?

---

## 4. Design system et composants

**4.1** 🟠 **Framework CSS** : Tailwind (comme dans le plan) confirmé, ou tu préfères du CSS vanilla + design tokens custom ?

**4.2** 🟠 **Iconographie** : on se limite au picto maison (`brand/pictos/PICTO.svg` décliné en couleurs), ou on s'autorise une librairie d'icônes (Lucide, Phosphor) pour les affordances UI (burger, flèches, chevrons) ?

**4.3** 🟠 **Photos** : tu as des photos droits OK pour l'asso ? Ou je me débrouille avec le picto, des formes organiques et de la typo ? (Le plan insiste sur « pas d'images stock pauvres ».)

**4.4** 🟡 **Composants complexes** : tu acceptes un peu de JS côté client (Astro islands) pour l'accordéon, le menu mobile, le carrousel témoignages — ou tu veux 100 % statique sans JS ?

**4.5** 🟡 **Animations** : on fait quoi ? Rien, un peu de `fade-in` discret au scroll, ou plus ?

---

## 5. Workflow de développement

**5.1** 🔴 **Typo TS** : `tsconfig` strict par défaut ? (Astro le permet.)

**5.2** 🟠 **Linter / formatter** : ESLint + Prettier, Biome, rien ? Tu as déjà un stack standard que tu utilises sur tes autres projets ?

**5.3** 🟠 **Tests** : zéro test automatisé pour un site vitrine (recette manuelle) ? Ou tu veux au moins un smoke test (le site build, les routes répondent) ?

**5.4** 🟠 **CI** : quand je push, qu'est-ce qui se passe côté CI ?
- [ ] Rien, webhook → build local sur serveur
- [ ] GitHub Actions / Gitea Actions qui build + tests avant le webhook
- [ ] CI qui build et push dist/ direct sur serveur (pas de build serveur-side)

**5.5** 🔵 **Conventions de commit** : Conventional Commits, ou libre ?

---

## 6. Contenu — ce que tu veux que je produise

**6.1** 🟠 Je peux me servir des docs dans `references/` pour **rédiger des drafts** des pages manquantes (Isolement corporel, Pour structures/entreprises/femmes, Agir) — OK pour toi ? Ou tu attends qu'Audrey écrive ?

**6.2** 🟠 Les **mentions légales** et la **politique de confidentialité** : je peux en rédiger un brouillon générique « pas de cookie, pas de tracker, formulaire → mail » qu'Audrey validera ?

**6.3** 🟡 La **page 404** : ton message d'erreur préféré (ton léger, renvoi vers accueil) ?

---

## 7. Planning et dispo

**7.1** 🔴 Quand tu prévois d'attaquer la Phase 1 ? (Tu disais à Audrey fin février / début mars, puis Mada cyclones + boulot.) Je veux savoir si je prépare un environnement tout de suite ou juste une spec.

**7.2** 🟠 Tu veux que je te fasse une **estimation en heures** de chaque phase, pour que tu puisses planifier ta charge ?

**7.3** 🟡 **Point de synchro** : tu veux un format recurring (Slack-like async chaque semaine), des visios ponctuelles, un `STATUS.md` que je tiens à jour ?

---

## 8. Mes défauts si tu ne réponds pas

Pour que je ne sois pas bloqué si tu ne réponds pas tout de suite :

- **Repo** : GitHub privé
- **URL preview** : sous-domaine à toi (`2mdf.alyss.cc` ou équivalent)
- **Branches** : `main` seule, pas de preview branch
- **Tailwind** + tokens JSON, **Nunito self-host**, pas de lib icônes (je fais mes SVG maison)
- **Linter** : Prettier + ESLint minimal
- **CI** : Actions qui build, puis webhook → rsync. Pas de build sur serveur.
- **Tests** : smoke test uniquement (build réussi)
- **Analytics** : aucun
- **Commits** : Conventional Commits (fix:, feat:, chore:, docs:)
- **Contenu** : je te propose des drafts pour tout ce qui manque, tagués `[DRAFT-CLAUDE]` pour qu'Audrey sache que ça n'est pas toi
- **Mentions légales / RGPD** : brouillon générique en attente des infos admin (SIREN, RNA…) d'Audrey
