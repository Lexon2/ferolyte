import { BehaviorPriority } from './behavior-priority';

/**
 * Allows a mob to mingle with other mobs of the same type.
 */
export interface MingleBehavior extends BehaviorPriority {
  /**
   * The cooldown time in seconds before the goal can be used again
   * @default 0
   */
  cooldownTime?: number;

  /**
   * The distance in blocks that the mob will look for other mobs to mingle with
   * @default 2
   */
  mingleDistance?: number;

  /**
   * The time in seconds that the mob will mingle with other mobs
   * @default 1
   */
  mingleTime?: number;

  /**
   * The speed multiplier for the mob while mingling
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * The entity type that this entity is allowed to mingle with
   */
  minglePartnerType?: string | string[];
}
