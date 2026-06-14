import { BehaviorPriority } from './behavior-priority';
import { EntityTypes } from '../../types/entity-types';

/**
 * Allows the mob to target the same entity its owner is targeting.
 */
export interface VexCopyOwnerTargetBehavior extends BehaviorPriority {
  /**
   * List of entities this mob can copy the owner from.
   */
  entityTypes?: EntityTypes;
}
