import { BehaviorPriority } from './behavior-priority';

/**
 * Allow slimes to float in water / lava. Can only be used by Slime and Magma Cubes.
 */
export interface SlimeFloatBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier of the mob when using this AI Goal
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * Percent chance a slime or magma cube has to jump while in water / lava
   * @default 0.8
   */
  jumpChancePercentage?: number;
}
