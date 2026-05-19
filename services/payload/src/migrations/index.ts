import * as migration_20260502_190808_initial from './20260502_190808_initial';
import * as migration_20260503_070220_phase6_auth from './20260503_070220_phase6_auth';
import * as migration_20260508_142701_drift_since_phase6 from './20260508_142701_drift_since_phase6';
import * as migration_20260516_200631_auto_20260516_230622 from './20260516_200631_auto_20260516_230622';
import * as migration_20260516_202821_auto_20260516_232814 from './20260516_202821_auto_20260516_232814';
import * as migration_20260518_154950_auto_20260518_184944 from './20260518_154950_auto_20260518_184944';
import * as migration_20260518_164916_split_site_global from './20260518_164916_split_site_global';
import * as migration_20260518_175855_equipe_temoignages_ids_to_relationship from './20260518_175855_equipe_temoignages_ids_to_relationship';
import * as migration_20260519_064537_add_prose_body_rich from './20260519_064537_add_prose_body_rich';
import * as migration_20260519_070000_add_all_rich_columns from './20260519_070000_add_all_rich_columns';
import * as migration_20260519_104853_migrate_prose_markdown_to_lexical from './20260519_104853_migrate_prose_markdown_to_lexical';
import * as migration_20260519_114844_migrate_long_blocks_to_lexical from './20260519_114844_migrate_long_blocks_to_lexical';
import * as migration_20260519_130548_migrate_short_blocks_to_lexical from './20260519_130548_migrate_short_blocks_to_lexical';
import * as migration_20260519_131205_migrate_collections_to_lexical from './20260519_131205_migrate_collections_to_lexical';
import * as migration_20260519_131605_migrate_globals_to_lexical from './20260519_131605_migrate_globals_to_lexical';
import * as migration_20260519_140442_migrate_temoignages_to_lexical from './20260519_140442_migrate_temoignages_to_lexical';

export const migrations = [
  {
    up: migration_20260502_190808_initial.up,
    down: migration_20260502_190808_initial.down,
    name: '20260502_190808_initial',
  },
  {
    up: migration_20260503_070220_phase6_auth.up,
    down: migration_20260503_070220_phase6_auth.down,
    name: '20260503_070220_phase6_auth',
  },
  {
    up: migration_20260508_142701_drift_since_phase6.up,
    down: migration_20260508_142701_drift_since_phase6.down,
    name: '20260508_142701_drift_since_phase6',
  },
  {
    up: migration_20260516_200631_auto_20260516_230622.up,
    down: migration_20260516_200631_auto_20260516_230622.down,
    name: '20260516_200631_auto_20260516_230622',
  },
  {
    up: migration_20260516_202821_auto_20260516_232814.up,
    down: migration_20260516_202821_auto_20260516_232814.down,
    name: '20260516_202821_auto_20260516_232814',
  },
  {
    up: migration_20260518_154950_auto_20260518_184944.up,
    down: migration_20260518_154950_auto_20260518_184944.down,
    name: '20260518_154950_auto_20260518_184944',
  },
  {
    up: migration_20260518_164916_split_site_global.up,
    down: migration_20260518_164916_split_site_global.down,
    name: '20260518_164916_split_site_global',
  },
  {
    up: migration_20260518_175855_equipe_temoignages_ids_to_relationship.up,
    down: migration_20260518_175855_equipe_temoignages_ids_to_relationship.down,
    name: '20260518_175855_equipe_temoignages_ids_to_relationship',
  },
  {
    up: migration_20260519_064537_add_prose_body_rich.up,
    down: migration_20260519_064537_add_prose_body_rich.down,
    name: '20260519_064537_add_prose_body_rich',
  },
  // Migration de schéma : ajoute toutes les colonnes *_rich jsonb +
  // DROP NOT NULL sur les anciens champs markdown qui étaient required.
  // Doit tourner AVANT toutes les migrations de données ci-dessous (qui
  // utilisent payload.find → Drizzle sélectionne les *_rich, qui doivent
  // exister en DB).
  {
    up: migration_20260519_070000_add_all_rich_columns.up,
    down: migration_20260519_070000_add_all_rich_columns.down,
    name: '20260519_070000_add_all_rich_columns',
  },
  {
    up: migration_20260519_104853_migrate_prose_markdown_to_lexical.up,
    down: migration_20260519_104853_migrate_prose_markdown_to_lexical.down,
    name: '20260519_104853_migrate_prose_markdown_to_lexical',
  },
  {
    up: migration_20260519_114844_migrate_long_blocks_to_lexical.up,
    down: migration_20260519_114844_migrate_long_blocks_to_lexical.down,
    name: '20260519_114844_migrate_long_blocks_to_lexical',
  },
  {
    up: migration_20260519_130548_migrate_short_blocks_to_lexical.up,
    down: migration_20260519_130548_migrate_short_blocks_to_lexical.down,
    name: '20260519_130548_migrate_short_blocks_to_lexical',
  },
  {
    up: migration_20260519_131205_migrate_collections_to_lexical.up,
    down: migration_20260519_131205_migrate_collections_to_lexical.down,
    name: '20260519_131205_migrate_collections_to_lexical',
  },
  {
    up: migration_20260519_131605_migrate_globals_to_lexical.up,
    down: migration_20260519_131605_migrate_globals_to_lexical.down,
    name: '20260519_131605_migrate_globals_to_lexical',
  },
  {
    up: migration_20260519_140442_migrate_temoignages_to_lexical.up,
    down: migration_20260519_140442_migrate_temoignages_to_lexical.down,
    name: '20260519_140442_migrate_temoignages_to_lexical',
  },
];
