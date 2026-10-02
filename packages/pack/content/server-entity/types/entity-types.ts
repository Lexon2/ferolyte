import { EntityFilters } from '../interfaces/filters';

/**
 * The entity type definition.
 */
export interface EntityDefinition {
  /**
   * Conditions that need to be met for the entity to be a valid choice
   * @minecraft filters
   */
  filters?: EntityFilters;

  /**
   * The amount of time in seconds that the mob has to wait before selecting a target of the same type again
   * @default 0.0
   * @minecraft cooldown
   */
  cooldown?: number;

  /**
   * Maximum distance this mob can be away to be a valid choice
   * @default 16
   * @minecraft max_dist
   */
  maxDist?: number;

  /**
   * Maximum height
   * @minecraft max_height
   */
  maxHeight?: number;

  /**
   * Maximum flee distance
   * @minecraft max_flee
   */
  maxFlee?: number;

  /**
   * Priority of this entity type
   * @minecraft priority
   */
  priority?: number;

  /**
   * Within default range
   * @minecraft within_default
   */
  withinDefault?: number;

  /**
   * Whether to check if the entity is outnumbered
   * @minecraft check_if_outnumbered
   */
  checkIfOutnumbered?: boolean;

  /**
   * If true, the mob has to be visible to be a valid choice
   * @default false
   * @minecraft must_see
   */
  mustSee?: boolean;

  /**
   * Determines the amount of time in seconds that this mob will look for a target before forgetting about it and looking for a new one when the target isn't visible any more
   * @default 3
   * @minecraft must_see_forget_duration
   */
  mustSeeForgetDuration?: number;

  /**
   * If true, the mob will stop being targeted if it stops meeting any conditions
   * @default false
   * @minecraft reevaluate_description
   */
  reevaluateDescription?: boolean;

  /**
   * Multiplier for the running speed. A value of 1.0 means the speed is unchanged
   * @default 16
   * @minecraft sprint_speed_multiplier
   */
  sprintSpeedMultiplier?: number;

  /**
   * Multiplier for the walking speed. A value of 1.0 means the speed is unchanged
   * @default 16
   * @minecraft walk_speed_multiplier
   */
  walkSpeedMultiplier?: number;
}

/**
 * Entity types can be either a single entity definition or an array of entity definitions
 */
export type EntityTypes = EntityDefinition | EntityDefinition[];
