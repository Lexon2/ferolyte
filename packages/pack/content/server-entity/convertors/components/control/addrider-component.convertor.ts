import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { AddRiderComponent } from '../../../interfaces/components/control/addrider-component';
import { validateString } from '../../common/validation';

/**
 * Converts an AddRiderComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertAddriderComponent = (
  component: Partial<AddRiderComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:addrider': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate entityType (required)
  if (!component.entityType) {
    console.error('entityType is required for addrider component');

    return undefined;
  }
  if (!validateString(component.entityType, 'entityType')) {
    return undefined;
  }
  result.entity_type = component.entityType;

  // Validate spawnEvent (optional)
  if (component.spawnEvent !== undefined) {
    if (!validateString(component.spawnEvent, 'spawnEvent')) {
      return undefined;
    }
    result.spawn_event = component.spawnEvent;
  }

  return {
    'minecraft:addrider': result,
  };
};
