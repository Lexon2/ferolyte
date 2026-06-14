import { BehaviorPriority } from './behavior-priority';

/**
 * Allows mobs to lay down at times.
 */
export interface LayDownBehavior extends BehaviorPriority {
  /**
   * A random value to determine at what intervals something can occur. This has a 1/interval chance to choose this goal
   * @default 120
   */
  interval?: number;

  /**
   * A random value in which the goal can use to pull out of the behavior. This is a 1/interval chance to play the sound
   * @default 120
   */
  randomStopInterval?: number;
}
