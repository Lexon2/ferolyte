import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { InputGroundControlledComponent } from '../../../interfaces/components/control/input-ground-controlled-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts an InputGroundControlledComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertInputGroundControlledComponent = (
  component: Partial<InputGroundControlledComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:input_ground_controlled': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  // Input ground controlled component has no properties, just return empty object
  return {
    'minecraft:input_ground_controlled': {},
  };
};
