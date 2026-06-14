import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { PushableByEntityComponent } from '../../../interfaces/components/physical/pushable-by-entity-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a PushableByEntityComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertPushableByEntityComponent = (
  component: Partial<PushableByEntityComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:pushable_by_entity': Record<string, never> } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:pushable_by_entity': result,
  };
};
