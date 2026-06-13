import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { OnStartTakeoffComponent } from '../../../interfaces/components/event-hooks/on-start-takeoff-component';
import { convertTrigger } from '../../common/trigger.convertor';

/**
 * Converts an OnStartTakeoffComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertOnStartTakeoffComponent = (
  component: Partial<OnStartTakeoffComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:on_start_takeoff': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = convertTrigger(component, ctx);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:on_start_takeoff': result,
  };
};
