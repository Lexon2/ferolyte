import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { OnWakeWithOwnerComponent } from '../../../interfaces/components/event-hooks/on-wake-with-owner-component';
import { convertTrigger } from '../../common/trigger.convertor';

/**
 * Converts an OnWakeWithOwnerComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertOnWakeWithOwnerComponent = (
  component: Partial<OnWakeWithOwnerComponent>,
  ctx?: ContentDiagnosticContext
): Record<string, any> | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = convertTrigger(component, ctx);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:on_wake_with_owner': result,
  };
};
