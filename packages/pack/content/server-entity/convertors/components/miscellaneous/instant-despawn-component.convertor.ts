import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { InstantDespawnComponent } from '../../../interfaces/components/miscellaneous/instant-despawn-component';

/**
 * Converts an InstantDespawnComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertInstantDespawnComponent = (
  component: Partial<InstantDespawnComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:instant_despawn': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate removeChildEntities
  if (component.removeChildEntities !== undefined) {
    if (typeof component.removeChildEntities !== 'boolean') {
      console.error('removeChildEntities must be a boolean');

      return undefined;
    }
    result.remove_child_entities = component.removeChildEntities;
  }

  return {
    'minecraft:instant_despawn': result,
  };
};
