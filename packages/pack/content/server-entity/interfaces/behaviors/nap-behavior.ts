import { EntityFilters } from '../filters';
import { BehaviorPriority } from './behavior-priority';

/**
 * Allows mobs to occasionally stop and take a nap under certain conditions.
 */
export interface NapBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob while napping
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * Maximum time in seconds the mob has to wait before using the goal again
   * @default 0
   */
  cooldownMax?: number;

  /**
   * Minimum time in seconds the mob has to wait before using the goal again
   * @default 0
   */
  cooldownMin?: number;

  /**
   * The block distance in x and z that will be checked for mobs that this mob detects
   * @default 6
   */
  mobDetectDist?: number;

  /**
   * The block distance in y that will be checked for mobs that this mob detects
   * @default 6
   */
  mobDetectHeight?: number;

  /**
   * The filters that need to be met for the nap to take place
   */
  canNapFilters?: EntityFilters;

  /**
   * Filters that can trigger the entity to wake up from its nap
   */
  wakeMobExceptions?: EntityFilters;
}
