import { BehaviorPriority } from './behavior-priority';
import { EntityEventTrigger } from '../trigger';

/**
 * Allows an entity to attack, while also delaying the damage-dealt until a specific time in the attack animation
 */
export interface DelayedAttackBehavior extends BehaviorPriority {
  /**
   * Speed multiplier for this behavior
   */
  speedMultiplier?: number;

  /**
   * The entity's attack animation will play out over this duration (in seconds)
   * Also controls attack cooldown
   * @default 0.75
   */
  attackDuration?: number;

  /**
   * Allows the entity to use this attack behavior, only once EVER
   * @default false
   */
  attackOnce?: boolean;

  /**
   * Defines the entity types this entity will attack
   * @default 'N/A'
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
   * The percentage into the attack animation to apply the damage of the attack (1.0 = 100%)
   * @default 0.5
   */
  hitDelayPct?: number;

  /**
   * Time (in seconds) to add to attack path recalculation when the target is beyond the "path_inner_boundary"
   * @default 0.25
   */
  innerBoundaryTimeIncrease?: number;

  /**
   * Unused. No effect on "minecraft:behavior.melee_attack"
   */
  maxDist?: number;

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
   * @default 1.5
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
   * Unused. No effect on "minecraft:behavior.melee_attack"
   */
  targetDist?: number;

  /**
   * Allows the entity to track the attack target, even if the entity has no sensing
   * @default true
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
