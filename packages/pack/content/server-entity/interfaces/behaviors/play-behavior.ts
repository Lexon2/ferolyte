import { EntityFilters } from '../filters';
import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to play with other baby villagers. This can only be used by Villagers.
 */
export interface PlayBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier of the mob when using this AI Goal
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * The chance that the mob will start this goal
   * @default 0.0
   */
  chanceToStart?: number;

  /**
   * The distance that the mob tries to be in range of the friend it's following
   * @default 2
   */
  followDistance?: number;

  /**
   * The dimensions of the AABB used to search for a potential friend to play with
   * @default [6, 3, 6]
   */
  friendSearchArea?: [number, number, number];

  /**
   * The entity type(s) to consider when searching for a potential friend to play with
   * @default []
   */
  friendTypes?: EntityFilters[];

  /**
   * The maximum amount of seconds that the mob will play for before exiting the Goal
   * @default 50.0
   */
  maxPlayDurationSeconds?: number;

  /**
   * The height (in blocks) that the mob will search within to find a random position position to move to. Must be at least 1.
   * @default 3
   */
  randomPosSearchHeight?: number;

  /**
   * The distance (in blocks) on ground that the mob will search within to find a random position to move to. Must be at least 1.
   * @default 16
   */
  randomPosSearchRange?: number;
}
