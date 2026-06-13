import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { OnStartLandingComponent } from '../../../interfaces/components/event-hooks/on-start-landing-component';
import { convertTrigger } from '../../common/trigger.convertor';

/**
 * Converts an OnStartLandingComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertOnStartLandingComponent = (
  component: Partial<OnStartLandingComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:on_start_landing': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = convertTrigger(component, ctx);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:on_start_landing': result,
  };
};
