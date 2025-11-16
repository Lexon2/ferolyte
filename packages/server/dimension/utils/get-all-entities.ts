import { Entity, EntityQueryOptions } from '@minecraft/server';

import { MinecraftDimensions } from '../minecraft-dimensions';

/**
 * Gets entities in all dimensions
 * @param options - The options to pass to the entity query.
 * @returns Entities in all dimensions.
 */
export function getAllEntities(options?: EntityQueryOptions): Entity[] {
  return [
    ...MinecraftDimensions.overworld.getEntities(options),
    ...MinecraftDimensions.nether.getEntities(options),
    ...MinecraftDimensions.theEnd.getEntities(options),
  ];
}
