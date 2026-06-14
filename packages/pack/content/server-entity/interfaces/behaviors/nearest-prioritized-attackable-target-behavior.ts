import { BehaviorPriority } from './behavior-priority';
import { EntityTypes } from '../../types/entity-types';

/**
 * Allows the mob to check for and pursue the nearest valid target.
 */
export interface NearestPrioritizedAttackableTargetBehavior extends BehaviorPriority {
  /**
   * List of entity types that this mob considers valid targets
   */
  entityTypes?: EntityTypes;

  /**
   * Time in seconds before selecting a target
   * @default 0
   */
  attackInterval?: number;

  /**
   * The amount of time in seconds that the mob has to wait before selecting a target of the same type again
   * @default 0.0
   */
  cooldown?: number;

  /**
   * If true, only entities that this mob can path to can be selected as targets
   * @default false
   */
  mustReach?: boolean;

  /**
   * If true, only entities in this mob's viewing range can be selected as targets
   * @default false
   */
  mustSee?: boolean;

  /**
   * Determines the amount of time in seconds that this mob will look for a target before forgetting about it
   * @default 3
   */
  mustSeeForgetDuration?: number;

  /**
   * Time in seconds for a valid target to stay targeted when it becomes an invalid target
   * @default 0.0
   */
  persistTime?: number;

  /**
   * If true, the target will change to the current closest entity whenever a different entity is closer
   * @default false
   */
  reselectTargets?: boolean;

  /**
   * If true, the mob will stop being targeted if it stops meeting any conditions
   * @default false
   */
  reevaluateDescription?: boolean;

  /**
   * How many ticks to wait between scanning for a target
   * @default 10
   */
  scanInterval?: number;

  /**
   * Allows the actor to be set to persist upon targeting a player
   * @default false
   */
  setPersistent?: boolean;

  /**
   * Height in blocks to search for a target mob
   * @default -1.0
   */
  targetSearchHeight?: number;

  /**
   * Distance in blocks that the target can be within to launch an attack
   * @default 0
   */
  withinRadius?: number;
}
