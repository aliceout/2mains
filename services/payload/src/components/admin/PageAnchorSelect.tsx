'use client';

// Custom field : menu déroulant qui liste les blocs de la page choisie
// dans le linkField frère (`link.page`), pour cibler une ancre précise.
//
// Audrey choisit une page via le champ "Page" (relationship), puis ce
// champ propose la liste des blocs de cette page par leur titre. La
// valeur stockée est l'id Payload du bloc (stable). Le frontend rend
// `id="bloc-<id>"` sur chaque bloc et resolveLink ajoute `#bloc-<id>`.
//
// Premier custom field du projet — pattern : useField (sa propre valeur)
// + useFormFields (lit le frère link.page) + SelectInput (rendu Payload).

import React, { useEffect, useState } from 'react';
import type { SelectFieldClientComponent, OptionObject } from 'payload';
import { useField, useFormFields, SelectInput, FieldLabel } from '@payloadcms/ui';

// Labels lisibles par type de bloc quand le bloc n'a pas de titre rempli.
const FALLBACK_LABELS: Record<string, string> = {
  prose: 'Texte',
  callout: 'Encadré',
  lettre: 'Lettre',
  citation: 'Citation',
  'citation-large': 'Citation',
  'stat-majeste': 'Statistique',
  'chiffre-detail': 'Chiffre',
  cartes: 'Grille de cartes',
  valeurs: 'Valeurs',
  formats: 'Formats',
  etapes: 'Étapes',
  faq: 'FAQ',
  stats: 'Chiffres clés',
  'deux-colonnes': 'Deux colonnes',
  'texte-photo': 'Texte + photo',
  figure: 'Image',
  galerie: 'Galerie',
  'bandeau-image': 'Bandeau image',
  portraits: 'Portraits',
  timeline: 'Timeline',
  temoignages: 'Témoignages',
  equipe: 'Équipe',
  cta: 'Bandeau bouton',
  'soutenir-home': 'Soutenir (accueil)',
};

type Block = {
  id?: string | number;
  blockType?: string;
  titre?: string | null;
  auteur?: string | null;
};

function labelForBlock(b: Block, index: number): string {
  const base =
    (typeof b.titre === 'string' && b.titre.trim()) ||
    ((b.blockType === 'citation' || b.blockType === 'citation-large') &&
    typeof b.auteur === 'string' &&
    b.auteur.trim()
      ? `Citation — ${b.auteur}`
      : '') ||
    (b.blockType ? FALLBACK_LABELS[b.blockType] ?? b.blockType : 'Bloc');
  return `${index + 1}. ${base}`;
}

const PageAnchorSelect: SelectFieldClientComponent = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path });

  // Le champ frère « page choisie » a deux noms selon le contexte :
  //  - linkField des boutons (group `link`)      → sibling `link.page`
  //  - drawer de lien de l'éditeur Lexical       → sibling `doc`
  // On lit les deux et on garde le premier non vide.
  const base = path.replace(/\.anchor$/, '');
  const pageId = useFormFields(([fields]) => {
    const fromLinkField = fields[`${base}.page`]?.value;
    const fromLexicalDoc =
      fields[`${base}.doc`]?.value ?? fields['doc']?.value;
    return (fromLinkField ?? fromLexicalDoc) as
      | string
      | number
      | { value: string | number }
      | null
      | undefined;
  });

  const [options, setOptions] = useState<OptionObject[]>([]);
  const [loading, setLoading] = useState(false);

  // Normalise : un relationship mono peut arriver en id brut ou {value}.
  const resolvedPageId =
    pageId && typeof pageId === 'object' ? pageId.value : pageId;

  useEffect(() => {
    if (!resolvedPageId) {
      setOptions([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/cms/api/pages/${resolvedPageId}?depth=0`, {
      credentials: 'include',
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { sections?: Block[] } | null) => {
        if (cancelled) return;
        const sections = Array.isArray(data?.sections) ? data!.sections : [];
        const opts: OptionObject[] = sections
          .filter((b) => b.id != null)
          .map((b, i) => ({ label: labelForBlock(b, i), value: String(b.id) }));
        setOptions(opts);
        // Reset si l'ancre stockée ne correspond plus à un bloc existant.
        if (value && !opts.some((o) => o.value === value)) {
          setValue(undefined);
        }
      })
      .catch(() => {
        if (!cancelled) setOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedPageId]);

  const label =
    (typeof field?.label === 'string' && field.label) || 'Aller à un bloc (optionnel)';

  return (
    <div className="field-type">
      <FieldLabel label={label} path={path} />
      <SelectInput
        name={path}
        path={path}
        options={options}
        value={value ?? undefined}
        onChange={(opt) => {
          const v = Array.isArray(opt) ? opt[0]?.value : opt?.value;
          setValue(v ?? undefined);
        }}
        isClearable
        readOnly={!resolvedPageId}
        placeholder={
          !resolvedPageId
            ? "Choisis d'abord une page"
            : loading
              ? 'Chargement…'
              : '— Haut de la page —'
        }
      />
    </div>
  );
};

export default PageAnchorSelect;
