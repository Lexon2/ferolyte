import { EntityFilters } from '../../filters';

/**
 * Interface for the trail component
 * Defines the entity's trail to carry items
 */
export interface TrailComponent {
  /**
   * The type of block you wish to be spawned by the entity as it move about the world
   * Solid blocks may not be spawned at an offset of ()
   * @default "air"
   */
  blockType?: string;

  /**
   * One or more conditions that must be met in order to cause the chosen block type to spawn
   */
  spawnFilter?: EntityFilters;

  /**
   * The distance from the entities current position to spawn the block
   * Capped at up to 16 blocks away
   * The X value is left/right(-/+), the Z value is backward/forward(-/+), the Y value is below/above(-/+)
   * @default [0, 0, 0]
   */
  spawnOffset?: [number, number, number];
}
