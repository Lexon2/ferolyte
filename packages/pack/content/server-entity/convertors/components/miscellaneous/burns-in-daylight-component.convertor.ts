import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { BurnsInDaylightComponent } from '../../../interfaces/components/miscellaneous/burns-in-daylight-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a BurnsInDaylightComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertBurnsInDaylightComponent = (
  component: Partial<BurnsInDaylightComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:burns_in_daylight': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:burns_in_daylight': result,
  };
};
