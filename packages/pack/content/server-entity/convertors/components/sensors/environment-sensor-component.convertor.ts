import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { EnvironmentSensorComponent } from '../../../interfaces/components/sensors/environment-sensor-component';
import { convertTrigger } from '../../common/trigger.convertor';

/**
 * Converts an EnvironmentSensorComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertEnvironmentSensorComponent = (
  component: Partial<EnvironmentSensorComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:environment_sensor': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  if (component.triggers) {
    const triggers = component.triggers
      .map((trigger) => convertTrigger(trigger))
      .filter(Boolean);

    if (triggers.length > 0) {
      result.triggers = triggers;
    }
  }

  return { 'minecraft:environment_sensor': result };
};
