import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { AdmireItemComponent } from '../../../interfaces/components/combat/admire-item-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts an AdmireItemComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertAdmireItemComponent = (
  component: Partial<AdmireItemComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:admire_item': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate cooldownAfterBeingAttacked
  if (component.cooldownAfterBeingAttacked !== undefined) {
    if (
      !validateNumber(
        component.cooldownAfterBeingAttacked,
        'cooldownAfterBeingAttacked',
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.cooldown_after_being_attacked = component.cooldownAfterBeingAttacked;
  }

  // Validate duration
  if (component.duration !== undefined) {
    if (
      !validateNumber(
        component.duration,
        'duration',
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.duration = component.duration;
  }

  return {
    'minecraft:admire_item': result,
  };
};
