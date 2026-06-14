import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the a mob to become scared when the weather outside is thundering.
 */
export interface ScaredBehavior extends BehaviorPriority {
  /**
   * The interval in which a sound will play when active in a 1/delay chance to kick off
   * @default 0
   */
  soundInterval?: number;
}
