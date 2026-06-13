import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { IsSaddledComponent } from '../../../interfaces/components/states/is-saddled-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts an IsSaddledComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertIsSaddledComponent = (
  component: Partial<IsSaddledComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:is_saddled': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:is_saddled': result,
  };
};
