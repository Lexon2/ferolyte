import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { VibrationDamperComponent } from '../../../interfaces/components/miscellaneous/vibration-damper-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a VibrationDamperComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertVibrationDamperComponent = (
  component: Partial<VibrationDamperComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:vibration_damper': any } | undefined => {
  const result: any = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:vibration_damper': result,
  };
};
