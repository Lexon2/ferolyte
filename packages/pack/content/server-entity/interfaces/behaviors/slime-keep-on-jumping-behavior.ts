import { BehaviorPriority } from './behavior-priority';

/**
 * Can only be used by Slimes and Magma Cubes. Allows the mob to continuously jump around like a slime.
 */
export interface SlimeKeepOnJumpingBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier of the mob when using this AI Goal
   * @default 1.0
   */
  speedMultiplier?: number;
}
