import { BehaviorPriority } from './behavior-priority';

/**
 * Allows Equine mobs to be Horse Traps and be triggered like them, spawning a lightning bolt and a bunch of horses when a player is nearby.
 * Can only be used by Horses, Mules, Donkeys and Skeleton Horses.
 */
export interface SkeletonHorseTrapBehavior extends BehaviorPriority {
  /**
   * Amount of time in seconds the trap exists. After this amount of time is elapsed, the trap is removed from the world if it hasn't been activated
   * @default 1
   */
  duration?: number;

  /**
   * Distance in blocks that the player has to be within to trigger the horse trap
   * @default 0
   */
  withinRadius?: number;
}
