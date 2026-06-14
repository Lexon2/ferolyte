import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { PlayDeadBehavior } from '../../interfaces/behaviors/play-dead-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import {
  validateNumber,
  validateBoolean,
  validatePercentage,
  validateVector2,
  validateDamageSourceTypes,
} from '../common/validation';

/**
 * Converts a PlayDeadBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertPlayDeadBehavior = (
  behavior: Partial<PlayDeadBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.play_dead': any } | undefined => {
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

  // Validate applyRegeneration
  if (behavior.applyRegeneration !== undefined) {
    if (!validateBoolean(behavior.applyRegeneration, 'applyRegeneration')) {
      return undefined;
    }
    result.apply_regeneration = behavior.applyRegeneration;
  }

  // Validate duration
  if (behavior.duration !== undefined) {
    if (!validateNumber(behavior.duration, 'duration')) {
      return undefined;
    }
    result.duration = behavior.duration;
  }

  // Validate filters
  if (behavior.filters !== undefined) {
    const convertedFilters = convertEntityFilters(behavior.filters, withFieldPath(ctx, 'filters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  // Validate forceBelowHealth
  if (behavior.forceBelowHealth !== undefined) {
    if (!validateNumber(behavior.forceBelowHealth, 'forceBelowHealth')) {
      return undefined;
    }
    result.force_below_health = behavior.forceBelowHealth;
  }

  // Validate randomStartChance
  if (behavior.randomStartChance !== undefined) {
    if (!validatePercentage(behavior.randomStartChance, 'randomStartChance')) {
      return undefined;
    }
    result.random_start_chance = behavior.randomStartChance;
  }

  // Validate randomDamageRange
  if (behavior.randomDamageRange !== undefined) {
    if (!validateVector2(behavior.randomDamageRange, 'randomDamageRange', 0)) {
      return undefined;
    }
    result.random_damage_range = behavior.randomDamageRange;
  }

  // Validate damageSources
  if (behavior.damageSources !== undefined) {
    const damageSources = Array.isArray(behavior.damageSources)
      ? behavior.damageSources
      : [behavior.damageSources];

    if (!validateDamageSourceTypes(damageSources, 'damageSources')) {
      return undefined;
    }
    result.damage_sources = damageSources;
  }

  return {
    'minecraft:behavior.play_dead': result,
  };
};
