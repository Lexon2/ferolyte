import { ContentDiagnosticContext } from '../../../../common/diagnostics/content-diagnostic';
import { validateBooleanValue } from '../../../../common/validation/content-validation';

/**
 * Creates a stacked_by_data component for Minecraft items
 * @param value Whether items with different data values can stack together
 * @returns The stacked_by_data component in Minecraft format or undefined if validation fails
 */
export const createStackedByData = (
  value?: boolean,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:stacked_by_data': boolean } | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (!validateBooleanValue(value, ctx, 'Stacked by data must be a boolean')) {
    return undefined;
  }

  return {
    'minecraft:stacked_by_data': value,
  };
};
