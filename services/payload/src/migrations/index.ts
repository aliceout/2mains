import * as migration_20260502_190808_initial from './20260502_190808_initial';
import * as migration_20260503_070220_phase6_auth from './20260503_070220_phase6_auth';
import * as migration_20260508_142701_drift_since_phase6 from './20260508_142701_drift_since_phase6';
import * as migration_20260516_200631_auto_20260516_230622 from './20260516_200631_auto_20260516_230622';
import * as migration_20260516_202821_auto_20260516_232814 from './20260516_202821_auto_20260516_232814';
import * as migration_20260518_154950_auto_20260518_184944 from './20260518_154950_auto_20260518_184944';
import * as migration_20260518_164916_split_site_global from './20260518_164916_split_site_global';
import * as migration_20260518_175855_equipe_temoignages_ids_to_relationship from './20260518_175855_equipe_temoignages_ids_to_relationship';
import * as migration_20260519_064537_add_prose_body_rich from './20260519_064537_add_prose_body_rich';

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
    name: '20260519_064537_add_prose_body_rich'
  },
];
