import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { EatBlockBehavior } from '../../interfaces/behaviors/eat-block-behavior';
import { convertTrigger } from '../common/trigger.convertor';
import { validateNumber, validateString } from '../common/validation';

/**
 * Converts an EatBlockBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertEatBlockBehavior = (
  behavior: Partial<EatBlockBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.eat_block': any } | undefined => {
  if (!behavior) {
    return undefined;
  }

  const result: any = {};

  // Validate priority
  if (behavior.priority !== undefined) {
    if (!validateNumber(behavior.priority, 'priority')) {
      return undefined;
    }
    result.priority = behavior.priority;
  }

  // Validate onEat
  if (behavior.onEat !== undefined) {
    const onEat = convertTrigger(behavior.onEat, withFieldPath(ctx, 'onEat'));
    if (!onEat) {
      return undefined;
    }
    result.on_eat = onEat;
  }

  // Validate successChance
  if (behavior.successChance !== undefined) {
    if (!validateNumber(behavior.successChance, 'successChance')) {
      return undefined;
    }
    result.success_chance = behavior.successChance;
  }

  // Validate timeUntilEat
  if (behavior.timeUntilEat !== undefined) {
    if (!validateNumber(behavior.timeUntilEat, 'timeUntilEat')) {
      return undefined;
    }
    result.time_until_eat = behavior.timeUntilEat;
  }

  // Validate eatAndReplaceBlockPairs
  if (behavior.eatAndReplaceBlockPairs !== undefined) {
    if (!Array.isArray(behavior.eatAndReplaceBlockPairs)) {
      console.error('eatAndReplaceBlockPairs must be an array');

      return undefined;
    }

    result.eat_and_replace_block_pairs = behavior.eatAndReplaceBlockPairs.map(
      (pair: { eatBlock: string; replaceBlock: string }) => {
        if (
          !validateString(pair.eatBlock, 'eatBlock') ||
          !validateString(pair.replaceBlock, 'replaceBlock')
        ) {
          return undefined;
        }
        return {
          eat_block: pair.eatBlock,
          replace_block: pair.replaceBlock,
        };
      },
    );

    if (
      result.eat_and_replace_block_pairs.some((pair: any) => pair === undefined)
    ) {
      return undefined;
    }
  }

  return {
    'minecraft:behavior.eat_block': result,
  };
};
