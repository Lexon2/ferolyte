import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { PlaceBlockBehavior } from '../../interfaces/behaviors/place-block-behavior';
import { convertRange } from '../common/convertors';
import { convertEntityFilters } from '../common/filters.convertor';
import { convertTrigger } from '../common/trigger.convertor';
import {
  validateBoolean,
  validateNumber,
  validateString,
  validateStringArray,
} from '../common/validation';

/**
 * Converts a PlaceBlockBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertPlaceBlockBehavior = (
  behavior: Partial<PlaceBlockBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.place_block': any } | undefined => {
  if (!behavior) {
    return undefined;
  }

  const result: any = {};

  if (behavior.priority !== undefined) {
    if (!validateNumber(behavior.priority, 'priority', 0, undefined, ctx)) {
      return undefined;
    }
    result.priority = behavior.priority;
  }

  if (behavior.affectedByGriefingRule !== undefined) {
    if (
      !validateBoolean(
        behavior.affectedByGriefingRule,
        'affectedByGriefingRule',
        ctx,
      )
    ) {
      return undefined;
    }
    result.affected_by_griefing_rule = behavior.affectedByGriefingRule;
  }

  if (behavior.canPlace !== undefined) {
    const convertedFilters = convertEntityFilters(
      behavior.canPlace,
      withFieldPath(ctx, 'canPlace'),
    );
    if (!convertedFilters) {
      return undefined;
    }
    result.can_place = convertedFilters;
  }

  if (behavior.chance !== undefined) {
    if (!validateNumber(behavior.chance, 'chance', 0, undefined, ctx)) {
      return undefined;
    }
    result.chance = behavior.chance;
  }

  if (behavior.onPlace !== undefined) {
    const convertedOnPlace = convertTrigger(
      behavior.onPlace,
      withFieldPath(ctx, 'onPlace'),
    );
    if (!convertedOnPlace) {
      return undefined;
    }
    result.on_place = convertedOnPlace;
  }

  if (behavior.placeableCarriedBlocks !== undefined) {
    if (
      !validateStringArray(
        behavior.placeableCarriedBlocks,
        'placeableCarriedBlocks',
        ctx,
      )
    ) {
      return undefined;
    }
    result.placeable_carried_blocks = behavior.placeableCarriedBlocks;
  }

  if (behavior.randomlyPlaceableBlocks !== undefined) {
    if (!Array.isArray(behavior.randomlyPlaceableBlocks)) {
      return undefined;
    }

    const convertedBlocks = behavior.randomlyPlaceableBlocks.map(
      (entry, index) => {
        if (!Array.isArray(entry) || entry.length !== 2) {
          return undefined;
        }

        const [block, weight] = entry;
        if (
          !validateString(block, `randomlyPlaceableBlocks[${index}][0]`, ctx) ||
          !validateNumber(
            weight,
            `randomlyPlaceableBlocks[${index}][1]`,
            0,
            undefined,
            ctx,
          )
        ) {
          return undefined;
        }

        return [block, weight];
      },
    );

    if (convertedBlocks.some((entry) => entry === undefined)) {
      return undefined;
    }

    result.randomly_placeable_blocks = convertedBlocks;
  }

  if (behavior.xzRange !== undefined) {
    const convertedXzRange = convertRange(behavior.xzRange, 'xzRange');
    if (!convertedXzRange) {
      return undefined;
    }
    result.xz_range = convertedXzRange;
  }

  if (behavior.yRange !== undefined) {
    const convertedYRange = convertRange(behavior.yRange, 'yRange');
    if (!convertedYRange) {
      return undefined;
    }
    result.y_range = convertedYRange;
  }

  return {
    'minecraft:behavior.place_block': result,
  };
};
