import { BehaviorPriority } from './behavior-priority';

/**
 * This allows the mob to roll forward.
 */
export interface RollBehavior extends BehaviorPriority {
  /**
   * The probability that the mob will use the goal
   * @default 0.0
   */
  probability?: number;
}
