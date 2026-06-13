import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { LeashableToComponent } from '../../../interfaces/components/control';
import { validateBoolean } from '../../common/validation';

/**
 * Converts a LeashableToComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertLeashableToComponent = (
  component?: LeashableToComponent,
  ctx?: ContentDiagnosticContext
): { 'minecraft:leashable_to': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  if (component.canRetrieveFrom !== undefined) {
    if (!validateBoolean(component.canRetrieveFrom, 'canRetrieveFrom')) {
      return undefined;
    }

    result.can_retrieve_from = component.canRetrieveFrom;
  }

  return {
    'minecraft:leashable_to': result,
  };
};
