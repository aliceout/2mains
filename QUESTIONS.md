# Questions à trancher avant de démarrer

Questions issues de la lecture de `2mains-site-plan.md`, `ROADMAP.md`, des échanges WhatsApp et des docs annexes. Organisées par famille. Merci de répondre inline (soit ici en éditant, soit dans un message séparé — ce qui t'arrange).

Légende : 🔴 bloquant avant Phase 1 · 🟠 bloquant avant Phase 3 · 🟡 à trancher avant Phase 5 · 🔵 confort / v2

---

## 1. Stratégie et périmètre

**1.1** 🟠 Le point sensible de la discussion du 16/10/2025 avec Méril et moi (inclusion des trans fem, non-binaires, mecs trans socialisé·es filles) a-t-il été discuté au CA depuis ? Quelle est la position actée pour le site public ?
- [ ] On garde « femmes » avec une note de contexte (celle du leaflet actuel)
- [ ] On élargit le vocabulaire (« personnes concernées par les violences basées sur le genre », « personnes se reconnaissant du spectre féminin »…)
- [ ] On ne tranche pas maintenant, j'utilise une formulation temporaire que tu valideras au cas par cas
- [ ] Autre : ____

**1.2** 🟠 Le projet LHM met l'accent sur les femmes en QPV. Le site doit-il communiquer ce focus territorial ou rester généraliste « métropole de Lyon » ?

**1.3** 🟠 Est-ce que le site doit afficher *l'offre de services payante* (aux structures, aux entreprises) ou rester volontairement en retrait pour éviter les grincements d'asso/financeurs (cf. ta remarque du 16/10 sur « offre de service » qui peut faire tiquer) ?

**1.4** 🟡 Banderole d'urgence en haut de site (appel à don, événement fort) : on la prévoit dès le début (activable/désactivable via CMS) ou on attend un vrai besoin ?

---

## 2. Éditorial

**2.1** 🟠 Ton : tutoiement, vouvoiement, ou mix (tutoiement sur les pages « pour femmes », vouvoiement sur « structures/entreprises ») ?

**2.2** 🟠 Écriture inclusive : point médian systématique, doublet (celles et ceux), neutre (personnes), ou combinaison ? (Ta `fiche memo` utilise déjà des formes variées.)

**2.3** 🟠 Nom de l'asso : strict **« 2mains de femmes »** partout (confirmé WhatsApp 28/09) ?

**2.4** 🟡 Témoignages : as-tu des paroles réelles (participantes, partenaires) utilisables avec accord écrit ? Ou on part sur un encart « témoignages à venir » ?

---

## 3. Contenu

**3.1** 🟠 État d'avancement des pages autres que « L'association » ? Ton message du 18/03 indique qu'il n'y a que celle-là. Je propose :
- Moi je **rédige les brouillons** des pages manquantes à partir du doc LHM, de la fiche de structure et du leaflet, avec marques `[À VALIDER]` sur les parties qui te demandent un arbitrage.
- Tu relis et valides.
- [ ] OK / [ ] Pas OK (tu veux garder la main sur la rédac)

**3.2** 🟠 Page « Documents » : quels PDFs à mettre en ligne *au lancement* ?
- [ ] Fiche de structure (Annexe 1)
- [ ] Leaflet (Annexe 5)
- [ ] Document de projet LHM 2025
- [ ] Projet associatif (une fois finalisé)
- [ ] Rapport d'activité 2024-2025 ? (existe-t-il ?)
- [ ] Autres : ____

**3.3** 🟡 Agenda : as-tu **au moins 1 événement réel** à publier au lancement pour que la page ne soit pas vide ? Sinon on met en cache 2 événements « démo » signalés comme tels ?

**3.4** 🟠 Mentions légales : il me faut **SIREN, numéro RNA (W…), nom du directeur de publication** (toi ?), hébergeur (moi, mon adresse perso OK ou une adresse de domiciliation ?).

---

## 4. Fonctionnalités

**4.1** 🟠 **Formulaire de contact** : OK pour un formulaire natif qui envoie un mail à `contact@2mainsdefemmes.org` via SMTP Ksuite ? (Alternative : juste afficher l'email en clair + lien `mailto:`.)

**4.2** 🟠 **Formulaire bénévoles** :
- [ ] On garde le Forms existant (`forms.office.com/r/32MgiHRm86`) — simple, zéro dev
- [ ] On refait en natif sur le site — mieux intégré, plus de travail
- [ ] Sur le site on met juste un CTA vers Forms, on verra plus tard

**4.3** 🟠 **Formulaire praticien·nes solidaires** : idem que bénévoles. Forms séparé ou CTA simple « écrivez-nous » ?

**4.4** 🟠 **HelloAsso — page don** : cf. mon message du 09/10/2025. La page unique actuelle mélange adhésion et don. Est-ce que tu as créé / peux créer une **page don dédiée** sur HelloAsso ? Sinon on met le lien adhésion et on s'en contente.

**4.5** 🟡 **Newsletter** : on en fait une ?
- [ ] HelloAsso propose un outil newsletter intégré, on s'en sert
- [ ] On met juste un lien / formulaire qui stocke les emails dans le repo (moyen mais possible)
- [ ] Pas de newsletter au lancement

**4.6** 🔵 « Lecture facile » (version simplifiée des pages clés) : cf. plan. Pour la v2 ?

---

## 5. Choix techniques

**5.1** 🔴 **Repo git** : Gitea self-hosted sur mon serveur, ou GitHub privé ?
- Gitea : cohérent self-host, 1 container de plus à maintenir. Le CMS marche bien avec Gitea (backend `gitea`).
- GitHub : zéro maintenance, auth plus simple. Public ou privé ? Privé par défaut.
- Recommandation : **GitHub privé** pour aller vite en v1, migration Gitea possible plus tard.

**5.2** 🔴 **Hébergement** : confirmation que j'utilise **mon serveur perso** (comme actuellement pour le WP) avec Docker + Nginx. Si un jour tu veux reprendre l'hébergement côté asso, on migrera — mais pour l'instant c'est moi.

**5.3** 🔴 **URL de preview** : pendant la construction, j'utilise un sous-domaine tant que le WP tourne encore. Tu préfères `preview.2mainsdefemmes.org` (DNS à configurer) ou un domaine à moi (`2mdf.alyss.cc` par ex.) ?

**5.4** 🟡 **Analytics** :
- [ ] Rien (recommandé pour v1 — on vit très bien sans)
- [ ] Plausible self-hosted sur mon serveur (~1h de setup)
- [ ] Umami self-hosted sur mon serveur (idem)

**5.5** 🟡 **Monitoring uptime** : je mets un Uptime Kuma basique. OK ?

**5.6** 🔵 **CMS auth** : GitHub OAuth via proxy Docker (`sveltia-cms-auth`). Je te créerai un compte GitHub si tu n'en as pas (ça prend 2 min), c'est ce qui te servira à te connecter au CMS. OK ?

---

## 6. Workflow et planning

**6.1** 🔴 **Nouvelle date cible** pour le lancement ? L'AG du 7/03 est passée. Propositions :
- [ ] AG d'automne / fin 2026
- [ ] Événement de communication précis (date ?)
- [ ] Rolling — on déploie par lots, pas de deadline dure
- [ ] Autre : ____

**6.2** 🟠 **Rythme de travail** : je suis sur Mada, il y a du décalage et parfois des semaines hors ligne. Quelle cadence tu préfères ?
- [ ] Envois de contenus au fil de l'eau, je les intègre dès que dispo
- [ ] Lots de contenus + points visio mensuels
- [ ] Un gros sprint concentré (2–3 semaines pleines) + finitions

**6.3** 🟠 **Validation** : qui valide côté CA à part toi ? (Sylvie, Elsa, ou tu prends seule ?)

**6.4** 🟡 **Formation CMS** : tu peux bloquer 30–45 min de visio une fois le site MVP en ligne pour que je t'apprenne à ajouter événement / partenaire / modifier texte ?

---

## 7. Décommissionnement WordPress

**7.1** 🟠 Le WP actuel sur `2mainsdefemmes.org` est vide. Tu confirmes qu'on peut **le supprimer sans sauvegarde** (je n'ai jamais rien publié dessus) ?

**7.2** 🟠 Le thème Salient acheté 60€ — on le garde comme backup théorique ou on l'oublie ? (Je propose de l'oublier, il n'est pas réutilisable dans la nouvelle stack.)

---

## 8. Juridique et administratif

**8.1** 🟠 **SIREN** et **RNA (W…)** de l'asso : tu peux me les transmettre ?

**8.2** 🟠 **DPO / contact RGPD** : toi, personne d'autre ?

**8.3** 🟠 **Politique de confidentialité** : tu en as une rédigée quelque part, ou j'en rédige un brouillon basé sur « pas de tracker, pas de cookie, formulaire contact = données transmises par mail » que tu valideras ?

**8.4** 🔵 **Mentions légales hébergeur** : si tu ne veux pas que mon adresse perso figure publiquement, il faudra passer par une domiciliation. On peut reparler.

---

## 9. Ce que je vais supposer par défaut sans ta réponse

Pour ne pas être bloqué, voici mes valeurs par défaut si tu ne réponds pas sur ces points :

- Ton : **vouvoiement général**, tutoiement uniquement sur « Pour une femme concernée ».
- Inclusif : **doublets ou neutre**, pas de point médian systématique.
- Formulaire contact : **natif + SMTP Ksuite**.
- Formulaire bénévoles : **lien vers Forms existant** pour la v1.
- Analytics : **aucun**.
- Repo : **GitHub privé**.
- URL preview : **sous-domaine à moi** le temps de la construction.
- Banderole : prévue dans le code, désactivée par défaut.
- Newsletter : pas au lancement.
