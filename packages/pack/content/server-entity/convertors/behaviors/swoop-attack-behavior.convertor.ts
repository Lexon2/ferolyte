import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { SwoopAttackBehavior } from '../../interfaces/behaviors/swoop-attack-behavior';
import { convertRange } from '../common/convertors';
import { validateNumber } from '../common/validation';

/**
 * Converts a SwoopAttackBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSwoopAttackBehavior = (
  behavior: Partial<SwoopAttackBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.swoop_attack': any } | undefined => {
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

  // Validate speedMultiplier
  if (behavior.speedMultiplier !== undefined) {
    if (!validateNumber(behavior.speedMultiplier, 'speedMultiplier')) {
      return undefined;
    }
    result.speed_multiplier = behavior.speedMultiplier;
  }

  // Validate damageReach
  if (behavior.damageReach !== undefined) {
    if (!validateNumber(behavior.damageReach, 'damageReach')) {
      return undefined;
    }
    result.damage_reach = behavior.damageReach;
  }

  // Validate delayRange
  if (behavior.delayRange !== undefined) {
    const convertedDelayRange = convertRange(behavior.delayRange, 'delayRange');
    if (!convertedDelayRange) {
      return undefined;
    }
    result.delay_range = convertedDelayRange;
  }

  return {
    'minecraft:behavior.swoop_attack': result,
  };
};
