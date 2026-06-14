import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { EndermanLeaveBlockBehavior } from '../../interfaces/behaviors/enderman-leave-block-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts an EndermanLeaveBlockBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertEndermanLeaveBlockBehavior = (
  behavior: Partial<EndermanLeaveBlockBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.enderman_leave_block': any } | undefined => {
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
    'minecraft:behavior.enderman_leave_block': result
  };
};
