import { BehaviorPriority } from './behavior-priority';
import { EntityTypes } from '../../types/entity-types';

/**
 * Allows the mob to target another mob that hurts them.
 */
export interface HurtByTargetBehavior extends BehaviorPriority {
  /**
   * List of entity types that this mob can target if they hurt their owner
   */
  entityTypes?: EntityTypes;

  /**
   * If true, nearby mobs of the same type will be alerted about the damage
   * @default false
   */
  alertSameType?: boolean;

  /**
   * If true, the mob will hurt its owner and other mobs with the same owner as itself
   * @default false
   */
  hurtOwner?: boolean;
}
