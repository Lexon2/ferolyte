import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { DragonDeathBehavior } from '../../interfaces/behaviors/dragon-death-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a DragonDeathBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertDragonDeathBehavior = (
  behavior: Partial<DragonDeathBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.dragondeath': any } | undefined => {
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
    'minecraft:behavior.dragondeath': result
  };
};
