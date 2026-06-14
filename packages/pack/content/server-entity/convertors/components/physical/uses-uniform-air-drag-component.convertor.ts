import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { UsesUniformAirDragComponent } from '../../../interfaces/components/physical/uses-uniform-air-drag-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a UsesUniformAirDragComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertUsesUniformAirDragComponent = (
  component: Partial<UsesUniformAirDragComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:uses_uniform_air_drag': Record<string, never> } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:uses_uniform_air_drag': result,
  };
};
