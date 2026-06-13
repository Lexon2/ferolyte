import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { StalkAndPounceOnTargetBehavior } from '../../interfaces/behaviors/stalk-and-pounce-on-target-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import { validateNumber, validateBoolean } from '../common/validation';

/**
 * Converts a StalkAndPounceOnTargetBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertStalkAndPounceOnTargetBehavior = (
  behavior: Partial<StalkAndPounceOnTargetBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.stalk_and_pounce_on_target': any } | undefined => {
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

  // Validate interestTime
  if (behavior.interestTime !== undefined) {
    if (!validateNumber(behavior.interestTime, 'interestTime')) {
      return undefined;
    }
    result.interest_time = behavior.interestTime;
  }

  // Validate leapDistance
  if (behavior.leapDistance !== undefined) {
    if (!validateNumber(behavior.leapDistance, 'leapDistance')) {
      return undefined;
    }
    result.leap_distance = behavior.leapDistance;
  }

  // Validate leapHeight
  if (behavior.leapHeight !== undefined) {
    if (!validateNumber(behavior.leapHeight, 'leapHeight')) {
      return undefined;
    }
    result.leap_height = behavior.leapHeight;
  }

  // Validate maxStalkDist
  if (behavior.maxStalkDist !== undefined) {
    if (!validateNumber(behavior.maxStalkDist, 'maxStalkDist')) {
      return undefined;
    }
    result.max_stalk_dist = behavior.maxStalkDist;
  }

  // Validate pounceMaxDist
  if (behavior.pounceMaxDist !== undefined) {
    if (!validateNumber(behavior.pounceMaxDist, 'pounceMaxDist')) {
      return undefined;
    }
    result.pounce_max_dist = behavior.pounceMaxDist;
  }

  // Validate setPersistent
  if (behavior.setPersistent !== undefined) {
    if (!validateBoolean(behavior.setPersistent, 'setPersistent')) {
      return undefined;
    }
    result.set_persistent = behavior.setPersistent;
  }

  // Validate stalkSpeed
  if (behavior.stalkSpeed !== undefined) {
    if (!validateNumber(behavior.stalkSpeed, 'stalkSpeed')) {
      return undefined;
    }
    result.stalk_speed = behavior.stalkSpeed;
  }

  // Validate strikeDist
  if (behavior.strikeDist !== undefined) {
    if (!validateNumber(behavior.strikeDist, 'strikeDist')) {
      return undefined;
    }
    result.strike_dist = behavior.strikeDist;
  }

  // Validate stuckTime
  if (behavior.stuckTime !== undefined) {
    if (!validateNumber(behavior.stuckTime, 'stuckTime')) {
      return undefined;
    }
    result.stuck_time = behavior.stuckTime;
  }

  // Validate leapDist
  if (behavior.leapDist !== undefined) {
    if (!validateNumber(behavior.leapDist, 'leapDist')) {
      return undefined;
    }
    result.leap_dist = behavior.leapDist;
  }

  // Validate stuckBlocks
  if (behavior.stuckBlocks !== undefined) {
    const convertedFilters = convertEntityFilters(behavior.stuckBlocks, withFieldPath(ctx, 'stuckBlocks'));
    if (!convertedFilters) {
      return undefined;
    }
    result.stuck_blocks = convertedFilters;
  }

  return {
    'minecraft:behavior.stalk_and_pounce_on_target': result
  };
};
