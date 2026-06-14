import { BehaviorPriority } from './behavior-priority';
import { EntityFilters } from '../filters';

/**
 * Allows an entity to move around a target. If the entity is too close (i.e. closer than destination range min and height difference limit) it will try to move away from its target. If the entity is too far away from its target it will try to move closer to a random position within the destination range.
 */
export interface MoveAroundTargetBehavior extends BehaviorPriority {
  /**
   * This angle (in degrees) is used for controlling the spread when picking a destination position behind the target. A zero spread angle means the destination position will be straight behind the target with no variance. A 90 degree spread angle means the destination position can be up to 45 degrees to the left and to the right of the position straight behind the target's view direction.
   * @default 90.0
   */
  destinationPosSearchSpreadDegrees?: number;

  /**
   * The range of distances from the target entity within which the goal should look for a position to move the owner entity to.
   * @default [4.0, 8.0]
   */
  destinationPositionRange?: [number, number];

  /**
   * UNDOCUMENTED
   */
  destinationPosSpreadDegrees?: number;

  /**
   * Distance in height (in blocks) between the owner entity and the target has to be less than this value when owner checks if it is too close and should move away from the target.
   * @default 10.0
   */
  heightDifferenceLimit?: number;

  /**
   * Horizontal search distance (in blocks) when searching for a position to move away from target.
   * @default 5
   */
  horizontalSearchDistance?: number;

  /**
   * The speed with which the entity should move to its target position.
   * @default 0.6
   */
  movementSpeed?: number;

  /**
   * Number of ticks needed to complete a stay at the block.
   * @default 5
   */
  verticalSearchDistance?: number;

  /**
   * Conditions that need to be met for the behavior to start.
   */
  filters?: EntityFilters;
}
