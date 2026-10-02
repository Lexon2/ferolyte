import { SpawnRuleBuilder } from './spawn-rule-builder';
import type { SpawnRuleConfig } from './spawn-rule-types';

/** Spawn rule of an entity: `createSpawnRule({ identifier, populationControl, conditions: [{ weight: { default: 10 } }] })`. */
export const createSpawnRule = (config: SpawnRuleConfig): SpawnRuleBuilder =>
  new SpawnRuleBuilder(config);
