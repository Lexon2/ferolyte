import { EntityEventTrigger } from '../trigger';
import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to use the polar bear's melee attack.
 */
export interface StompAttackBehavior extends BehaviorPriority {
  /**
   * Allows the entity to use this attack behavior, only once EVER.
   * @default false
   */
  attackOnce?: boolean;

  /**
   * Defines the entity types this entity will attack.
   * @default "N/A"
   */
  attackTypes?: string[];

  /**
   * If the entity is on fire, this allows the entity's target to catch on fire after being hit.
   * @default false
   */
  canSpreadOnFire?: boolean;

  /**
   * Cooldown time (in seconds) between attacks.
   * @default 1
   */
  cooldownTime?: number;

  /**
   * The amount of time the entity will wait before increasing the inner boundary.
   * @default 0.25
   */
  innerBoundaryTimeIncrease?: number;

  /**
   * The maximum distance the entity will move towards the target.
   * @default 0
   */
  maxDist?: number;

  /**
   * The maximum amount of time the entity will spend moving towards the target.
   * @default 0
   */
  maxPathTime?: number;

  /**
   * The field of view of the entity's melee attack.
   * @default 0
   */
  meleeFov?: number;

  /**
   * The minimum amount of time the entity will spend moving towards the target.
   * @default 0
   */
  minPathTime?: number;

  /**
   * The multiplier for the no damage range.
   * @default 0
   */
  noDamageRangeMultiplier?: number;

  /**
   * The trigger for the on attack event.
   */
  onAttack?: EntityEventTrigger;

  /**
   * The amount of time the entity will wait before increasing the outer boundary.
   * @default 0
   */
  outerBoundaryTimeIncrease?: number;

  /**
   * Time (in seconds) to add to attack path recalculation when this entity cannot move along the current path.
   * @default 0
   */
  pathFailTimeIncrease?: number;

  /**
   * Distance at which to increase attack path recalculation by "inner_boundary_tick_increase".
   * @default 16
   */
  pathInnerBoundary?: number;

  /**
   * Distance at which to increase attack path recalculation by "outer_boundary_tick_increase".
   * @default 32
   */
  pathOuterBoundary?: number;

  /**
   * This entity will have a 1 in N chance to stop it's current attack, where N = "random_stop_interval".
   * @default 0
   */
  randomStopInterval?: number;

  /**
   * The multiplier for the reach of the entity's melee attack.
   * @default 0
   */
  reachMultiplier?: number;

  /**
   * Whether the entity requires a complete path to the target.
   * @default false
   */
  requireCompletePath?: boolean;

  /**
   * Whether the entity should be set to persistent.
   * @default false
   */
  setPersistent?: boolean;

  /**
   * The multiplier for the stomp range of the entity's melee attack.
   * @default 0
   */
  stompRangeMultiplier?: number;

  /**
   * The distance the entity will move towards the target.
   * @default 0
   */
  targetDist?: number;

  /**
   * Whether the entity should track the target.
   * @default false
   */
  trackTarget?: boolean;

  /**
   * The maximum rotation of the entity's head.
   * @default 0
   */
  xMaxRotation?: number;

  /**
   * The maximum rotation of the entity's head.
   * @default 0
   */
  yMaxHeadRotation?: number;
}
