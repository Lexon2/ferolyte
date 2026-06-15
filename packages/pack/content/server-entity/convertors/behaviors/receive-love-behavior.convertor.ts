import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { ReceiveLoveBehavior } from '../../interfaces/behaviors/receive-love-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a ReceiveLoveBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertReceiveLoveBehavior = (
  behavior: Partial<ReceiveLoveBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.receive_love': any } | undefined => {
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
    'minecraft:behavior.receive_love': result,
  };
};
