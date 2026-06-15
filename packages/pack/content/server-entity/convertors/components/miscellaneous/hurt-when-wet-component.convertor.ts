import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { HurtWhenWetComponent } from '../../../interfaces/components/miscellaneous/hurt-when-wet-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a HurtWhenWetComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertHurtWhenWetComponent = (
  component: Partial<HurtWhenWetComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:hurt_when_wet': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:hurt_when_wet': result,
  };
};
