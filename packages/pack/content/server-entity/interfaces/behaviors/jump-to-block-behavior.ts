import { BehaviorPriority } from './behavior-priority';

/**
 * Allows an entity to jump to another random block.
 */
export interface JumpToBlockBehavior extends BehaviorPriority {
  /**
   * Minimum and maximum cooldown time-range (positive, in seconds) between each attempted jump
   */
  cooldownRange?: [number, number];

  /**
   * Blocks that the mob can't jump to
   */
  forbiddenBlocks?: string[];

  /**
   * The maximum velocity with which the mob can jump
   * @default 1.5
   */
  maxVelocity?: number;

  /**
   * The minimum distance (in blocks) from the mob to a block, in order to consider jumping to it
   * @default 2
   */
  minimumDistance?: number;

  /**
   * The minimum length (in blocks) of the mobs path to a block, in order to consider jumping to it
   * @default 5
   */
  minimumPathLength?: number;

  /**
   * Blocks that the mob prefers jumping to
   */
  preferredBlocks?: string[];

  /**
   * Chance (between 0.0 and 1.0) that the mob will jump to a preferred block, if in range
   * @default 1.0
   */
  preferredBlocksChance?: number;

  /**
   * The scalefactor of the bounding box of the mob while it is jumping
   * @default 0.7
   */
  scaleFactor?: number;

  /**
   * The height (in blocks, in range [2, 15]) of the search box, centered around the mob
   * @default 10
   */
  searchHeight?: number;

  /**
   * The width (in blocks, in range [2, 15]) of the search box, centered around the mob
   * @default 8
   */
  searchWidth?: number;
}
