# 2mains de femmes — site web

Site vitrine de l'association lyonnaise [2mains de femmes](https://2mainsdefemmes.org).

## Stack

- [Astro 6](https://astro.build/) en sortie statique
- [Tailwind CSS 4](https://tailwindcss.com/) (couleurs charte en tokens dans `src/styles/global.css`)
- [Nunito](https://fonts.google.com/specimen/Nunito) self-hostée (`public/fonts/`, pas de Google Fonts)
- [Sveltia CMS](https://github.com/sveltia/sveltia-cms) pour l'édition du contenu (backend GitHub)
- TypeScript strict, pnpm, Node 22

## Développement

```bash
pnpm install
pnpm dev          # serveur local : http://localhost:4321
pnpm build        # génère dist/
pnpm preview      # sert dist/ en local
pnpm check        # type-check Astro
pnpm format       # Prettier
pnpm lint         # ESLint
```

## Structure

```
src/
  pages/              Routes (fichier = URL)
  layouts/Layout.astro Wrapper HTML + head + header + footer
  components/         Composants réutilisables
  config/site.ts      Navigation + infos globales
  styles/global.css   Tailwind + tokens + fonts
public/
  fonts/              Nunito woff2
  brand/              Logos et pictos SVG servis
  admin/              Sveltia CMS
  uploads/            Médias uploadés via le CMS (créé à la volée)
content/              Contenu éditorial (créé par le CMS, géré en markdown)
brand/                Sources brand (hors publication — référence interne)
references/           Docs source de l'asso (hors publication — référence interne)
```

## Pages (arborescence option 1)

```
/
/association · qui-sommes-nous · interventions · equipe · documents · financeurs
/isolement-corporel · impense · toucher · ressources
/pour · structures · entreprises · femmes · temoignages
/agir · benevolat · praticiennes
/soutenir · dons · mecenat
/agenda · /contact · /mentions-legales · /politique-confidentialite · /404
```

Toutes les pages actuelles sont des **placeholders avec contenu générique**, signalés par la
mention `[Contenu à compléter — placeholder automatique.]`. Le vrai contenu arrivera via le CMS
ou par édition directe des fichiers à mesure qu'il est écrit.

## CMS

L'admin est servie sur `/admin/`. Elle nécessite un proxy OAuth `sveltia-cms-auth` côté
serveur pour s'authentifier auprès de GitHub — à déployer quand on arrivera à la mise en
ligne côté serveur.

Tant que le proxy n'est pas configuré, l'admin est présente mais non fonctionnelle.

## Déploiement

CI GitHub Actions à chaque push sur `main` :

1. `pnpm install`
2. `pnpm check` (TypeScript)
3. `pnpm build`
4. Smoke test (routes attendues présentes)
5. Upload de `dist/` en artefact

Le déploiement serveur (rsync `dist/` vers nginx) sera câblé via webhook/action dans une phase
suivante.

## Charte

Couleurs (cf. `brand/identite-visuelle.pdf`) :

| Nom     | Hex       | Usage                |
| ------- | --------- | -------------------- |
| orange  | `#EC6A2C` | primaire, CTA        |
| violet  | `#695EA3` | primaire, navigation |
| beige   | `#F9E8D8` | fond doux            |
| magenta | `#DD057E` | accent fort          |
| vert    | `#A2D1B0` | accent calme         |
| bleu    | `#00607E` | accent profond       |

Typo : **Nunito** uniquement — regular, italic, semibold, bold. Jeu sur couleur + graisse
plutôt que variantes typographiques.

## Conventions

- Accessibilité : WCAG AA minimum, navigation clavier complète, focus visibles, `lang="fr"`,
  `prefers-reduced-motion` respecté, skip link vers le contenu principal.
- SEO : sitemap auto, Open Graph par page, pas de tracker, pas de cookie.
- Images : `alt` requis côté CMS.
