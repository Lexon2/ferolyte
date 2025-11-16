import { Block, DimensionLocation } from '@minecraft/server';

/**
 * Safely gets a block at a location.
 * @returns The block at the location, or undefined if the location is invalid.
 */
export function tryGetBlock(location: DimensionLocation): Block | undefined {
  try {
    return location.dimension.getBlock(location);
  } catch {}
}
