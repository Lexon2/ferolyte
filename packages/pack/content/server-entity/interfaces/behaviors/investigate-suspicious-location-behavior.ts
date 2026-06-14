import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to investigate suspicious locations.
 */
export interface InvestigateSuspiciousLocationBehavior extends BehaviorPriority {
  /**
   * Distance in blocks within the entity considers it has reached its target position
   * @default 1.5
   */
  goalRadius?: number;

  /**
   * Movement speed multiplier
   * @default 1
   */
  speedMultiplier?: number;
}
