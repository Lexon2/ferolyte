import { BehaviorPriority } from './behavior-priority';
import { EntityTypes } from '../../types/entity-types';
import { EntityEventTrigger } from '../trigger';

/**
 * Allows the entity to move toward a target, and drop an item near the target. This goal requires a "minecraft:navigation" to execute.
 */
export interface DropItemForBehavior extends BehaviorPriority {
  /**
   * The list of conditions another entity must meet to be a valid target to drop an item for
   */
  entityTypes?: EntityTypes;

  /**
   * Total time that the goal is on cooldown before it can be used again
   * @default 0.2
   */
  cooldown?: number;

  /**
   * The percent chance the entity will drop an item when using this goal
   * @default 1.0
   */
  dropItemChance?: number;

  /**
   * Distance in blocks within the entity considers it has reached it's target position
   * @default 0.5
   */
  goalRadius?: number;

  /**
   * The loot table that contains the possible loot the entity can drop with this goal
   */
  lootTable?: string;

  /**
   * The maximum height the entities head will look at when dropping the item
   * The entity will always be looking at its target
   * @default 10.0
   */
  maxHeadLookAtHeight?: number;

  /**
   * If the target position is farther away than this distance on any tick, the entity will teleport to the target position
   * @default 2.0
   */
  minimumTeleportDistance?: number;

  /**
   * The preferred distance the entity tries to be from the target it is dropping an item for
   * @default 1.0
   */
  offeringDistance?: number;

  /**
   * The event to trigger when the entity attempts to drop an item
   */
  onDropAttempt?: EntityEventTrigger;

  /**
   * The number of blocks each tick that the entity will check within its search range and height for a valid block to move to
   * A value of 0 will have the mob check every block within range in one tick
   * @default 0
   */
  searchCount?: number;

  /**
   * The Height in blocks the entity will search within to find a valid target position
   * @default 1
   */
  searchHeight?: number;

  /**
   * The distance in blocks the entity will search within to find a valid target position
   * @default 0
   */
  searchRange?: number;

  /**
   * The numbers of seconds that will pass before the dropped entity can be picked up from the ground
   * @default 0.0
   */
  secondsBeforePickup?: number;

  /**
   * The range in blocks within which the entity searches to find a target to drop an item for
   * @default [1, 1, 1]
   */
  targetRange?: [number, number, number];

  /**
   * When the entity teleports, offset the teleport position by this many blocks in the X, Y, and Z coordinate
   * @default [0, 1, 0]
   */
  teleportOffset?: [number, number, number];

  /**
   * The valid times of day that this goal can be used
   * For reference: noon is 0.0, sunset is 0.25, midnight is 0.5, and sunrise is 0.75, and back to noon for 1.0
   * @default [0, 1]
   */
  timeOfDayRange?: [number, number];
}
