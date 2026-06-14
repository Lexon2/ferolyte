import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { HideComponent } from '../../../interfaces/components/miscellaneous/hide-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a HideComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertHideComponent = (
  component: Partial<HideComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:hide': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:hide': result,
  };
};
