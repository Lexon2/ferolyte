import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { RailSensorComponent } from '../../../interfaces/components/sensors/rail-sensor-component';
import { convertTrigger } from '../../common/trigger.convertor';
import { validateBoolean } from '../../common/validation';

/**
 * Converts a RailSensorComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertRailSensorComponent = (
  component: Partial<RailSensorComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:rail_sensor': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  if (component.checkBlockTypes !== undefined) {
    if (!validateBoolean(component.checkBlockTypes, 'check_block_types')) {
      return undefined;
    }
    result.check_block_types = component.checkBlockTypes;
  }

  if (component.ejectOnActivate !== undefined) {
    if (!validateBoolean(component.ejectOnActivate, 'eject_on_activate')) {
      return undefined;
    }
    result.eject_on_activate = component.ejectOnActivate;
  }

  if (component.ejectOnDeactivate !== undefined) {
    if (!validateBoolean(component.ejectOnDeactivate, 'eject_on_deactivate')) {
      return undefined;
    }
    result.eject_on_deactivate = component.ejectOnDeactivate;
  }

  if (component.onActivate !== undefined) {
    const convertedOnActivate = convertTrigger(component.onActivate, withFieldPath(ctx, 'onActivate'));
    if (!convertedOnActivate) {
      return undefined;
    }
    result.on_activate = convertedOnActivate;
  }

  if (component.onDeactivate !== undefined) {
    const convertedOnDeactivate = convertTrigger(component.onDeactivate, withFieldPath(ctx, 'onDeactivate'));
    if (!convertedOnDeactivate) {
      return undefined;
    }
    result.on_deactivate = convertedOnDeactivate;
  }

  if (component.tickCommandBlockOnActivate !== undefined) {
    if (!validateBoolean(component.tickCommandBlockOnActivate, 'tick_command_block_on_activate')) {
      return undefined;
    }
    result.tick_command_block_on_activate = component.tickCommandBlockOnActivate;
  }

  if (component.tickCommandBlockOnDeactivate !== undefined) {
    if (!validateBoolean(component.tickCommandBlockOnDeactivate, 'tick_command_block_on_deactivate')) {
      return undefined;
    }
    result.tick_command_block_on_deactivate = component.tickCommandBlockOnDeactivate;
  }

  return {
    'minecraft:rail_sensor': result
  };
};
