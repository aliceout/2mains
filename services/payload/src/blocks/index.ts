// Library de blocs Payload — exports centralisés.
//
// Chaque bloc reproduit le schéma d'une section CMS de l'ancien
// `content.config.ts` Astro, avec le même `slug` (= ancien `type`)
// pour que la migration Phase 2 soit un mapping 1:1 sans renommage.
//
// 23 blocs au total, groupés par usage logique pour la lisibilité.

// Lot A — texte simple
import { Prose } from './Prose';
import { Callout } from './Callout';
import { Lettre } from './Lettre';

// Lot B — citations / chiffres mis en valeur
import { Citation } from './Citation';
import { CitationLarge } from './CitationLarge';
import { StatMajeste } from './StatMajeste';
import { ChiffreDetail } from './ChiffreDetail';

// Lot C — grilles avec items répétés
import { BlocCartes } from './BlocCartes';
import { BlocValeurs } from './BlocValeurs';
import { Formats } from './Formats';
import { Etapes } from './Etapes';
import { Faq } from './Faq';
import { BlocStat } from './BlocStat';

// Lot D — image + texte
import { DeuxColonnes } from './DeuxColonnes';
import { TextePhoto } from './TextePhoto';
import { Figure } from './Figure';
import { Galerie } from './Galerie';
import { BandeauImage } from './BandeauImage';

// Lot E — relations + CTA
import { Portraits } from './Portraits';
import { Timeline } from './Timeline';
import { Temoignages } from './Temoignages';
import { Equipe } from './Equipe';
import { Cta } from './Cta';

export const allBlocks = [
  Prose,
  Callout,
  Lettre,
  Citation,
  CitationLarge,
  StatMajeste,
  ChiffreDetail,
  BlocCartes,
  BlocValeurs,
  Formats,
  Etapes,
  Faq,
  BlocStat,
  DeuxColonnes,
  TextePhoto,
  Figure,
  Galerie,
  BandeauImage,
  Portraits,
  Timeline,
  Temoignages,
  Equipe,
  Cta,
];

export {
  Prose,
  Callout,
  Lettre,
  Citation,
  CitationLarge,
  StatMajeste,
  ChiffreDetail,
  BlocCartes,
  BlocValeurs,
  Formats,
  Etapes,
  Faq,
  BlocStat,
  DeuxColonnes,
  TextePhoto,
  Figure,
  Galerie,
  BandeauImage,
  Portraits,
  Timeline,
  Temoignages,
  Equipe,
  Cta,
};
