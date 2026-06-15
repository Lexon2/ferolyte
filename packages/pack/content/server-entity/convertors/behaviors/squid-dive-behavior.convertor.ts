import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { SquidDiveBehavior } from '../../interfaces/behaviors/squid-dive-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a SquidDiveBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSquidDiveBehavior = (
  behavior: Partial<SquidDiveBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.squid_dive': any } | undefined => {
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
    'minecraft:behavior.squid_dive': result,
  };
};
