import { BehaviorPriority } from './behavior-priority';
import { EntityTypes } from '../../types/entity-types';

/**
 * Allows an entity to select a valid target entity that pushed it.
 */
export interface TargetWhenPushedBehavior extends BehaviorPriority {
  /**
   * The list of conditions the other entity must meet to be a valid target.
   */
  entityTypes?: EntityTypes;

  /**
   * Probability that the entity will target the entity that pushed it.
   * @default 5.0
   */
  percentChance?: number;
}
