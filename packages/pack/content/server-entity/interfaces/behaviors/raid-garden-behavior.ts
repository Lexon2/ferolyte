import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to eat/raid crops out of farms until they are full.
 */
export interface RaidGardenBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier of the mob when using this AI Goal
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * Blocks that the mob is looking for to eat
   */
  blocks?: string[];

  /**
   * Time in seconds between each time it eats
   * @default 2
   */
  eatDelay?: number;

  /**
   * Amount of time in seconds before this mob wants to eat again
   * @default 100
   */
  fullDelay?: number;

  /**
   * Time in seconds before starting to eat/raid once it arrives at it
   * @default 0
   */
  initialEatDelay?: number;

  /**
   * Distance in blocks within the mob considers it has reached the goal
   * @default 0.5
   */
  goalRadius?: number;

  /**
   * Maximum number of things this entity wants to eat
   * @default 6
   */
  maxToEat?: number;

  /**
   * Distance in blocks the mob will look for crops to eat
   * @default 0
   */
  searchRange?: number;

  /**
   * Height in blocks the mob will look for crops to eat
   * @default 0
   */
  searchHeight?: number;
}
