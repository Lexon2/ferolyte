import type { SpawnRuleDocument } from '../generated/spawn-rule/documents';

/**
 * One spawn condition: generated from the schemas (`weight`, `densityLimit`, `biomeFilter`, `herd`, …).
 * `biomeFilter` and the other filters use the shared filter format (`anyOf`, `test`, `value`, …).
 */
export type SpawnRuleCondition = NonNullable<
  SpawnRuleDocument['spawnRules']['conditions']
>[number];

export interface SpawnRuleConfig {
  /** Identifier of the entity the rule applies to (`namespace:name`). */
  identifier: string;
  /** Spawn pool; the rule spawns as long as the pool has not reached its limit. */
  populationControl: NonNullable<
    SpawnRuleDocument['spawnRules']['description']
  >['populationControl'];
  conditions: SpawnRuleCondition[];
  /** Format version of the file. @default '1.8.0' */
  version?: string;
}
