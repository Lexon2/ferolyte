import { BehaviorPriority } from './behavior-priority';

/**
 * The material the mob is traveling in. An air block will only be considered valid to move to with a block of this material below it.
 */
export type MaterialType = 'water' | 'lava' | 'any';

/**
 * Allows the mob to try to move to air once it is close to running out of its total breathable supply.
 */
export interface SwimUpForBreathBehavior extends BehaviorPriority {
  /**
   * The material the mob is traveling in. An air block will only be considered valid to move to with a block of this material below it
   * @default 'water'
   */
  materialType?: MaterialType;

  /**
   * The height (in blocks) above the mob's current position that it will search for a valid air block to move to. If a valid block cannot be found, the mob will move to the position this many blocks above it
   * @default 16
   */
  searchHeight?: number;

  /**
   * The radius (in blocks) around the mob's current position that it will search for a valid air block to move to
   * @default 4
   */
  searchRadius?: number;

  /**
   * Movement speed multiplier of the mob when using this Goal
   * @default 1.4
   */
  speedMod?: number;
}
