import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { EndermanTakeBlockBehavior } from '../../interfaces/behaviors/enderman-take-block-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts an EndermanTakeBlockBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertEndermanTakeBlockBehavior = (
  behavior: Partial<EndermanTakeBlockBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.enderman_take_block': any } | undefined => {
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
    'minecraft:behavior.enderman_take_block': result
  };
};
