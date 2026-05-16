import * as migration_20260502_190808_initial from './20260502_190808_initial';
import * as migration_20260503_070220_phase6_auth from './20260503_070220_phase6_auth';
import * as migration_20260508_142701_drift_since_phase6 from './20260508_142701_drift_since_phase6';
import * as migration_20260516_200631_auto_20260516_230622 from './20260516_200631_auto_20260516_230622';
import * as migration_20260516_202821_auto_20260516_232814 from './20260516_202821_auto_20260516_232814';

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
    name: '20260516_202821_auto_20260516_232814'
  },
];
