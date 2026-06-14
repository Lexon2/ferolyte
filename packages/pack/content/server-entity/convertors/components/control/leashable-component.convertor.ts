import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { LeashableComponent } from '../../../interfaces/components/control/leashable-component';
import { convertEntityFilters } from '../../common/filters.convertor';
import { convertTrigger } from '../../common/trigger.convertor';
import { validateBoolean, validateNumber } from '../../common/validation';
import { validateSpringType } from '../../validation/leashable-string-type';

/**
 * Validates a leashable preset
 * @param preset The preset to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the preset is valid
 */
const convertLeashablePreset = (
  preset: any,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): any | undefined => {
  if (!preset) {
    return undefined;
  }

  const result: any = {};

  // Validate filter'
  if (preset.filter !== undefined) {
    const convertedFilter = convertEntityFilters(preset.filter, withFieldPath(ctx, 'filter'));
    if (!convertedFilter) {
      return undefined;
    }
    result.filter = convertedFilter;
  }

  // Validate hardDistance
  if (preset.hardDistance !== undefined) {
    if (
      !validateNumber(
        preset.hardDistance,
        `${fieldName}.hardDistance`,
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.hard_distance = preset.hardDistance;
  }

  // Validate maxDistance
  if (preset.maxDistance !== undefined) {
    if (
      !validateNumber(
        preset.maxDistance,
        `${fieldName}.maxDistance`,
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.max_distance = preset.maxDistance;
  }

  // Validate softDistance
  if (preset.softDistance !== undefined) {
    if (
      !validateNumber(
        preset.softDistance,
        `${fieldName}.softDistance`,
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.soft_distance = preset.softDistance;
  }

  // Validate springType
  if (preset.springType !== undefined) {
    if (!validateSpringType(preset.springType)) {
      return undefined;
    }
    result.spring_type = preset.springType;
  }
  return result;
};

/**
 * Converts a LeashableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertLeashableComponent = (
  component: Partial<LeashableComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:leashable': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate canBeStolen
  if (component.canBeStolen !== undefined) {
    if (!validateBoolean(component.canBeStolen, 'canBeStolen')) {
      return undefined;
    }
    result.can_be_stolen = component.canBeStolen;
  }

  // Validate onUnleashInteractOnly
  if (component.onUnleashInteractOnly !== undefined) {
    if (
      !validateBoolean(component.onUnleashInteractOnly, 'onUnleashInteractOnly')
    ) {
      return undefined;
    }
    result.on_unleash_interact_only = component.onUnleashInteractOnly;
  }

  // Validate hardDistance
  if (component.hardDistance !== undefined) {
    if (
      !validateNumber(
        component.hardDistance,
        'hardDistance',
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.hard_distance = component.hardDistance;
  }

  // Validate maxDistance
  if (component.maxDistance !== undefined) {
    if (
      !validateNumber(component.maxDistance, 'maxDistance', 0, Number.MAX_VALUE)
    ) {
      return undefined;
    }
    result.max_distance = component.maxDistance;
  }

  // Validate onLeash
  if (component.onLeash !== undefined) {
    const convertedOnLeash = convertTrigger(component.onLeash, withFieldPath(ctx, 'onLeash'));
    if (!convertedOnLeash) {
      return undefined;
    }
    result.on_leash = convertedOnLeash;
  }

  // Validate onUnleash
  if (component.onUnleash !== undefined) {
    const convertedOnUnleash = convertTrigger(component.onUnleash, withFieldPath(ctx, 'onUnleash'));
    if (!convertedOnUnleash) {
      return undefined;
    }
    result.on_unleash = convertedOnUnleash;
  }

  // Validate softDistance
  if (component.softDistance !== undefined) {
    if (
      !validateNumber(
        component.softDistance,
        'softDistance',
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.soft_distance = component.softDistance;
  }

  // Validate presets
  if (component.presets !== undefined) {
    if (!Array.isArray(component.presets)) {
      console.error('presets must be an array');

      return undefined;
    }

    const validatedPresets = component.presets.map((preset, index) => {
      return convertLeashablePreset(
        preset,
        `presets[${index}]`,
        withFieldPath(ctx, `presets[${index}]`),
      );
    });

    if (validatedPresets.includes(undefined)) {
      return undefined;
    }

    result.presets = validatedPresets;
  }

  return {
    'minecraft:leashable': result,
  };
};
