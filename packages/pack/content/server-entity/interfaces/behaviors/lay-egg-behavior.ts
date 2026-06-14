import { BehaviorPriority } from './behavior-priority';
import { EntityEventTrigger } from '../trigger';

/**
 * Target materials that can exist above the target block
 */
export type TargetMaterial = 'Air' | 'Any' | 'Lava' | 'Water';

/**
 * Allows the mob to lay an egg block on a sand block if the mob is pregnant.
 */
export interface LayEggBehavior extends BehaviorPriority {
  /**
   * The speed multiplier
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * [EXPERIMENTAL] Allows the mob to lay its eggs from below the target if it can't get there
   * @default false
   */
  allowLayingFromBelow?: boolean;

  /**
   * [EXPERIMENTAL] Block type for the egg to lay. If this is a turtle egg, the number of eggs in the block is randomly set
   * @default "minecraft:turtle_egg"
   */
  eggType?: string;

  /**
   * Distance in blocks within the mob considers it has reached the goal
   * @default 0.5
   */
  goalRadius?: number;

  /**
   * Sound event name for laying egg. Defaulted to lay_egg which is used for Turtles
   * @default "lay_egg"
   */
  layEggSound?: string;

  /**
   * Duration of the laying egg process in seconds
   * @default 10.0
   */
  laySeconds?: number;

  /**
   * Event to run when this mob lays the egg
   */
  onLay?: EntityEventTrigger;

  /**
   * Height in blocks the mob will look for a target block to move towards
   * @default 1
   */
  searchHeight?: number;

  /**
   * The distance in blocks it will look for a target block to move towards
   * @default 0
   */
  searchRange?: number;

  /**
   * Blocks that the mob can lay its eggs on top of
   * @default ["minecraft:sand"]
   */
  targetBlocks?: string[];

  /**
   * Types of materials that can exist above the target block
   * @default ["Air"]
   */
  targetMaterialsAboveBlock?: TargetMaterial[];

  /**
   * Specifies if the default lay-egg animation should be played when the egg is placed or not
   * @default true
   */
  useDefaultAnimation?: boolean;
}
