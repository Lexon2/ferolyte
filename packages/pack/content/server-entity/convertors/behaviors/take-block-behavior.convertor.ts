import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { TakeBlockBehavior } from '../../interfaces/behaviors/take-block-behavior';
import { convertRange } from '../common/convertors';
import { convertEntityFilters } from '../common/filters.convertor';
import { convertTrigger } from '../common/trigger.convertor';
import {
  validateBoolean,
  validateNumber,
  validateStringArray,
} from '../common/validation';

/**
 * Converts a TakeBlockBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertTakeBlockBehavior = (
  behavior: Partial<TakeBlockBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.take_block': any } | undefined => {
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
    if (!validateBoolean(behavior.affectedByGriefingRule, 'affectedByGriefingRule', ctx)) {
      return undefined;
    }
    result.affected_by_griefing_rule = behavior.affectedByGriefingRule;
  }

  if (behavior.blocks !== undefined) {
    if (!validateStringArray(behavior.blocks, 'blocks', ctx)) {
      return undefined;
    }
    result.blocks = behavior.blocks;
  }

  if (behavior.canTake !== undefined) {
    const convertedFilters = convertEntityFilters(behavior.canTake, withFieldPath(ctx, 'canTake'));
    if (!convertedFilters) {
      return undefined;
    }
    result.can_take = convertedFilters;
  }

  if (behavior.chance !== undefined) {
    if (!validateNumber(behavior.chance, 'chance', 0, undefined, ctx)) {
      return undefined;
    }
    result.chance = behavior.chance;
  }

  if (behavior.onTake !== undefined) {
    const convertedOnTake = convertTrigger(behavior.onTake, withFieldPath(ctx, 'onTake'));
    if (!convertedOnTake) {
      return undefined;
    }
    result.on_take = convertedOnTake;
  }

  if (behavior.requiresLineOfSight !== undefined) {
    if (!validateBoolean(behavior.requiresLineOfSight, 'requiresLineOfSight', ctx)) {
      return undefined;
    }
    result.requires_line_of_sight = behavior.requiresLineOfSight;
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
    'minecraft:behavior.take_block': result,
  };
};
