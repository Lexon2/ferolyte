import { BehaviorPriority } from './behavior-priority';

/**
 * Allows a mob to make use of items with a "minecraft:kinetic_weapon" item component.
 */
export interface UseKineticWeaponBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier
   */
  speedMultiplier?: number;

  /**
   * The distance to the target within which the mob begins using its kinetic weapon
   */
  approachDistance?: number;

  /**
   * The distance the mob retreats to once the target is closer than the midpoint of the item's reach
   */
  repositionDistance?: number;

  /**
   * The distance the mob retreats to after all max_duration values have elapsed
   */
  cooldownDistance?: number;

  /**
   * Multiplier applied to the mob's movement speed while repositioning
   */
  repositionSpeedMultiplier?: number;

  /**
   * Multiplier applied to the mob's movement speed while on cooldown
   */
  cooldownSpeedMultiplier?: number;

  /**
   * Multiplier applied to the item's kinetic_weapon reach
   */
  weaponReachMultiplier?: number;

  /**
   * Multiplier applied to each min_speed and min_relative_speed condition in the item's kinetic_weapon component
   */
  weaponMinSpeedMultiplier?: number;

  /**
   * Maximum base time (in seconds) to recalculate new attack path to target (before increases applied)
   * @default 0.55
   */
  maxPathTime?: number;

  /**
   * Field of view (in degrees) when using the sensing component to detect an attack target
   * @default 90
   */
  meleeFov?: number;

  /**
   * Minimum base time (in seconds) to recalculate new attack path to target (before increases applied)
   * @default 0.2
   */
  minPathTime?: number;

  /**
   * Time (in seconds) to add to attack path recalculation when the target is beyond the path_outer_boundary
   * @default 0.5
   */
  outerBoundaryTimeIncrease?: number;

  /**
   * Time (in seconds) to add to attack path recalculation when this entity cannot move along the current path
   * @default 0.75
   */
  pathFailTimeIncrease?: number;

  /**
   * Distance at which to increase attack path recalculation by inner_boundary_tick_increase
   * @default 16
   */
  pathInnerBoundary?: number;

  /**
   * Distance at which to increase attack path recalculation by outer_boundary_tick_increase
   * @default 32
   */
  pathOuterBoundary?: number;

  /**
   * Specifies whether a full navigation path from the mob to the target is required
   * @default false
   */
  requireCompletePath?: boolean;

  /**
   * Allows the entity to track the attack target, even if the entity has no sensing
   * @default false
   */
  trackTarget?: boolean;

  /**
   * Cooldown time (in seconds) between attacks
   * @default 1
   */
  cooldownTime?: number;

  /**
   * Maximum rotation (in degrees), on the X-axis, this entity can rotate while trying to look at the target
   * @default 30
   */
  xMaxRotation?: number;

  /**
   * Maximum rotation (in degrees), on the Y-axis, this entity can rotate its head while trying to look at the target
   * @default 30
   */
  yMaxHeadRotation?: number;

  /**
   * This entity will have a 1 in N chance to stop its current attack, where N = random_stop_interval
   * @default 0
   */
  randomStopInterval?: number;

  /**
   * Allows the entity to use this attack behavior, only once EVER
   * @default false
   */
  attackOnce?: boolean;

  /**
   * Allows a mob to override its mount's navigation behavior with the one defined by this goal
   */
  hijackMountNavigation?: boolean;
}
