---
title: "Bienvenue sur le blog de 2mains de femmes"
description: "Premier article — gabarit en brouillon à dupliquer pour écrire d'autres actualités."
date: 2026-04-22T10:00:00
auteur: "L'équipe"
tags: ["annonce"]
draft: true
---

Bienvenue sur le blog de 2mains de femmes. Cette rubrique accueillera nos **comptes-rendus d'actions**, nos **prises de position** et la **revue de presse** sur l'isolement corporel et le toucher relationnel.

Ce premier article est **en brouillon** (`draft: true` dans le frontmatter), il n'apparaît donc pas sur le site en production. Il sert de gabarit : duplique-le depuis le CMS, donne-lui un vrai titre et un vrai contenu, décoche la case « Brouillon », puis publie.

## Conseils d'écriture

- Un article ≠ un communiqué. Écris comme tu parles.
- Un titre qui intrigue plutôt qu'un titre qui déclame.
- Remplis le chapô (champ **Description / chapô**) : il résume l'article en 1-2 phrases et sert de description dans les liens partagés.
- Tags : 1 à 3 max, cohérents dans le temps.

## Composition

Markdown standard : **gras**, _italique_, listes, liens, images, citations. Les titres `##` / `###` structurent l'article et sont lus correctement par les lecteurs d'écran — utilise-les plutôt que du gras pour marquer les sections.

Une image principale (champ **Image principale**) s'affiche en grand juste après le titre. Pense à remplir la **description d'image (alt)** pour l'accessibilité.

## Partage et SEO

Chaque article génère automatiquement :

- une **image Open Graph** reprenant le titre et la date (visible quand quelqu'un partage le lien sur WhatsApp, Facebook, LinkedIn, etc.) ;
- une entrée dans le **flux RSS** [/actualites.rss.xml](/actualites.rss.xml), auquel partenaires et journalistes peuvent s'abonner ;
- un balisage `JSON-LD NewsArticle` qui aide les moteurs de recherche à bien comprendre le contenu.

Tu n'as rien à faire pour ça — tout est automatique.
