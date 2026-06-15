import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { CanFlyComponent } from '../../../interfaces/components/navigation-movement/can-fly-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a CanFlyComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertCanFlyComponent = (
  component: Partial<CanFlyComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:can_fly': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return;
  }

  return {
    'minecraft:can_fly': result,
  };
};
