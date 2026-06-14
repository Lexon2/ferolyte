import { BehaviorPriority } from './behavior-priority';

/**
 * Has the fish swim around when they can't pathfind.
 */
export interface SwimWanderBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier
   */
  speedMultiplier?: number;

  /**
   * Percent chance to start wandering, when not path-finding. 1 = 100%
   * @default 0.00833
   */
  interval?: number;

  /**
   * Distance to look ahead for obstacle avoidance, while wandering
   * @default 5
   */
  lookAhead?: number;

  /**
   * Amount of time (in seconds) to wander after wandering behavior was successfully started
   * @default 5
   */
  wanderTime?: number;
}
