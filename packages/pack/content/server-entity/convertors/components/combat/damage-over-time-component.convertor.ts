import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { DamageOverTimeComponent } from '../../../interfaces/components/combat/damage-over-time-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts a DamageOverTimeComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertDamageOverTimeComponent = (
  component: Partial<DamageOverTimeComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:damage_over_time': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate damagePerHurt
  if (component.damagePerHurt !== undefined) {
    if (!validateNumber(component.damagePerHurt, 'damagePerHurt', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.damage_per_hurt = component.damagePerHurt;
  }

  // Validate timeBetweenHurt
  if (component.timeBetweenHurt !== undefined) {
    if (!validateNumber(component.timeBetweenHurt, 'timeBetweenHurt', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.time_between_hurt = component.timeBetweenHurt;
  }

  return {
    'minecraft:damage_over_time': result,
  };
};
