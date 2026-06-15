import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { SquidIdleBehavior } from '../../interfaces/behaviors/squid-idle-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a SquidIdleBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSquidIdleBehavior = (
  behavior: Partial<SquidIdleBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.squid_idle': any } | undefined => {
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
    'minecraft:behavior.squid_idle': result,
  };
};
