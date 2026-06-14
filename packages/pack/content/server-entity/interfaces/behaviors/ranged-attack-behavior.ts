import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to use ranged attacks like shooting arrows.
 */
export interface RangedAttackBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob's movement.
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * The entity's attack interval in ticks
   * @default 0
   */
  attackInterval?: number;

  /**
   * The entity's attack interval maximum in ticks
   * @default 0
   */
  attackIntervalMax?: number;

  /**
   * The entity's attack interval minimum in ticks
   * @default 0
   */
  attackIntervalMin?: number;

  /**
   * The entity's attack radius
   * @default 0.0
   */
  attackRadius?: number;

  /**
   * The entity's attack radius minimum
   * @default 0.0
   */
  attackRadiusMin?: number;

  /**
   * The time between each individual shot when firing a burst of shots from a charged up attack.
   * @default 0.0
   */
  burstInterval?: number;

  /**
   * The number of shots fired every time the attacking entity uses a charged up attack.
   * @default 1
   */
  burstShots?: number;

  /**
   * The time before a charged up attack is done charging. Charge-time decays while target is not in sight.
   * @default 0.0
   */
  chargeChargedTrigger?: number;

  /**
   * The time before a charged up attack is done charging. Charge-time decays while target is not in sight.
   * @default 0.0
   */
  chargeShootTrigger?: number;

  /**
   * The field of view (in degrees) when using sensing to detect a target for attack.
   * @default 90
   */
  rangedFov?: number;

  /**
   * Allows the actor to be set to persist upon targeting a player.
   * @default false
   */
  setPersistent?: boolean;

  /**
   * If a swing animation (using variable.attack_time) exists, this causes the actor to swing their arm(s) upon firing the ranged attack.
   * @default false
   */
  swing?: boolean;

  /**
   * The minimum amount of time the attacking entity needs to see the target before moving toward it.
   * @default 1
   */
  targetInSightTime?: number;

  /**
   * The maximum rotation (in degrees), on the X-axis, this entity can rotate while trying to look at the target.
   * @default 30
   */
  xMaxRotation?: number;

  /**
   * The maximum rotation (in degrees), on the Y-axis, this entity can rotate its head while trying to look at the target.
   * @default 30
   */
  yMaxHeadRotation?: number;
}
