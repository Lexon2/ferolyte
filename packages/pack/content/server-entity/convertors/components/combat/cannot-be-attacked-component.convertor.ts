import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { CannotBeAttackedComponent } from '../../../interfaces/components/combat/cannot-be-attacked-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a CannotBeAttackedComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertCannotBeAttackedComponent = (
  component: Partial<CannotBeAttackedComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:cannot_be_attacked': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:cannot_be_attacked': result,
  };
};
