import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { IsHiddenWhenInvisibleComponent } from '../../../interfaces/components/states/is-hidden-when-invisible-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts an IsHiddenWhenInvisibleComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertIsHiddenWhenInvisibleComponent = (
  component: Partial<IsHiddenWhenInvisibleComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:is_hidden_when_invisible': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:is_hidden_when_invisible': result,
  };
};
