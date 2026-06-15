import {
  Block,
  Dimension,
  Entity,
  system,
  TicksPerSecond,
  Vector3,
  world,
} from '@minecraft/server';

import { getAllEntities } from './utils/get-all-entities';
import { tryGetBlock } from '../block/utils/try-get-block';
import { floor } from '../vector/utils/floor';

/// Private Types ///

type LoaderRadius = 2 | 3 | 4 | 5 | 6;

/// Private Functions ///

const spawnLoader = async (
  location: Vector3,
  dimension: Dimension,
  radius: number,
): Promise<Entity | undefined> => {
  const entityToSpawn = world.getAllPlayers()[0] ?? getAllEntities()[0];
  if (!entityToSpawn) {
    return;
  }

  try {
    const loader = dimension.spawnEntity(
      'ferolyte:loader',
      entityToSpawn.location,
    );
    if (!loader) return;

    await system.waitTicks(1);

    loader.triggerEvent(`ferolyte:set_load_area_${radius}`);
    loader.teleport(location);

    return loader;
  } catch {}
};

const validateOptions = (
  options?: LoadLocationOptions,
): Required<LoadLocationOptions> => {
  if (options === undefined) {
    return {
      maxTries: 10,
      unloadDelay: TicksPerSecond * 5,
      radius: 2,
    };
  }

  return {
    maxTries: options.maxTries ?? 10,
    unloadDelay: options.unloadDelay ?? TicksPerSecond * 5,
    radius: options.radius ?? 2,
  };
};

const removeLoader = (loader: Entity) => {
  try {
    loader.remove();
  } catch {}
};

/// Public Types ///

export interface LoadLocationResult {
  block: Block | undefined;
  unload: () => void;
}

export interface LoadLocationOptions {
  /**
   * The radius of the area to load.
   * @default 2
   */
  radius?: LoaderRadius;
  /**
   * The maximum number of tries to load the location.
   * The delay between tries is 5 ticks.
   * @default 10
   */
  maxTries?: number;
  /**
   * The delay in ticks before the location is unloaded.
   * @default 5 seconds
   */
  unloadDelay?: number;
}

/// Public API ///

/**
 * Loads a location in a dimension using a loader entity 'ferolyte:loader'.
 *
 * WIP.
 * This is not yet ready for production use.
 *
 * @param location - The location to load.
 * @param dimension - The dimension to load the location in.
 * @param options - The options to use for the load.
 * @returns The result of the load.
 */
export const loadLocation = async (
  location: Vector3,
  dimension: Dimension,
  options?: LoadLocationOptions,
): Promise<LoadLocationResult> => {
  location = floor(location);

  let block = tryGetBlock({ dimension, ...location });
  if (block) {
    return {
      block,
      unload: () => {},
    };
  }

  const { maxTries, unloadDelay, radius } = validateOptions(options);
  const loader = await spawnLoader(location, dimension, radius);
  if (!loader) {
    return {
      block: undefined,
      unload: () => {},
    };
  }

  const forceUnload = (loader: Entity, unloadDelay: number) => {
    system.runTimeout(() => removeLoader(loader), unloadDelay);
  };

  for (let i = 0; i < maxTries; i++) {
    block = tryGetBlock({ dimension, ...location });

    if (block) {
      forceUnload(loader, unloadDelay);

      return {
        block,
        unload: () => removeLoader(loader),
      };
    }
    await system.waitTicks(5);
  }

  removeLoader(loader);

  return {
    block: undefined,
    unload: () => {},
  };
};
