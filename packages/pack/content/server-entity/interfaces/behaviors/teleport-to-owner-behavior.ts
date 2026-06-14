import { BehaviorPriority } from './behavior-priority';
import { EntityFilters } from '../filters';

/**
 * Allows an entity to teleport to its owner.
 */
export interface TeleportToOwnerBehavior extends BehaviorPriority {
  /**
   * The time in seconds that must pass for the entity to be able to try to teleport again
   * @default 1.0
   */
  cooldown?: number;

  /**
   * Conditions to be satisfied for the entity to teleport to its owner
   */
  filters?: EntityFilters;
}
