import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { SquidFleeBehavior } from '../../interfaces/behaviors/squid-flee-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a SquidFleeBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSquidFleeBehavior = (
  behavior: Partial<SquidFleeBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.squid_flee': any } | undefined => {
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
    'minecraft:behavior.squid_flee': result,
  };
};
