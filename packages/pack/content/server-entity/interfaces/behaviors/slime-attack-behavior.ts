import { BehaviorPriority } from './behavior-priority';

/**
 * Can only be used by Slimes and Magma Cubes. Allows the mob to use a melee attack like the slime's.
 */
export interface SlimeAttackBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier of the mob when using this AI Goal
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * Allows the actor to be set to persist upon targeting a player
   * @default false
   */
  setPersistent?: boolean;

  /**
   * Maximum rotation (in degrees), on the X-axis, this entity can rotate while trying to look at the target
   * @default 10
   */
  xMaxRotation?: number;

  /**
   * Maximum rotation (in degrees), on the Y-axis, this entity can rotate while trying to look at the target
   * @default 10
   */
  yMaxRotation?: number;
}
