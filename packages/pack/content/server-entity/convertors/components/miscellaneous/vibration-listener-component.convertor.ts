import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { VibrationListenerComponent } from '../../../interfaces/components/miscellaneous/vibration-listener-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a VibrationListenerComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertVibrationListenerComponent = (
  component: Partial<VibrationListenerComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:vibration_listener': any } | undefined => {
  const result: any = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:vibration_listener': result,
  };
};
