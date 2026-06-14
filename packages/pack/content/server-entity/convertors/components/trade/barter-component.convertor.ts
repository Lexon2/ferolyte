import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { BarterComponent } from '../../../interfaces/components/trade/barter-component';
import { validateNumber, validateString } from '../../common/validation';

/**
 * Converts a BarterComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertBarterComponent = (
  component: Partial<BarterComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:barter': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate barterTable (required)
  if (component.barterTable === undefined) {
    console.error('barterTable is required for barter component');

    return undefined;
  }
  if (!validateString(component.barterTable, 'barterTable')) {
    return undefined;
  }
  result.barter_table = component.barterTable;

  // Validate cooldownAfterBeingAttacked
  if (component.cooldownAfterBeingAttacked !== undefined) {
    if (!validateNumber(component.cooldownAfterBeingAttacked, 'cooldownAfterBeingAttacked', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.cooldown_after_being_attacked = component.cooldownAfterBeingAttacked;
  }

  return {
    'minecraft:barter': result,
  };
};
