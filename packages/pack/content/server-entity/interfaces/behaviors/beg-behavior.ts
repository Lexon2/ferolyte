import { BehaviorPriority } from './behavior-priority';

/**
 * Allows this mob to look at and follow the player that holds food they like
 */
export interface BegBehavior extends BehaviorPriority {
  /**
   * List of items that this mob likes
   */
  items?: string[];

  /**
   * Distance in blocks the mob will beg from
   * @default 8
   */
  lookDistance?: number;

  /**
   * The range of time in seconds this mob will stare at the player holding a food they like, begging for it
   * @default [2, 4]
   */
  lookTime?: [number, number] | number | { rangeMin: number; rangeMax: number };
}
