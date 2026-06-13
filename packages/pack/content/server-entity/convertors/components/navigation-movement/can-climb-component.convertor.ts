import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { CanClimbComponent } from '../../../interfaces/components/navigation-movement/can-climb-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a CanClimbComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertCanClimbComponent = (
  component: Partial<CanClimbComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:can_climb': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:can_climb': result,
  };
};
