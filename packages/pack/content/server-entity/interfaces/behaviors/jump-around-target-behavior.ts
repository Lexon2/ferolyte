import { BehaviorPriority } from './behavior-priority';
import { EntityFilters } from '../filters';

/**
 * Allows an entity to jump around a target.
 */
export interface JumpAroundTargetBehavior extends BehaviorPriority {
  /**
   * Enables collision checks when calculating the jump. Setting check_collision to true may affect performance and should be used with care
   * @default false
   */
  checkCollision?: boolean;

  /**
   * Scaling temporarily applied to the entity's AABB bounds when jumping. A smaller bounding box reduces the risk of collisions during the jump
   * @default 0.7
   */
  entityBoundingBoxScale?: number;

  /**
   * The jump angles in float degrees that are allowed when performing the jump
   * @default [40.0, 55.0, 60.0, 75.0, 80.0]
   */
  jumpAngles?: number[];

  /**
   * The time in seconds to spend in cooldown before this goal can be used again
   * @default 0.5
   */
  jumpCooldownDuration?: number;

  /**
   * The time in seconds to spend in cooldown after being hurt before this goal can be used again
   * @default 0.1
   */
  jumpCooldownWhenHurtDuration?: number;

  /**
   * The range deciding how close to and how far away from the target the landing position can be when jumping
   */
  landingDistanceFromTarget?: [number, number];

  /**
   * This angle (in degrees) is used for controlling the spread when picking a landing position behind the target. A zero spread angle means the landing position will be straight behind the target with no variance. A 90 degree spread angle means the landing position can be up to 45 degrees to the left and to the right of the position straight behind the target's view direction.
   * @default 90
   */
  landingPositionSpreadDegrees?: number;

  /**
   * If the entity was hurt within these last seconds, the jump_cooldown_when_hurt_duration will be used instead of jump_cooldown_duration
   * @default 2.0
   */
  lastHurtDuration?: number;

  /**
   * If the entity's line of sight towards its target is obstructed by an obstacle with a height below this number, the obstacle will be ignored and the goal will try to find a valid landing position.
   * @default 4
   */
  lineOfSightObstructionHeightIgnore?: number;

  /**
   * Maximum velocity a jump can be performed at
   * @default 1.4
   */
  maxJumpVelocity?: number;

  /**
   * The time in seconds to spend preparing for the jump
   * @default 0.5
   */
  prepareJumpDuration?: number;

  /**
   * The number of blocks above the entity's head that has to be air for this goal to be usable
   * @default 4
   */
  requiredVerticalSpace?: number;

  /**
   * The number of blocks above and below from the jump target position that will be checked to find a surface to land on
   * @default 10
   */
  snapToSurfaceBlockRange?: number;

  /**
   * Target needs to be within this range for the jump to happen
   */
  validDistanceToTarget?: [number, number];

  /**
   * Conditions that need to be met for the behavior to start
   */
  filters?: EntityFilters;
}
