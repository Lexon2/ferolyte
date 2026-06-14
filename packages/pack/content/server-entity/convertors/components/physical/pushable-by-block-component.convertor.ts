import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { PushableByBlockComponent } from '../../../interfaces/components/physical/pushable-by-block-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a PushableByBlockComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertPushableByBlockComponent = (
  component: Partial<PushableByBlockComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:pushable_by_block': Record<string, never> } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:pushable_by_block': result,
  };
};
