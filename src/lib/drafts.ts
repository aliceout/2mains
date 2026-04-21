// Gestion du champ `draft` sur les collections CMS.
//
// Principe :
//   - `draft: true` sur une entrée = Audrey écrit encore, on ne publie pas.
//   - En prod (build sur GitHub Actions), les entrées draft sont exclues
//     des listings et des flux.
//   - En dev, elles restent visibles pour qu'Audrey voie son travail en
//     cours. Un petit badge « Brouillon » (composant DraftBadge) signale
//     qu'elles ne seraient pas publiées.
//
// À ne pas confondre avec `fictif` : `fictif` = contenu placeholder
// clairement faux, affiché avec un ruban orange « À valider ». `draft` =
// travail en cours, masqué en prod.

type WithDraft = { data: { draft?: boolean } };

export function filterPublished<T extends WithDraft>(items: T[]): T[] {
  if (import.meta.env.PROD) return items.filter((i) => !i.data.draft);
  return items;
}

export const SHOW_DRAFTS = !import.meta.env.PROD;
