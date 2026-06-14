import { BehaviorPriority } from './behavior-priority';
import { EntityTypes } from '../../types/entity-types';

/**
 * Allows the entity to stay in a village and defend the village from aggressors
 * If a player is in bad standing with the village this goal will cause the entity to attack the player
 * regardless of filter conditions
 */
export interface DefendVillageTargetBehavior extends BehaviorPriority {
  /**
   * List of entity types this mob considers a threat to the village
   */
  entityTypes?: EntityTypes;

  /**
   * The entity must be able to reach attacker
   */
  mustReach?: boolean;

  /**
   * The percentage chance that the entity has to attack aggressors of its village, where 1.0 = 100%
   * @default 0.05
   */
  attackChance?: number;
}
