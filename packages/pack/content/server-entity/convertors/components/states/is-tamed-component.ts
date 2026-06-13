import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { IsTamedComponent } from '../../../interfaces/components/states/is-tamed-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts an IsTamedComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertIsTamedComponent = (
  component: Partial<IsTamedComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:is_tamed': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:is_tamed': result,
  };
};
