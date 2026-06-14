import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to randomly sit and look around for a duration. Note: Must have a sitting animation set up to use this.
 */
export interface RandomLookAroundAndSitBehavior extends BehaviorPriority {
  /**
   * If the goal should continue to be used as long as the mob is leashed
   * @default false
   */
  continueIfLeashed?: boolean;

  /**
   * The mob will stay sitting on reload
   * @default false
   */
  continueSittingOnReload?: boolean;

  /**
   * The rightmost angle a mob can look at on the horizontal plane with respect to its initial facing direction
   * @default 30.0
   */
  maxAngleOfViewHorizontal?: number;

  /**
   * The max amount of unique looks a mob will have while looking around
   * @default 2
   */
  maxLookCount?: number;

  /**
   * The max amount of time (in ticks) a mob will stay looking at a direction while looking around
   * @default 40
   */
  maxLookTime?: number;

  /**
   * The leftmost angle a mob can look at on the horizontal plane with respect to its initial facing direction
   * @default -30.0
   */
  minAngleOfViewHorizontal?: number;

  /**
   * The min amount of unique looks a mob will have while looking around
   * @default 1
   */
  minLookCount?: number;

  /**
   * The min amount of time (in ticks) a mob will stay looking at a direction while looking around
   * @default 20
   */
  minLookTime?: number;

  /**
   * The probability of randomly looking around/sitting
   * @default 0.02
   */
  probability?: number;

  /**
   * The cooldown in seconds before the goal can be used again
   * @default 0
   */
  randomLookAroundCooldown?: number;
}
