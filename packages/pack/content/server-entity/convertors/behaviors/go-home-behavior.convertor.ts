import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { GoHomeBehavior } from '../../interfaces/behaviors/go-home-behavior';
import { EntityEventTrigger } from '../../interfaces/trigger';
import { convertTrigger } from '../common/trigger.convertor';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a GoHomeBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertGoHomeBehavior = (
  behavior: Partial<GoHomeBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.go_home': any } | undefined => {
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

  // Validate goalRadius
  if (behavior.goalRadius !== undefined) {
    if (!validateNumber(behavior.goalRadius, 'goalRadius')) {
      return undefined;
    }
    result.goal_radius = behavior.goalRadius;
  }

  // Validate interval
  if (behavior.interval !== undefined) {
    if (!validateInteger(behavior.interval, 'interval')) {
      return undefined;
    }
    result.interval = behavior.interval;
  }

  // Validate onHome
  if (behavior.onHome !== undefined) {
    let onHome: EntityEventTrigger[] | undefined;
    if (Array.isArray(behavior.onHome)) {
      onHome = behavior.onHome.map(convertTrigger);
    } else {
      onHome = [convertTrigger(behavior.onHome, withFieldPath(ctx, 'onHome'))];
    }
    if (onHome.some((trigger) => trigger === undefined)) {
      return undefined;
    }
    result.on_home = onHome;
  }

  // Validate onFailed
  if (behavior.onFailed !== undefined) {
    const convertedOnFailed = convertTrigger(behavior.onFailed, withFieldPath(ctx, 'onFailed'));
    if (!convertedOnFailed) {
      return undefined;
    }
    result.on_failed = convertedOnFailed;
  }

  // Validate calculateNewPathRadius
  if (behavior.calculateNewPathRadius !== undefined) {
    if (
      !validateNumber(behavior.calculateNewPathRadius, 'calculateNewPathRadius')
    ) {
      return undefined;
    }
    result.calculate_new_path_radius = behavior.calculateNewPathRadius;
  }

  // Validate speedMultiplier
  if (behavior.speedMultiplier !== undefined) {
    if (!validateNumber(behavior.speedMultiplier, 'speedMultiplier')) {
      return undefined;
    }
    result.speed_multiplier = behavior.speedMultiplier;
  }

  return {
    'minecraft:behavior.go_home': result,
  };
};
