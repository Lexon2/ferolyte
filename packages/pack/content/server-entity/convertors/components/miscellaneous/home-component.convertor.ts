import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { HomeComponent } from '../../../interfaces/components/miscellaneous/home-component';
import { validateNumber, validateStringArray } from '../../common/validation';
import { validateHomeRestrictionType } from '../../validation/home-restriction-type';

/**
 * Converts a HomeComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertHomeComponent = (
  component: Partial<HomeComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:home': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate restrictionRadius
  if (component.restrictionRadius !== undefined) {
    if (
      !validateNumber(
        component.restrictionRadius,
        'restrictionRadius',
        -1,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.restriction_radius = component.restrictionRadius;
  }

  // Validate restrictionBlockList
  if (component.homeBlockList !== undefined) {
    if (!validateStringArray(component.homeBlockList, 'homeBlockList')) {
      return undefined;
    }

    result.home_block_list = component.homeBlockList;
  }

  if (component.restrictionType !== undefined) {
    if (!validateHomeRestrictionType(component.restrictionType)) {
      return undefined;
    }
    result.restriction_type = component.restrictionType;
  }

  return {
    'minecraft:home': result,
  };
};
