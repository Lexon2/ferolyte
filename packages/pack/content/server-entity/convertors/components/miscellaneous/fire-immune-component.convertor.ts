import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { FireImmuneComponent } from '../../../interfaces/components/miscellaneous/fire-immune-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a FireImmuneComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertFireImmuneComponent = (
  component: Partial<FireImmuneComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:fire_immune': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  // Fire immune component has no properties, just return empty object
  return {
    'minecraft:fire_immune': result,
  };
};
