import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { TickWorldComponent } from '../../../interfaces/components/miscellaneous/tick-world-component';
import { validateBoolean, validateNumber } from '../../common/validation';

/**
 * Converts a TickWorldComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertTickWorldComponent = (
  component: TickWorldComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:tick_world': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  if (component.distanceToPlayers !== undefined) {
    if (!validateNumber(component.distanceToPlayers, 'distanceToPlayers')) {
      return undefined;
    }
    result.distance_to_players = component.distanceToPlayers;
  }

  if (component.neverDespawn !== undefined) {
    if (!validateBoolean(component.neverDespawn, 'neverDespawn')) {
      return undefined;
    }
    result.never_despawn = component.neverDespawn;
  }

  if (component.radius !== undefined) {
    if (!validateNumber(component.radius, 'radius')) {
      return undefined;
    }
    result.radius = component.radius;
  }

  return {
    'minecraft:tick_world': result,
  };
};
