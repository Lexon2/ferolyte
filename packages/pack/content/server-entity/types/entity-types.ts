import { EntityFilters } from '../interfaces/filters';

/**
 * The entity type definition.
 */
export interface EntityDefinition {
  /**
   * Conditions that need to be met for the entity to be a valid choice
   */
  filters?: EntityFilters;

  /**
   * The amount of time in seconds that the mob has to wait before selecting a target of the same type again
   * @default 0.0
   */
  cooldown?: number;

  /**
   * Maximum distance this mob can be away to be a valid choice
   * @default 16
   */
  maxDist?: number;

  /**
   * Maximum height
   */
  maxHeight?: number;

  /**
   * Maximum flee distance
   */
  maxFlee?: number;

  /**
   * Priority of this entity type
   */
  priority?: number;

  /**
   * Within default range
   */
  withinDefault?: number;

  /**
   * Whether to check if the entity is outnumbered
   */
  checkIfOutnumbered?: boolean;

  /**
   * If true, the mob has to be visible to be a valid choice
   * @default false
   */
  mustSee?: boolean;

  /**
   * Determines the amount of time in seconds that this mob will look for a target before forgetting about it and looking for a new one when the target isn't visible any more
   * @default 3
   */
  mustSeeForgetDuration?: number;

  /**
   * If true, the mob will stop being targeted if it stops meeting any conditions
   * @default false
   */
  reevaluateDescription?: boolean;

  /**
   * Multiplier for the running speed. A value of 1.0 means the speed is unchanged
   * @default 16
   */
  sprintSpeedMultiplier?: number;

  /**
   * Multiplier for the walking speed. A value of 1.0 means the speed is unchanged
   * @default 16
   */
  walkSpeedMultiplier?: number;
}

/**
 * Entity types can be either a single entity definition or an array of entity definitions
 */
export type EntityTypes = EntityDefinition | EntityDefinition[];
