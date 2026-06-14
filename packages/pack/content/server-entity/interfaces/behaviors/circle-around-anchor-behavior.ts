
import { BehaviorPriority } from './behavior-priority';

/**
 * Interface for the CircleAroundAnchorBehavior
 * Allows an entity to circle around an anchor point placed near a point or target
 */
export interface CircleAroundAnchorBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the entity's movement
   */
  speedMultiplier?: number;

  /**
   * The range of radii for the circle
   */
  radiusRange?: [number, number];

  /**
   * The chance of the entity changing the radius of the circle
   */
  radiusChangeChance?: number;

  /**
   * The range of heights above the target for the circle
   */
  heightAboveTargetRange?: [number, number];

  /**
   * The range of heights below the target for the circle
   */
  heightOffsetRange?: [number, number];

  /**
   * The chance of the entity changing the height of the circle
   */
  heightChangeChance?: number;

  /**
   * The goal radius for the circle
   */
  goalRadius?: number;

  /**
   * The chance of the entity changing the radius of the circle
   */
  radiusChange?: number;

  /**
   * The chance of the entity changing the angle of the circle
   */
  angleChange?: number;

  /**
   * The chance of the entity changing the height of the circle
   */
  heightAdjustmentChance?: number;

  /**
   * The chance of the entity changing the radius of the circle
   */
  radiusAdjustmentChance?: number;
}