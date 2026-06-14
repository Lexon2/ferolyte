import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { UsesLegacyFrictionComponent } from '../../../interfaces/components/physical/uses-legacy-friction-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a UsesLegacyFrictionComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertUsesLegacyFrictionComponent = (
  component: Partial<UsesLegacyFrictionComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:uses_legacy_friction': Record<string, never> } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:uses_legacy_friction': result,
  };
};
