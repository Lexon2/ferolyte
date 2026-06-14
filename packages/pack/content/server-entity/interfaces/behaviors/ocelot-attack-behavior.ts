import { BehaviorPriority } from './behavior-priority';

/**
 * Can only be used by the Ocelot. Allows it to perform the sneak and pounce attack.
 */
export interface OcelotAttackBehavior extends BehaviorPriority {
  /**
   * Time (in seconds) between attacks
   * @default 1
   */
  cooldownTime?: number;

  /**
   * Max distance from the target, this entity will use this attack behavior
   * @default 15
   */
  maxDistance?: number;

  /**
   * Max distance from the target, this entity starts sneaking
   * @default 15
   */
  maxSneakRange?: number;

  /**
   * Max distance from the target, this entity starts sprinting
   * @default 4
   */
  maxSprintRange?: number;

  /**
   * Used with the base size of the entity to determine minimum target-distance before trying to deal attack damage
   * @default 2
   */
  reachMultiplier?: number;

  /**
   * Modifies the attacking entity's movement speed while sneaking
   * @default 0.6
   */
  sneakSpeedMultiplier?: number;

  /**
   * Modifies the attacking entity's movement speed while sprinting
   * @default 1.33
   */
  sprintSpeedMultiplier?: number;

  /**
   * Modifies the attacking entity's movement speed when not sneaking or sprinting
   * @default 0.8
   */
  walkSpeedMultiplier?: number;

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
