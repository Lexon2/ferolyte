import { BehaviorPriority } from './behavior-priority';
import { EntityEventTrigger } from '../trigger';

/**
 * Allows the mob to use close combat melee attacks.
 */
export interface MeleeAttackBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier
   */
  speedMultiplier?: number;

  /**
   * Allows the entity to use this attack behavior, only once EVER
   * @default false
   */
  attackOnce?: boolean;

  /**
   * Defines the entity types this entity will attack
   * @default "N/A"
   */
  attackTypes?: string;

  /**
   * If the entity is on fire, this allows the entity's target to catch on fire after being hit
   * @default false
   */
  canSpreadOnFire?: boolean;

  /**
   * Cooldown time (in seconds) between attacks
   * @default 1
   */
  cooldownTime?: number;

  /**
   * Time (in seconds) to add to attack path recalculation when the target is beyond the "path_inner_boundary"
   * @default 0.25
   */
  innerBoundaryTimeIncrease?: number;

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
   * Defines the event to trigger when this entity successfully attacks
   */
  onAttack?: EntityEventTrigger;

  /**
   * Defines the event to trigger when this entity successfully kills
   */
  onKill?: EntityEventTrigger;

  /**
   * Time (in seconds) to add to attack path recalculation when the target is beyond the "path_outer_boundary"
   * @default 0.5
   */
  outerBoundaryTimeIncrease?: number;

  /**
   * Time (in seconds) to add to attack path recalculation when this entity cannot move along the current path
   * @default 0.75
   */
  pathFailTimeIncrease?: number;

  /**
   * Distance at which to increase attack path recalculation by "inner_boundary_tick_increase"
   * @default 16
   */
  pathInnerBoundary?: number;

  /**
   * Distance at which to increase attack path recalculation by "outer_boundary_tick_increase"
   * @default 32
   */
  pathOuterBoundary?: number;

  /**
   * This entity will have a 1 in N chance to stop it's current attack, where N = "random_stop_interval"
   * @default 0
   */
  randomStopInterval?: number;

  /**
   * Used with the base size of the entity to determine minimum target-distance before trying to deal attack damage
   * @default 2
   */
  reachMultiplier?: number;

  /**
   * Toggles (on/off) the need to have a full path from the entity to the target when using this melee attack behavior
   * @default false
   */
  requireCompletePath?: boolean;

  /**
   * Allows the actor to be set to persist upon targeting a player
   * @default false
   */
  setPersistent?: boolean;

  /**
   * Allows the entity to track the attack target, even if the entity has no sensing
   * @default false
   */
  trackTarget?: boolean;

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
}
