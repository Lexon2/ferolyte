import { BehaviorPriority } from './behavior-priority';
import { ControlFlag } from '../../constants/control-flags';

/**
 * Allows Guardians, Iron Golems and Villagers to move within their pre-defined area that the mob should be restricted to.
 */
export interface MoveTowardsRestrictionBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob while moving towards its restriction
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * Control flags for the behavior
   */
  controlFlags?: ControlFlag[];
}
