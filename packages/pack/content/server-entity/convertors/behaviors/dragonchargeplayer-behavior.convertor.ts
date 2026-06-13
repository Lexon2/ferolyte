import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { DragonChargePlayerBehavior } from '../../interfaces/behaviors/dragonchargeplayer-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a DragonChargePlayerBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertDragonChargePlayerBehavior = (
  behavior: Partial<DragonChargePlayerBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.dragonchargeplayer': any } | undefined => {
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

  // Validate activeSpeed
  if (behavior.activeSpeed !== undefined) {
    if (!validateNumber(behavior.activeSpeed, 'activeSpeed')) {
      return undefined;
    }
    result.active_speed = behavior.activeSpeed;
  }

  // Validate continueChargeThresholdTime
  if (behavior.continueChargeThresholdTime !== undefined) {
    if (!validateNumber(behavior.continueChargeThresholdTime, 'continueChargeThresholdTime')) {
      return undefined;
    }
    result.continue_charge_threshold_time = behavior.continueChargeThresholdTime;
  }

  // Validate flightSpeed
  if (behavior.flightSpeed !== undefined) {
    if (!validateNumber(behavior.flightSpeed, 'flightSpeed')) {
      return undefined;
    }
    result.flight_speed = behavior.flightSpeed;
  }

  // Validate targetZone
  if (behavior.targetZone !== undefined) {
    if (!Array.isArray(behavior.targetZone) || behavior.targetZone.length !== 2 ||
        !behavior.targetZone.every(n => validateNumber(n, 'targetZone'))) {
      console.error('targetZone must be an array of exactly 2 numbers');

      return undefined;
    }
    result.target_zone = behavior.targetZone;
  }

  // Validate turnSpeed
  if (behavior.turnSpeed !== undefined) {
    if (!validateNumber(behavior.turnSpeed, 'turnSpeed')) {
      return undefined;
    }
    result.turn_speed = behavior.turnSpeed;
  }

  return {
    'minecraft:behavior.dragonchargeplayer': result
  };
};
