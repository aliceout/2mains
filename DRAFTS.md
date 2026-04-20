# Statut du contenu — ce qu'il reste à valider

Ce fichier récapitule ce qui est marqué comme **fictif / provisoire** dans le site. Pour le
voir dans le navigateur : la page `/status` liste la même chose en vivant, et chaque zone est
entourée d'un ruban orange « À valider » directement sur les pages concernées.

## Comment ça marche

Chaque contenu inventé ou provisoire est entouré du composant `<Draft reason="...">`. Ça :

1. **Rend visible** le contenu à valider par un ruban orange + une bordure pointillée.
2. **Permet un audit** automatique sur la page `/status` et via `grep`.

### Pour valider un bloc

1. Remplacer le contenu intérieur par du contenu vérifié.
2. Retirer le wrapper `<Draft>`.
3. Retirer l'import si plus utilisé.

### Pour scanner manuellement

```bash
grep -rn "<Draft" src/pages
```

## Ce qui est actuellement marqué

| Page                    | Zone                                                      | Nature |
| ----------------------- | --------------------------------------------------------- | ------ |
| `/`                     | Citation (Marion)                                         | Fictif |
| `/`                     | Encart « Prochains rendez-vous » (3 événements)           | Fictif |
| `/agenda`               | 4 événements à venir                                      | Fictif |
| `/pour/temoignages`     | 4 paroles de participantes                                | Fictif |
| `/pour/temoignages`     | 2 paroles de partenaires                                  | Fictif |
| `/pour/temoignages`     | 2 paroles de professionnel·les                            | Fictif |
| `/pour/femmes`          | Citation participante                                     | Fictif |
| `/pour/structures`      | Citation partenaire                                       | Fictif |
| `/contact`              | Formulaire en mode `mailto:` (pas de backend SMTP)        | Provisoire |
| `/mentions-legales`     | SIREN, numéro RNA                                         | À récupérer |
| `/mentions-legales`     | Identité hébergeur                                        | À arbitrer |

## Contenu vérifié (déjà bon)

Ne pas toucher sans raison — ces contenus viennent directement des docs de l'asso :

- Mission, vision, valeurs, 4 principes — `fiche-memo-fondamentaux.docx` + `page-association.docx`
- 3 axes d'intervention, méthode, parcours type, publics prioritaires — `page-association.docx` + `doc-projet-LHM-2025.pdf`
- Chiffres (7M+, 11%, 40%, 321 000, 1 400 TdS…) — `doc-projet-LHM-2025.pdf` + `annexe-1-fiche-de-structure.pdf`
- Composition du CA (8 membres) — `annexe-3-composition-ca.pdf`
- Partenaires et financeurs listés — `doc-projet-LHM-2025.pdf`
- 4 commissions techniques — `annexe-1-fiche-de-structure.pdf`
- Profils bénévoles (3 profils) — `mail-reseau-benevoles.docx`

## Masquer les marques en prod

Quand on veut passer en prod « propre » sans rubans, deux options :

- **Option par bloc** : passer `hide` au composant (`<Draft reason="..." hide>`).
- **Option globale** : remplacer les `<Draft>` par leurs children (ou wrap conditionnel via
  une variable d'env si on en arrive là). Pour l'instant, on garde visible — c'est plus
  honnête et ça facilite la relecture d'Audrey.
