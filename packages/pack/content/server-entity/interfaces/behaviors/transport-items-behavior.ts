import { BehaviorPriority } from './behavior-priority';

export type TransportItemsSearchStrategy = 'nearest' | 'random';

export type TransportItemsPlaceStrategy =
  | 'any'
  | 'with_matching'
  | 'with_matching_or_empty';

/**
 * Allows a mob to transport items from and to containers.
 */
export interface TransportItemsBehavior extends BehaviorPriority {
  /**
   * A list of block descriptors that should be a container type to get items from. Default is any container
   */
  sourceContainerTypes?: string[];

  /**
   * A list of block descriptors that should be a container type to put items in. Default is any container
   */
  destinationContainerTypes?: string[];

  /**
   * The maximum stack size that the mob will try to take from a container
   * @default 16
   */
  maxStackSize?: number;

  /**
   * The amount of time spent interacting with the containers in seconds
   * @default 3
   */
  interactionTime?: number;

  /**
   * Whether the entity is allowed to simultaneously interact with a container that another non-player entity is already interacting with
   * @default false
   */
  allowSimultaneousInteraction?: boolean;

  /**
   * Whether to select the nearest valid container or a random valid container in range
   */
  searchStrategy?: TransportItemsSearchStrategy;

  /**
   * The maximum horizontal and vertical distance at which to find containers for taking or placing items
   * @default [62, 32]
   */
  searchDistance?: number | [number, number] | { rangeMin: number; rangeMax: number };

  /**
   * The maximum number of containers the mob will visit before resetting. 0 is unlimited
   * @default 16
   */
  maxVisitedContainers?: number;

  /**
   * Time, in seconds, the mob will wait after spawning or after its available goals have changed
   * @default 0
   */
  initialCooldown?: number;

  /**
   * When the mob cannot find a valid container to interact with, the goal will be disabled for this amount of time in seconds
   * @default 20
   */
  idleCooldown?: number;

  /**
   * The strategy to use for placing the transported item
   * @default "any"
   */
  placeStrategy?: TransportItemsPlaceStrategy;

  /**
   * A list of item descriptors that are the only items the mob is allowed to transport
   */
  allowedItems?: string[];

  /**
   * A list of item descriptors that the mob is not allowed to transport
   */
  disallowedItems?: string[];
}
