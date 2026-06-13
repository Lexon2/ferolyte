import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { RotationAxisAlignedComponent } from '../../../interfaces/components/physical/rotation-axis-aligned-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a RotationAxisAlignedComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertRotationAxisAlignedComponent = (
  component: Partial<RotationAxisAlignedComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:rotation_axis_aligned': Record<string, never> } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:rotation_axis_aligned': result,
  };
};
