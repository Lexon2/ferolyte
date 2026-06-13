import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { FloatsInLiquidComponent } from '../../../interfaces/components/navigation-movement/floats-in-liquid-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a FloatsInLiquidComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertFloatsInLiquidComponent = (
  component: Partial<FloatsInLiquidComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:floats_in_liquid': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:floats_in_liquid': result,
  };
};
