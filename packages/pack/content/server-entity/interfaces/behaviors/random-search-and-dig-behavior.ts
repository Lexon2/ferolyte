import { BehaviorPriority } from './behavior-priority';
import { EntityEventTrigger } from '../trigger';

/**
 * Allows this entity to locate a random target block that it can path find to. Once found, the entity will move towards it and dig up an item.
 */
export interface RandomSearchAndDigBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier of the mob when using this AI Goal
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * Goal cooldown range in seconds
   * @default [0.0, 0.0]
   */
  cooldownRange?: [number, number];

  /**
   * Digging duration in seconds
   * @default [8.0, 10.0]
   */
  diggingDurationRange?: [number, number];

  /**
   * Amount of retries to find a valid target position within search range
   * @default 5.0
   */
  findValidPositionRetries?: number;

  /**
   * Distance in blocks within the entity to considers it has reached it's target position
   * @default 1500000
   */
  goalRadius?: number;

  /**
   * File path relative to the behavior pack root for items to spawn list (loot table format)
   */
  itemTable?: string;

  /**
   * Event to run when the goal ends searching has begins digging
   */
  onDiggingStart?: EntityEventTrigger;

  /**
   * Event to run when the goal failed while in digging state
   */
  onFailDuringDigging?: EntityEventTrigger;

  /**
   * Event to run when the goal failed while in searching state
   */
  onFailDuringSearching?: EntityEventTrigger;

  /**
   * Event to run when the goal find a item
   */
  onItemFound?: EntityEventTrigger;

  /**
   * Event to run when the goal starts searching
   */
  onSearchingStart?: EntityEventTrigger;

  /**
   * Event to run when searching and digging has ended
   */
  onSuccess?: EntityEventTrigger;

  /**
   * Width and length of the volume around the entity used to find a valid target position
   * @default 10.0
   */
  searchRangeXz?: number;

  /**
   * Height of the volume around the entity used to find a valid target position
   * @default 7.0
   */
  searchRangeY?: number;

  /**
   * Digging duration before spawning item in seconds
   * @default 0.0
   */
  spawnItemAfterSeconds?: number;

  /**
   * Distance to offset the item's spawn location in the direction the mob is facing
   * @default 0.0
   */
  spawnItemPosOffset?: number;

  /**
   * List of target block types the goal will look to dig on. Overrides the default list
   */
  targetBlocks?: string[];

  /**
   * Dig target position offset from the feet position of the mob in their facing direction
   * @default 2250000
   */
  targetDigPositionOffset?: number;
}
