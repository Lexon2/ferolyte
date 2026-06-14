import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { TeleportToOwnerBehavior } from '../../interfaces/behaviors/teleport-to-owner-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import { validateNumber } from '../common/validation';

/**
 * Converts a TeleportToOwnerBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertTeleportToOwnerBehavior = (
  behavior: Partial<TeleportToOwnerBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.teleport_to_owner': any } | undefined => {
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

  // Validate cooldown
  if (behavior.cooldown !== undefined) {
    if (!validateNumber(behavior.cooldown, 'cooldown')) {
      return undefined;
    }
    result.cooldown = behavior.cooldown;
  }

  // Validate filters
  if (behavior.filters !== undefined) {
    const convertedFilters = convertEntityFilters(behavior.filters, withFieldPath(ctx, 'filters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  return {
    'minecraft:behavior.teleport_to_owner': result
  };
};
