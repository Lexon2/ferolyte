import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { ItemHopperComponent } from '../../../interfaces/components/interaction/item-hopper-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts an ItemHopperComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertItemHopperComponent = (
  component: Partial<ItemHopperComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:item_hopper': any } | undefined => {
  const result: any = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:item_hopper': result,
  };
};
