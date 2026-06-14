import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { DragonLandingBehavior } from '../../interfaces/behaviors/dragon-landing-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a DragonLandingBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertDragonLandingBehavior = (
  behavior: Partial<DragonLandingBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.dragonlanding': any } | undefined => {
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
    'minecraft:behavior.dragonlanding': result
  };
};
