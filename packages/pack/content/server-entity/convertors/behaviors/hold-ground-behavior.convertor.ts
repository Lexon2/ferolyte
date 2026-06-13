import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { HoldGroundBehavior } from '../../interfaces/behaviors/hold-ground-behavior';
import { convertTrigger } from '../common/trigger.convertor';
import {
  validateBoolean,
  validateNumber,
} from '../common/validation';

/**
 * Converts a HoldGroundBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertHoldGroundBehavior = (
  behavior: Partial<HoldGroundBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.hold_ground': any } | undefined => {
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

  // Validate broadcast
  if (behavior.broadcast !== undefined) {
    if (!validateBoolean(behavior.broadcast, 'broadcast')) {
      return undefined;
    }
    result.broadcast = behavior.broadcast;
  }

  // Validate broadcastRange
  if (behavior.broadcastRange !== undefined) {
    if (!validateNumber(behavior.broadcastRange, 'broadcastRange')) {
      return undefined;
    }
    result.broadcast_range = behavior.broadcastRange;
  }

  // Validate minRadius
  if (behavior.minRadius !== undefined) {
    if (!validateNumber(behavior.minRadius, 'minRadius')) {
      return undefined;
    }
    result.min_radius = behavior.minRadius;
  }

  // Validate withinRadiusEvent
  if (behavior.withinRadiusEvent !== undefined) {
    const convertedWithinRadiusEvent = convertTrigger(
      behavior.withinRadiusEvent,
    );
    if (!convertedWithinRadiusEvent) {
      return undefined;
    }
    result.within_radius_event = convertedWithinRadiusEvent;
  }

  return {
    'minecraft:behavior.hold_ground': result,
  };
};
