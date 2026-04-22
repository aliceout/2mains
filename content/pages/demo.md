---
title: "Démo des blocs CMS"
description: "Page interne — catalogue visuel de tous les blocs composables par Audrey dans Sveltia CMS."
noindex: true
hero:
  titre: "Démo des blocs"
  sousTitre: "Catalogue interne"
  accroche: "Chaque type de section disponible dans le CMS est instancié ci-dessous avec un exemple. Cette page est non indexée."
  variant: "beige"
sections:
  - type: "prose"
    titre: "📝 Texte (prose)"
    body: |
      Ce bloc permet de rédiger du **texte libre** avec du markdown : _italique_, **gras**, titres, listes, citations, liens.

      - Utile pour introduire une section
      - Aussi pour des pages légales ou des articles de fond
      - Supporte les paragraphes, listes ordonnées, blockquotes

  - type: "cartes"
    titre: "🗂 Grille de cartes"
    fond: "beige"
    colonnes: 3
    cartes:
      - titre: "Première carte"
        description: "Décrit une offre, un service, un format."
        href: "/agir"
        cta: "En savoir plus"
        couleur: "orange"
      - titre: "Deuxième carte"
        description: "Autre proposition ou lien utile."
        href: "/pour"
        cta: "Explorer"
        couleur: "violet"
      - titre: "Sans lien"
        description: "Parfois la carte est juste informative, sans CTA."
        couleur: "vert"

  - type: "valeurs"
    titre: "🌱 Valeurs (pastilles)"
    valeurs:
      - nom: "Bienveillance"
        description: "Une posture de non-jugement et de respect du rythme."
        couleur: "magenta"
      - nom: "Consentement"
        description: "Chaque geste est choisi, jamais imposé."
        couleur: "violet"
      - nom: "Gratuité"
        description: "Ateliers sans reste à charge pour les femmes."
        couleur: "vert"
      - nom: "Rigueur"
        description: "Cadre éthique co-construit avec des pros du soin."
        couleur: "bleu"

  - type: "stats"
    titre: "📊 Chiffres clés"
    fond: "beige"
    intro: "Un paragraphe introductif peut accompagner les stats pour poser le contexte."
    stats:
      - valeur: "7 M+"
        legende: "Personnes isolées socialement en France (11 % de la population)."
        source: "Fondation de France"
      - valeur: "40 %"
        legende: "Des personnes sans-abri à Lyon sont des femmes."
        source: "Rapport du Sénat, 2024"
      - valeur: "321 000"
        legende: "Femmes victimes de violences conjugales chaque année."
        source: "Miprof"

  - type: "citation"
    citation: "Pendant longtemps je pensais que mon corps était juste un problème. Là, c'est la première fois que quelqu'un me touche sans rien demander en retour."
    auteur: "Leïla"
    role: "Participante, 42 ans"
    variant: "beige"
    fictif: true

  - type: "citation-large"
    citation: "Un toucher bienveillant peut défaire ce que dix ans de solitude ont construit."
    auteur: "Dr Marianne Zorn"
    role: "Médecin, réseau partenaire"
    variant: "violet"

  - type: "etapes"
    titre: "①②③ Étapes numérotées"
    couleur: "orange"
    etapes:
      - titre: "Premier contact"
        description: "Échange avec votre structure pour définir le besoin."
      - titre: "Co-construction"
        description: "Conception d'un parcours adapté à votre public."
      - titre: "Mise en œuvre"
        description: "Interventions, co-animation avec vos équipes."
      - titre: "Bilan partagé"
        description: "Retour d'expérience avec les femmes et l'équipe."

  - type: "deux-colonnes"
    titre: "⬛⬜ Deux colonnes (texte + picto)"
    fond: "beige"
    picto_couleur: "violet"
    texte: |
      Ce bloc combine du **texte markdown** à gauche et un picto coloré à droite.

      Pratique pour illustrer un propos quand on n'a pas de photo. Le sens peut être inversé avec la case « Picto à droite ? ».

  - type: "faq"
    titre: "❓ FAQ (accordéon)"
    questions:
      - question: "Qui peut participer à un atelier ?"
        reponse: "Toute femme repérée par une structure partenaire, ou qui nous contacte directement via le formulaire."
      - question: "Les ateliers sont-ils mixtes ?"
        reponse: "Non, les espaces sont en non-mixité choisie par et pour les femmes accompagnées."
      - question: "Faut-il une expérience préalable du toucher ?"
        reponse: "Aucune. Les ateliers partent de zéro et s'adaptent au rythme de chacune."

  - type: "callout"
    ton: "info"
    titre: "Info"
    body: "Les **encadrés** ont 4 tons disponibles : info, important, astuce, note. Chacun a sa couleur et son icône."

  - type: "callout"
    ton: "important"
    titre: "Important"
    body: "Exemple d'encadré **important** — fond plus marqué, à utiliser avec parcimonie."

  - type: "callout"
    ton: "astuce"
    body: "Encadré **astuce** (sans titre) — ton léger pour des conseils pratiques, des raccourcis, des astuces d'usage."

  - type: "callout"
    ton: "note"
    body: "Encadré **note** — pour une précision en marge du texte principal."

  - type: "chiffre-detail"
    titre: "🔢 Chiffre détaillé"
    fond: "beige"
    chiffre: "90 %"
    texte: |
      des participantes déclarent se sentir **plus en paix avec leur corps** après 4 séances.
    source: "Bilan des 6 premiers parcours (2024)"
    alignement: "gauche"
    couleur: "magenta"

  - type: "formats"
    titre: "📋 Formats (cartes riches)"
    colonnes: 2
    formats:
      - titre: "Atelier découverte"
        description: "Format court pour tester, sans engagement."
        points:
          - "2 h · groupe de 6-8 femmes"
          - "Auto-massages et toucher du consentement"
          - "Gratuit, sur orientation d'une structure partenaire"
        couleur: "orange"
        cta:
          label: "En savoir plus"
          href: "/pour/femmes"
      - titre: "Parcours complet"
        description: "5 séances en immersion sur 3 mois pour installer un vrai changement."
        points:
          - "5 × 2 h, avec les mêmes participantes"
          - "Temps de bilan intermédiaire"
          - "Animé en binôme pro + co-animatrice"
        couleur: "violet"

  - type: "cta"
    titre: "Bandeau CTA"
    corps: "Invite à passer à l'action — idéal en fin de page. Fond saturé par défaut (violet)."
    cta_primaire:
      label: "Action principale"
      href: "/contact"
    cta_secondaire:
      label: "Plus d'infos"
      href: "/pour"

  - type: "texte-photo"
    titre: "🖼 Texte + photo"
    texte: |
      Bloc **texte + photo** côte à côte. Par défaut la photo est à droite, mais peut être placée à gauche via l'option « Position ».

      Le **ratio** est configurable : 50-50, 2/3 texte + 1/3 photo, ou 1/3 texte + 2/3 photo — selon que le texte porte l'info ou que la photo doit dominer.

      Une **légende** et un **crédit** peuvent être ajoutés sous l'image.
    image: "https://picsum.photos/seed/mains1/800/600"
    image_alt: "Photo placeholder illustrant le bloc texte + photo."
    image_legende: "Exemple de légende"
    image_credit: "Lorem Picsum"
    position: "droite"
    ratio: "50-50"

  - type: "figure"
    image: "https://picsum.photos/seed/mains2/900/600"
    alt: "Photo placeholder centrée."
    legende: "Figure centrée — idéal pour illustrer un point précis dans un article."
    credit: "Lorem Picsum"
    taille: "moyenne"

  - type: "galerie"
    titre: "🖼 Galerie (3 colonnes)"
    fond: "beige"
    colonnes: 3
    lightbox: false
    images:
      - image: "https://picsum.photos/seed/mains3/600/450"
        alt: "Photo de groupe placeholder 1"
        legende: "Atelier découverte — 15 mai"
      - image: "https://picsum.photos/seed/mains4/600/450"
        alt: "Photo de groupe placeholder 2"
        legende: "Apéro bénévoles"
      - image: "https://picsum.photos/seed/mains5/600/450"
        alt: "Photo de groupe placeholder 3"
        legende: "Formation"
      - image: "https://picsum.photos/seed/mains6/600/450"
        alt: "Photo de groupe placeholder 4"
      - image: "https://picsum.photos/seed/mains7/600/450"
        alt: "Photo de groupe placeholder 5"
      - image: "https://picsum.photos/seed/mains8/600/450"
        alt: "Photo de groupe placeholder 6"

  - type: "galerie"
    titre: "🖼 Galerie avec lightbox (clic ouvre une modale)"
    colonnes: 4
    lightbox: true
    images:
      - image: "https://picsum.photos/seed/lb1/800/600"
        alt: "Photo lightbox 1"
        legende: "Vue 1"
      - image: "https://picsum.photos/seed/lb2/800/600"
        alt: "Photo lightbox 2"
        legende: "Vue 2"
      - image: "https://picsum.photos/seed/lb3/800/600"
        alt: "Photo lightbox 3"
        legende: "Vue 3"
      - image: "https://picsum.photos/seed/lb4/800/600"
        alt: "Photo lightbox 4"
        legende: "Vue 4"

  - type: "bandeau-image"
    image: "https://picsum.photos/seed/bandeau/1920/800"
    alt: "Bandeau pleine largeur placeholder."
    titre: "Bandeau image pleine largeur"
    sousTitre: "Pour ouvrir une section fortement ou servir de transition visuelle."
    hauteur: "moyenne"
    position_texte: "centre"
    position_verticale: "milieu"
    scrim: true

  - type: "portraits"
    titre: "👤 Portraits (3 colonnes, photos rondes)"
    fond: "beige"
    colonnes: 3
    forme: "rond"
    personnes:
      - nom: "Leïla Martin"
        role: "Présidente du CA"
        photo: "https://picsum.photos/seed/portrait1/400/400"
        photo_alt: "Portrait placeholder de Leïla Martin"
        bio: "Accompagne l'association depuis 2024. Formée en sciences sociales et travail social."
      - nom: "Claire Duval"
        role: "Trésorière"
        photo: "https://picsum.photos/seed/portrait2/400/400"
        photo_alt: "Portrait placeholder de Claire Duval"
        bio: "Praticienne du toucher, bénévole active dans le réseau des structures partenaires."
        lien: "https://example.com"
        lien_label: "Son site"
      - nom: "Soraya B."
        role: "Secrétaire"
        bio: "Sans photo — fallback avec initiales."

  - type: "timeline"
    titre: "📅 Timeline (frise chronologique)"
    alignement: "vertical"
    etapes:
      - date: "Printemps 2024"
        titre: "Fondation de l'association"
        texte: "Premier noyau de bénévoles, rédaction des statuts et dépôt en préfecture."
      - date: "Septembre 2024"
        titre: "Premier atelier découverte"
        texte: "5 femmes accueillies, en partenariat avec un foyer d'accueil de Lyon 3."
        image: "https://picsum.photos/seed/timeline1/600/400"
        image_alt: "Photo placeholder du premier atelier"
      - date: "Janvier 2025"
        titre: "Publication du projet associatif"
        texte: "Document de référence présenté à l'AG."
      - date: "Avril 2026"
        titre: "Mise en ligne du site"
        texte: "Nouveau canal public — blog, agenda, contact formulaire."

  - type: "prose"
    titre: "🧩 Composants hors blocs"
    body: |
      Certains éléments ne sont pas des « blocs » au sens CMS mais des composants globaux, visibles automatiquement :

      - **Hero** — bandeau en haut de chaque page (configurable dans le frontmatter)
      - **Breadcrumbs** — fil d'Ariane sous le header (dérivé automatiquement de l'URL)
      - **Banderole d'urgence** — message global en haut du site, activable dans les paramètres globaux (`content/site/settings.md`)
      - **Sommaire ancré (ToC)** — colonne à droite sur écrans larges, activable via le toggle `toc` dans le frontmatter d'une page

      Le composant `<Draft reason="...">` est visible sur la citation ci-dessus — toute entrée marquée `fictif: true` (ou entourée manuellement d'un `<Draft>`) affiche le ruban orange « À valider ».
---
