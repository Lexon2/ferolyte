import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { RotationLockedToVehicleComponent } from '../../../interfaces/components/control/rotation-locked-to-vehicle-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a RotationLockedToVehicleComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertRotationLockedToVehicleComponent = (
  component: Partial<RotationLockedToVehicleComponent>,
  ctx?: ContentDiagnosticContext,
):
  | { 'minecraft:rotation_locked_to_vehicle': Record<string, never> }
  | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:rotation_locked_to_vehicle': result,
  };
};
