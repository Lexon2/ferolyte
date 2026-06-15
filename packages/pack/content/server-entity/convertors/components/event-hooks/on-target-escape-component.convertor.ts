import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { OnTargetEscapeComponent } from '../../../interfaces/components/event-hooks/on-target-escape-component';
import { convertTrigger } from '../../common/trigger.convertor';

/**
 * Converts an OnTargetEscapeComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertOnTargetEscapeComponent = (
  component: Partial<OnTargetEscapeComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:on_target_escape': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = convertTrigger(component, ctx);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:on_target_escape': result,
  };
};
