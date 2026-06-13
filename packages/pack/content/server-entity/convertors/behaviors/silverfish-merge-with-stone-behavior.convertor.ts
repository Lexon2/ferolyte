import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { SilverfishMergeWithStoneBehavior } from '../../interfaces/behaviors/silverfish-merge-with-stone-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a SilverfishMergeWithStoneBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSilverfishMergeWithStoneBehavior = (
  behavior: Partial<SilverfishMergeWithStoneBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.silverfish_merge_with_stone': any } | undefined => {
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

  return {
    'minecraft:behavior.silverfish_merge_with_stone': result
  };
};
