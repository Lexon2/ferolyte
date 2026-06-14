import { BehaviorPriority } from './behavior-priority';

/**
 * [EXPERIMENTAL BEHAVIOR] Plays the provided sound and activates the `ROARING` actor flag during the specified duration
 */
export interface RoarBehavior extends BehaviorPriority {
  /**
   * Goal duration in seconds
   * @default 0.0
   */
  duration?: number;
}
