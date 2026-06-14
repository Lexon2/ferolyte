import { BehaviorPriority } from './behavior-priority';
import { EntityTypes } from '../../types/entity-types';

/**
 * Allows an entity to attack the closest target within a given subset of specific target types.
 */
export interface NearestAttackableTargetBehavior extends BehaviorPriority {
  /**
   * List of entity types that this entity can target
   */
  entityTypes?: EntityTypes;

  /**
   * Time range (in seconds) between searching for an attack target
   * @default 0
   */
  attackInterval?: number;

  /**
   * Alias for attackInterval; provides the same functionality as attackInterval
   * @default 0
   */
  attackIntervalMin?: number;

  /**
   * If true, this entity can attack its owner
   * @default false
   */
  attackOwner?: boolean;

  /**
   * If true, this entity requires a path to the target
   * @default false
   */
  mustReach?: boolean;

  /**
   * Determines if target-validity requires this entity to be in range only, or both in range and in sight
   * @default false
   */
  mustSee?: boolean;

  /**
   * Time (in seconds) the target must not be seen by this entity to become invalid
   * @default 3
   */
  mustSeeForgetDuration?: number;

  /**
   * Time (in seconds) this entity can continue attacking the target after the target is no longer valid
   * @default 0
   */
  persistTime?: number;

  /**
   * Allows the attacking entity to update the nearest target
   * @default false
   */
  reselectTargets?: boolean;

  /**
   * If attackInterval is 0 or isn't declared, then between attacks: scanning for a new target occurs every amount of ticks equal to scanInterval
   * @default 10
   */
  scanInterval?: number;

  /**
   * Allows the actor to be set to persist upon targeting a player
   * @default false
   */
  setPersistent?: boolean;

  /**
   * Multiplied with the target's armor coverage percentage to modify maxDist when detecting an invisible target
   * @default 0.7
   */
  targetInvisibleMultiplier?: number;

  /**
   * Maximum vertical target-search distance
   * @default -1
   */
  targetSearchHeight?: number;

  /**
   * Multiplied with the target type's maxDist when trying to detect a sneaking target
   * @default 0.8
   */
  targetSneakVisibilityMultiplier?: number;

  /**
   * Maximum distance this entity can be from the target when following it
   * @default 0
   */
  withinRadius?: number;
}
