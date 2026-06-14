import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { PlayerRideTamedBehavior } from '../../interfaces/behaviors/player-ride-tamed-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a PlayerRideTamedBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertPlayerRideTamedBehavior = (
  behavior: Partial<PlayerRideTamedBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.player_ride_tamed': any } | undefined => {
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
    'minecraft:behavior.player_ride_tamed': result
  };
};
