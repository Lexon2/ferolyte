import { BehaviorPriority } from './behavior-priority';

/**
 * [EXPERIMENTAL BEHAVIOR] The entity will attempt to toss the items from its inventory to a nearby recently played noteblock.
 */
export interface StayNearNoteBlockBehavior extends BehaviorPriority {
  /**
   * The time an entity should stay near a noteblock after hearing it.
   * @default 30
   */
  listenTime?: number;

  /**
   * The speed of the entity when moving towards the noteblock.
   * @default 1
   */
  speed?: number;

  /**
   * The distance the entity needs to be away from the noteblock to attempt to start the goal.
   * @default 10
   */
  startDistance?: number;

  /**
   * The distance from the noteblock the entity will attempt to reach.
   * @default 2
   */
  stopDistance?: number;
}