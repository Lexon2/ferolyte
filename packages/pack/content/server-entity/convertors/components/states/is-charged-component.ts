import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { IsChargedComponent } from '../../../interfaces/components/states/is-charged-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts an IsChargedComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertIsChargedComponent = (
  component: Partial<IsChargedComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:is_charged': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:is_charged': result,
  };
};
