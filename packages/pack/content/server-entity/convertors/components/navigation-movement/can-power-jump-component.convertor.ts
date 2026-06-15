import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { CanPowerJumpComponent } from '../../../interfaces/components/navigation-movement/can-power-jump-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a CanPowerJumpComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertCanPowerJumpComponent = (
  component: Partial<CanPowerJumpComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:can_power_jump': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:can_power_jump': result,
  };
};
