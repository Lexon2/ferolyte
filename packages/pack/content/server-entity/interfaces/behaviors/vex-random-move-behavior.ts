import { BehaviorPriority } from './behavior-priority';
import { EntityDefinition } from '../../types/entity-types';

/**
 * Allows the mob to move around randomly like the Vex.
 */
export interface VexRandomMoveBehavior extends BehaviorPriority {
  /**
   * List of entities this mob can copy the owner from.
   */
  entityTypes?: EntityDefinition;
}
