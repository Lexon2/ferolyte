import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { IsShakingComponent } from '../../../interfaces/components/states/is-shaking-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts an IsShakingComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertIsShakingComponent = (
  component: Partial<IsShakingComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:is_shaking': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:is_shaking': result,
  };
};
