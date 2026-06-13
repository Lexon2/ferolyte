import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { RemoveInPeacefulComponent } from '../../../interfaces/components/miscellaneous/remove-in-peaceful-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a RemoveInPeacefulComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertRemoveInPeacefulComponent = (
  component: Partial<RemoveInPeacefulComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:remove_in_peaceful': Record<string, never> } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:remove_in_peaceful': result,
  };
};
