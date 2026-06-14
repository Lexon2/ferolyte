import { BehaviorPriority } from './behavior-priority';
import { SoundEvent } from '../../constants/sound-events';
import { EntityTypes } from '../../types/entity-types';
import { EntityEventTrigger } from '../trigger';

/**
 * Allows the entity to run away from other entities that meet the criteria specified
 */
export interface AvoidMobTypeBehavior extends BehaviorPriority {
  /**
   * The sound event to play when the mob is avoiding another mob
   * @default ''
   */
  avoidMobSound?: SoundEvent;

  /**
   * The next target position the entity chooses to avoid another entity will be chosen within this XZ Distance
   * @default 16
   */
  avoidTargetXz?: number;

  /**
   * The next target position the entity chooses to avoid another entity will be chosen within this Y Distance
   * @default 7
   */
  avoidTargetY?: number;

  /**
   * Whether or not to ignore direct line of sight while this entity is running away from other specified entities
   * @default false
   */
  ignoreVisibilty?: boolean;

  /**
   * Maximum distance to look for an avoid target for the entity
   * @default 3.0
   */
  maxDist?: number;

  /**
   * How many blocks away from its avoid target the entity must be for it to stop fleeing from the avoid target
   * @default 10.0
   */
  maxFlee?: number;

  /**
   * Percent chance this entity will stop avoiding another entity based on that entity's strength, where 1.0 = 100%
   * @default 1.0
   */
  probabilityPerStrength?: number;

  /**
   * Determine if we should remove target when fleeing or not
   * @default false
   */
  removeTarget?: boolean;

  /**
   * How many blocks within range of its avoid target the entity must be for it to begin sprinting away from the avoid target
   * @default 7.0
   */
  sprintDistance?: number;

  /**
   * Multiplier for sprint speed. 1.0 means keep the regular speed, while higher numbers make the sprint speed faster
   * @default 1.0
   */
  sprintSpeedMultiplier?: number;

  /**
   * Multiplier for walking speed. 1.0 means keep the regular speed, while higher numbers make the walking speed faster
   * @default 1.0
   */
  walkSpeedMultiplier?: number;

  /**
   * If true, visbility between this entity and the mob type will not be checked
   * @default false
   */
  ignoreVisibility?: boolean;

  /**
   * The list of conditions another entity must meet to be a valid target to avoid
   */
  entityTypes?: EntityTypes;

  /**
   * Event that is triggered when escaping from a mob
   */
  onEscapeEvent?: EntityEventTrigger;

  /**
   * The range of time in seconds to randomly wait before playing the sound again
   * @default [3.0, 8.0]
   */
  soundInterval?:
    | [number, number]
    | number
    | { rangeMin: number; rangeMax: number };
}
