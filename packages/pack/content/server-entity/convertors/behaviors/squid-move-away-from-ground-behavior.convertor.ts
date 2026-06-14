import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { SquidMoveAwayFromGroundBehavior } from '../../interfaces/behaviors/squid-move-away-from-ground-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a SquidMoveAwayFromGroundBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSquidMoveAwayFromGroundBehavior = (
  behavior: Partial<SquidMoveAwayFromGroundBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.squid_move_away_from_ground': any } | undefined => {
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
    'minecraft:behavior.squid_move_away_from_ground': result
  };
};
