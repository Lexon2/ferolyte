import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { OnFriendlyAngerComponent } from '../../../interfaces/components/event-hooks/on-friendly-anger-component';
import { convertTrigger } from '../../common/trigger.convertor';

/**
 * Converts an OnFriendlyAngerComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertOnFriendlyAngerComponent = (
  component: Partial<OnFriendlyAngerComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:on_friendly_anger': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = convertTrigger(component, ctx);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:on_friendly_anger': result,
  };
};
