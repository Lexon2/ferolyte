import {
  BlockFilterDescriptor,
  PlacementFilterComponent,
} from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { logContentError } from '@artifex/common/content/diagnostics/content-diagnostic';
import {
  validateAllowedValue,
  validateNonEmptyString,
} from '@artifex/common/content/validation/content-validation';

const VALID_FACES = [
  'up',
  'down',
  'north',
  'south',
  'east',
  'west',
  'side',
  'all',
] as const;

const convertBlockFilter = (
  filter: BlockFilterDescriptor,
  ctx?: ContentDiagnosticContext,
): any | undefined => {
  if (typeof filter === 'string') {
    if (
      !validateNonEmptyString(
        filter,
        ctx,
        'Block filter strings must not be empty',
      )
    ) {
      return undefined;
    }
    return filter;
  }

  if (typeof filter === 'object' && filter !== null) {
    if ('name' in filter) {
      if (
        !validateNonEmptyString(
          filter.name,
          ctx,
          'Block filter name must be a non-empty string',
          'name',
        )
      ) {
        return undefined;
      }

      const descriptor: any = { name: filter.name };

      if (filter.states !== undefined) {
        descriptor.states = filter.states;
      }

      if (filter.tags !== undefined) {
        if (
          !validateNonEmptyString(
            filter.tags,
            ctx,
            'Block filter tags must be a non-empty string',
            'tags',
          )
        ) {
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

  logContentError(
    ctx,
    'Block filter must be a string or a valid block descriptor object',
  );
  return undefined;
};

/**
 * Creates a placement_filter component for Minecraft blocks
 */
export const createPlacementFilter = (
  options?: PlacementFilterComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:placement_filter': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  const result: any = {};

  if (Array.isArray(options.conditions)) {
    const conditions: any[] = [];

    for (let condIndex = 0; condIndex < options.conditions.length; condIndex++) {
      const condition = options.conditions[condIndex];
      const condContext =
        ctx !== undefined
          ? { ...ctx, fieldPath: `conditions[${condIndex}]` }
          : undefined;
      const newCondition: any = {};

      if (Array.isArray(condition.allowedFaces)) {
        for (let faceIndex = 0; faceIndex < condition.allowedFaces.length; faceIndex++) {
          const face = condition.allowedFaces[faceIndex];
          if (
            !validateAllowedValue(
              face,
              VALID_FACES,
              condContext,
              'Allowed faces must be valid direction values',
              `allowedFaces[${faceIndex}]`,
            )
          ) {
            return undefined;
          }
        }

        newCondition.allowed_faces = condition.allowedFaces;
      }

      if (Array.isArray(condition.blockFilter)) {
        const blockFilters: any[] = [];

        for (let filterIndex = 0; filterIndex < condition.blockFilter.length; filterIndex++) {
          const filter = condition.blockFilter[filterIndex];
          const converted = convertBlockFilter(
            filter,
            condContext !== undefined
              ? { ...condContext, fieldPath: `blockFilter[${filterIndex}]` }
              : undefined,
          );
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
