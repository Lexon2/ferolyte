import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { OnDeathComponent } from '../../../interfaces/components/event-hooks/on-death-component';
import { convertTrigger } from '../../common/trigger.convertor';

/**
 * Converts an OnDeathComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertOnDeathComponent = (
  component: Partial<OnDeathComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:on_death': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = convertTrigger(component, ctx);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:on_death': result,
  };
};
