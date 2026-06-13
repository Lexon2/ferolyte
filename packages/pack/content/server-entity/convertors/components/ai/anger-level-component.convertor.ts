import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { AngerLevelComponent } from '../../../interfaces/components/ai/anger-level-component';
import { convertEntityFilters } from '../../common/filters.convertor';
import {
  validateNumber,
  validateString,
  validateSoundEvent,
  validateBoolean,
} from '../../common/validation';

/**
 * Converts an AngerLevelComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertAngerLevelComponent = (
  component: Partial<AngerLevelComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:anger_level': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate angerDecrementInterval
  if (component.angerDecrementInterval !== undefined) {
    if (
      !validateNumber(
        component.angerDecrementInterval,
        'angerDecrementInterval',
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.anger_decrement_interval = component.angerDecrementInterval;
  }

  // Validate angryBoost
  if (component.angryBoost !== undefined) {
    if (
      !validateNumber(component.angryBoost, 'angryBoost', 0, Number.MAX_VALUE)
    ) {
      return undefined;
    }
    result.angry_boost = component.angryBoost;
  }

  // Validate angryThreshold
  if (component.angryThreshold !== undefined) {
    if (
      !validateNumber(
        component.angryThreshold,
        'angryThreshold',
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.angry_threshold = component.angryThreshold;
  }

  // Validate defaultAnnoyingness
  if (component.defaultAnnoyingness !== undefined) {
    if (
      !validateNumber(
        component.defaultAnnoyingness,
        'defaultAnnoyingness',
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.default_annoyingness = component.defaultAnnoyingness;
  }

  // Validate defaultProjectileAnnoyingness
  if (component.defaultProjectileAnnoyingness !== undefined) {
    if (
      !validateNumber(
        component.defaultProjectileAnnoyingness,
        'defaultProjectileAnnoyingness',
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.default_projectile_annoyingness =
      component.defaultProjectileAnnoyingness;
  }

  // Validate maxAnger
  if (component.maxAnger !== undefined) {
    if (!validateNumber(component.maxAnger, 'maxAnger', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.max_anger = component.maxAnger;
  }

  // Validate nuisanceFilter
  if (component.nuisanceFilter !== undefined) {
    const convertedNuisanceFilter = convertEntityFilters(
      component.nuisanceFilter,
      withFieldPath(ctx, 'nuisanceFilter'),
    );
    if (!convertedNuisanceFilter) {
      return undefined;
    }
    result.nuisance_filter = convertedNuisanceFilter;
  }

  // Validate onIncreaseSounds
  if (component.onIncreaseSounds !== undefined) {
    if (!Array.isArray(component.onIncreaseSounds)) {
      console.error('onIncreaseSounds must be an array');

      return undefined;
    }
    for (const sound of component.onIncreaseSounds) {
      if (
        !validateSoundEvent(sound.sound, 'sound') ||
        !validateString(sound.condition, 'condition')
      ) {
        return undefined;
      }
    }
    result.on_increase_sounds = component.onIncreaseSounds;
  }

  // Validate removeTargetsBelowAngryThreshold
  if (component.removeTargetsBelowAngryThreshold !== undefined) {
    if (
      !validateBoolean(
        component.removeTargetsBelowAngryThreshold,
        'removeTargetsBelowAngryThreshold',
      )
    ) {
      return undefined;
    }
    result.remove_targets_below_angry_threshold =
      component.removeTargetsBelowAngryThreshold;
  }

  return {
    'minecraft:anger_level': result,
  };
};
