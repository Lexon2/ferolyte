import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { InsomniaComponent } from '../../../interfaces/components/miscellaneous/insomnia-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts an InsomniaComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertInsomniaComponent = (
  component: Partial<InsomniaComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:insomnia': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate daysUntilInsomnia
  if (component.daysUntilInsomnia !== undefined) {
    if (!validateNumber(component.daysUntilInsomnia, 'daysUntilInsomnia', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.days_until_insomnia = component.daysUntilInsomnia;
  }

  return {
    'minecraft:insomnia': result,
  };
};
