import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { SpawnEntityComponent } from '../../../interfaces/components/miscellaneous/spawn-entity-component';
import { convertTrigger } from '../../common/trigger.convertor';
import { validateBoolean, validateInteger } from '../../common/validation';

/**
 * Converts a SpawnEntityComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertSpawnEntityComponent = (
  component: Partial<SpawnEntityComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:spawn_entity': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate entities
  if (component.entities !== undefined) {
    const entities = Array.isArray(component.entities) ? component.entities : [component.entities];

    result.entities = entities.map((entity, index) => {
      const entityResult: any = {};

      // Validate filters
      if (entity.filters !== undefined) {
        if (typeof entity.filters !== 'object' || entity.filters === null) {
          console.error(`entities[${index}].filters must be an object`);

          return undefined;
        }
        entityResult.filters = entity.filters;
      }

      // Validate maxWaitTime
      if (entity.maxWaitTime !== undefined) {
        if (!validateInteger(entity.maxWaitTime, `entities[${index}].maxWaitTime`)) {
          return undefined;
        }
        entityResult.max_wait_time = entity.maxWaitTime;
      }

      // Validate minWaitTime
      if (entity.minWaitTime !== undefined) {
        if (!validateInteger(entity.minWaitTime, `entities[${index}].minWaitTime`)) {
          return undefined;
        }
        entityResult.min_wait_time = entity.minWaitTime;
      }

      // Validate numToSpawn
      if (entity.numToSpawn !== undefined) {
        if (!validateInteger(entity.numToSpawn, `entities[${index}].numToSpawn`)) {
          return undefined;
        }
        entityResult.num_to_spawn = entity.numToSpawn;
      }

      // Validate shouldLeash
      if (entity.shouldLeash !== undefined) {
        if (!validateBoolean(entity.shouldLeash, `entities[${index}].shouldLeash`)) {
          return undefined;
        }
        entityResult.should_leash = entity.shouldLeash;
      }

      // Validate singleUse
      if (entity.singleUse !== undefined) {
        if (!validateBoolean(entity.singleUse, `entities[${index}].singleUse`)) {
          return undefined;
        }
        entityResult.single_use = entity.singleUse;
      }

      // Validate spawnEntity
      if (entity.spawnEntity !== undefined) {
        if (typeof entity.spawnEntity !== 'string') {
          console.error(`entities[${index}].spawnEntity must be a string`);

          return undefined;
        }
        entityResult.spawn_entity = entity.spawnEntity;
      }

      // Validate spawnEvent
      if (entity.spawnEvent !== undefined) {
        if (typeof entity.spawnEvent !== 'string') {
          console.error(`entities[${index}].spawnEvent must be a string`);

          return undefined;
        }
        entityResult.spawn_event = entity.spawnEvent;
      }

      // Validate spawnItem
      if (entity.spawnItem !== undefined) {
        if (typeof entity.spawnItem !== 'string') {
          console.error(`entities[${index}].spawnItem must be a string`);

          return undefined;
        }
        entityResult.spawn_item = entity.spawnItem;
      }

      // Validate spawnMethod
      if (entity.spawnMethod !== undefined) {
        if (typeof entity.spawnMethod !== 'string') {
          console.error(`entities[${index}].spawnMethod must be a string`);

          return undefined;
        }
        entityResult.spawn_method = entity.spawnMethod;
      }

      // Validate spawnSound
      if (entity.spawnSound !== undefined) {
        if (typeof entity.spawnSound !== 'string') {
          console.error(`entities[${index}].spawnSound must be a string`);

          return undefined;
        }
        entityResult.spawn_sound = entity.spawnSound;
      }

      // Validate spawnItemEvent
      if (entity.spawnItemEvent !== undefined) {
        const convertedSpawnItemEvent = convertTrigger(entity.spawnItemEvent, withFieldPath(ctx, 'spawnItemEvent'));
        if (!convertedSpawnItemEvent) {
          return undefined;
        }
        entityResult.spawn_item_event = convertedSpawnItemEvent;
      }

      return entityResult;
    });

    if (result.entities.includes(undefined)) {
      return undefined;
    }
  }

  return {
    'minecraft:spawn_entity': result
  };
};
