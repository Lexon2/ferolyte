import { BehaviorPriority } from './behavior-priority';
import { EntityDefinition } from '../../types/entity-types';

/**
 * Allows the wither to focus its attacks on whichever mob has dealt the most damage to it. Can only be used by the Wither Boss.
 */
export interface WitherTargetHighestDamageBehavior extends BehaviorPriority {
  /**
   * List of entity types the wither takes into account to find who dealt the most damage to it
   */
  entityTypes?: EntityDefinition;
}
