import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';

import { DWELLER_ROLES } from '../../../constants/dweller-roles';
import { DWELLER_TYPES } from '../../../constants/dweller-types';
import { DwellerComponent } from '../../../interfaces/components/ai/dweller-component';
import { validateNumber } from '../../common/validation';

/**
 * Validates a dweller role
 * @param value The value to validate
 * @param fieldName The name of the field being validated
 * @returns True if valid, false otherwise
 */
export const validateDwellerRole = (value: any, fieldName: string): boolean => {
  if (!DWELLER_ROLES.includes(value)) {
    console.error(`${fieldName} must be one of: ${DWELLER_ROLES.join(', ')}`);

    return false;
  }
  return true;
};

/**
 * Validates a dweller type
 * @param value The value to validate
 * @param fieldName The name of the field being validated
 * @returns True if valid, false otherwise
 */
export const validateDwellerType = (value: any, fieldName: string): boolean => {
  if (!DWELLER_TYPES.includes(value)) {
    console.error(`${fieldName} must be one of: ${DWELLER_TYPES.join(', ')}`);

    return false;
  }
  return true;
};

/**
 * Converts a DwellerComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertDwellerComponent = (
  component: Partial<DwellerComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:dweller': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate dwellerType
  if (component.dwellingType !== undefined) {
    if (!validateDwellerType(component.dwellingType, 'dwellingType')) {
      return undefined;
    }
    result.dwelling_type = component.dwellingType;
  }

  // Validate dwellerRole
  if (component.dwellerRole !== undefined) {
    if (!validateDwellerRole(component.dwellerRole, 'dwellerRole')) {
      return undefined;
    }
    result.dweller_role = component.dwellerRole;
  }

  // Validate updateIntervalBase
  if (component.updateIntervalBase !== undefined) {
    if (
      !validateNumber(
        component.updateIntervalBase,
        'updateIntervalBase',
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.update_interval_base = component.updateIntervalBase;
  }

  // Validate updateIntervalVariant
  if (component.updateIntervalVariant !== undefined) {
    if (
      !validateNumber(
        component.updateIntervalVariant,
        'updateIntervalVariant',
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.update_interval_variant = component.updateIntervalVariant;
  }

  // Validate canFindPoi
  if (component.canFindPoi !== undefined) {
    if (typeof component.canFindPoi !== 'boolean') {
      console.error('canFindPoi must be a boolean');

      return undefined;
    }
    result.can_find_poi = component.canFindPoi;
  }

  // Validate canMigrate
  if (component.canMigrate !== undefined) {
    if (typeof component.canMigrate !== 'boolean') {
      console.error('canMigrate must be a boolean');

      return undefined;
    }
    result.can_migrate = component.canMigrate;
  }

  // Validate firstFoundingReward
  if (component.firstFoundingReward !== undefined) {
    if (
      !validateNumber(
        component.firstFoundingReward,
        'firstFoundingReward',
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.first_founding_reward = component.firstFoundingReward;
  }

  return {
    'minecraft:dweller': result,
  };
};
