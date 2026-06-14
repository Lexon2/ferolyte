import { BehaviorPriority } from './behavior-priority';
import { EntityTypes } from '../../types/entity-types';

/**
 * Allows the mob to target another mob that hurt their owner.
 */
export interface OwnerHurtTargetBehavior extends BehaviorPriority {
  /**
   * List of entity types that this mob can target when they hurt the owner
   * @default []
   */
  entityTypes?: EntityTypes;
}
