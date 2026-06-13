import {
  BlockFilterDescriptor,
  PlacementFilterComponent,
} from '../interfaces/block-config';

const convertBlockFilter = (
  filter: BlockFilterDescriptor,
): any | undefined => {
  if (typeof filter === 'string') {
    if (filter.length === 0) {
      console.error('Block filter strings must not be empty');

      return undefined;
    }
    return filter;
  }

  if (typeof filter === 'object' && filter !== null) {
    if ('name' in filter) {
      const descriptor: any = { name: filter.name };

      if (typeof filter.name !== 'string' || filter.name.length === 0) {
        console.error('Block filter name must be a non-empty string');

        return undefined;
      }

      if (filter.states !== undefined) {
        descriptor.states = filter.states;
      }

      if (filter.tags !== undefined) {
        if (typeof filter.tags !== 'string' || filter.tags.length === 0) {
          console.error('Block filter tags must be a non-empty string');

          return undefined;
        }
        descriptor.tags = filter.tags;
      }

      return descriptor;
    }

    if (typeof filter.tags === 'string') {
      return { tags: filter.tags };
    }
  }

  console.error(
    'Block filter must be a string or a valid block descriptor object',
  );

  return undefined;
};

/**
 * Creates a placement_filter component for Minecraft blocks
 * @param options The placement filter options
 * @returns The placement_filter component in Minecraft format or undefined if validation fails
 */
export const createPlacementFilter = (
  options?: PlacementFilterComponent,
): { 'minecraft:placement_filter': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  const result: any = {};

  if (Array.isArray(options.conditions)) {
    const conditions: any[] = [];

    for (const condition of options.conditions) {
      const newCondition: any = {};

      if (Array.isArray(condition.allowedFaces)) {
        const validFaces = [
          'up',
          'down',
          'north',
          'south',
          'east',
          'west',
          'side',
          'all',
        ];

        for (const face of condition.allowedFaces) {
          if (!validFaces.includes(face)) {
            // @TODO: Add error handling
            console.error('Allowed faces must be valid direction values');

            return undefined;
          }
        }

        newCondition.allowed_faces = condition.allowedFaces;
      }

      if (Array.isArray(condition.blockFilter)) {
        const blockFilters: any[] = [];

        for (const filter of condition.blockFilter) {
          const converted = convertBlockFilter(filter);
          if (converted === undefined) {
            return undefined;
          }
          blockFilters.push(converted);
        }

        newCondition.block_filter = blockFilters;
      }

      conditions.push(newCondition);
    }

    result.conditions = conditions;
  }

  return {
    'minecraft:placement_filter': result,
  };
};
