import { BehaviorPriority } from './behavior-priority';
import { EntityFilters } from '../filters';

/**
 * Allows an entity to attack by firing a shot with a delay. Anchor and offset parameters of this component overrides the anchor and offset from projectile component.
 */
export interface FireAtTargetBehavior extends BehaviorPriority {
  /**
   * The cooldown time in seconds before this goal can be used again
   * @default 0.5
   */
  attackCooldown?: number;

  /**
   * Target needs to be within this range for the attack to happen
   */
  attackRange?: [number, number, number];

  /**
   * Entity anchor for the projectile spawn location
   * @default 2
   */
  ownerAnchor?: number;

  /**
   * Offset vector from the owner_anchor
   */
  ownerOffset?: [number, number, number];

  /**
   * Entity anchor for projectile target
   * @default 2
   */
  targetAnchor?: number;

  /**
   * Offset vector from the target_anchor
   */
  targetOffset?: [number, number, number];

  /**
   * Time in seconds between firing the projectile and ending the goal
   * @default 0.2
   */
  postShootDelay?: number;

  /**
   * Time in seconds before firing the projectile
   * @default 0.75
   */
  preShootDelay?: number;

  /**
   * Actor definition to use as projectile for the ranged attack. The actor must be a projectile
   */
  projectileDef?: string;

  /**
   * Field of view (in degrees) when using sensing to detect a target for attack
   * @default 90
   */
  rangedFov?: number;

  /**
   * Maximum head rotation (in degrees), on the X-axis, that this entity can apply while trying to look at the target
   * @default 30
   */
  maxHeadRotationX?: number;

  /**
   * Maximum head rotation (in degrees), on the Y-axis, that this entity can apply while trying to look at the target
   * @default 30
   */
  maxHeadRotationY?: number;

  /**
   * Conditions that need to be met for the behavior to start
   */
  filters?: EntityFilters;
}
