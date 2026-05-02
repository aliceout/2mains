import * as migration_20260502_190808_initial from './20260502_190808_initial';

export const migrations = [
  {
    up: migration_20260502_190808_initial.up,
    down: migration_20260502_190808_initial.down,
    name: '20260502_190808_initial'
  },
];
